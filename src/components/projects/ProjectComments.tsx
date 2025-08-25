import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Profile {
  id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
}

interface Comment {
  id: string;
  entity_id: string;
  entity_type: string;
  content: string;
  user_id: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
  mentions?: any[];
  profile?: Profile;
}

interface ProjectCommentsProps {
  projectId: string;
  entityType?: string;
}

export const ProjectComments = ({ projectId, entityType = "project" }: ProjectCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  
  const queryClient = useQueryClient();

  // Fetch comments with profiles in separate calls for better type safety
  const { data: comments, isLoading } = useQuery({
    queryKey: ['project-comments', projectId, entityType],
    queryFn: async () => {
      const { data: commentData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('entity_id', projectId)
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (commentData && commentData.length > 0) {
        // Fetch user profiles for comments
        const userIds = commentData.map(c => c.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', userIds);
        
        if (profileError) throw profileError;
        
        // Fetch mentions for comments
        const commentIds = commentData.map(c => c.id);
        const { data: mentionData, error: mentionError } = await supabase
          .from('mentions')
          .select('id, comment_id, mentioned_user_id')
          .in('comment_id', commentIds);
        
        if (mentionError) throw mentionError;
        
        // Combine data
        return commentData.map(comment => ({
          ...comment,
          profile: profiles?.find(p => p.id === comment.user_id),
          mentions: mentionData?.filter(m => m.comment_id === comment.id) || []
        }));
      }
      
      return commentData || [];
    }
  });

  // Fetch team members for mentions
  const { data: teamMembers } = useQuery({
    queryKey: ['project-team-members', projectId],
    queryFn: async () => {
      const { data: memberData, error } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      if (memberData && memberData.length > 0) {
        const userIds = memberData.map(m => m.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);
        
        if (profileError) throw profileError;
        return profiles || [];
      }
      
      return [];
    }
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      // Get user's company_id
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      // Create comment
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          entity_id: projectId,
          entity_type: entityType,
          content: newComment,
          user_id: user.id,
          company_id: userProfile?.company_id,
          mentions: mentionedUsers
        })
        .select()
        .single();
      
      if (commentError) throw commentError;

      // Create mentions if any
      if (mentionedUsers.length > 0) {
        const mentionData = mentionedUsers.map(userId => ({
          comment_id: comment.id,
          mentioned_user_id: userId,
          company_id: userProfile?.company_id
        }));

        const { error: mentionError } = await supabase
          .from('mentions')
          .insert(mentionData);
        
        if (mentionError) throw mentionError;
      }

      return comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId, entityType] });
      setNewComment("");
      setMentionedUsers([]);
      toast.success("Comentário adicionado!");
    },
    onError: () => {
      toast.error("Erro ao adicionar comentário");
    }
  });

  const handleMention = (userId: string, userName: string) => {
    const mention = `@${userName}`;
    const currentText = newComment;
    const newText = currentText + (currentText ? ' ' : '') + mention + ' ';
    
    setNewComment(newText);
    setMentionedUsers(prev => [...new Set([...prev, userId])]);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Carregando comentários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentários ({comments?.length || 0})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add new comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Adicione um comentário... Use @ para mencionar membros da equipe"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          
          {/* Quick mention buttons */}
          {teamMembers && teamMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Mencionar:</span>
              {teamMembers.map((member) => (
                <Button
                  key={member.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleMention(member.id, member.full_name || member.email)}
                  className="h-6 text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  {member.full_name || member.email}
                </Button>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              onClick={() => addComment.mutate()}
              disabled={!newComment.trim() || addComment.isPending}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              Comentar
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 border rounded-lg">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.profile?.avatar_url || ""} />
                <AvatarFallback>
                  {comment.profile?.full_name?.[0] || comment.profile?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {comment.profile?.full_name || comment.profile?.email || "Usuário"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                  {comment.mentions && comment.mentions.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {comment.mentions.length} menção(ões)
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm">
                  {comment.content}
                </div>
              </div>
            </div>
          ))}

          {(!comments || comments.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum comentário ainda</p>
              <p className="text-xs">Seja o primeiro a comentar neste projeto!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};