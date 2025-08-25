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

interface ProjectCommentsProps {
  projectId: string;
  entityType?: string;
}

export const ProjectComments = ({ projectId, entityType = "project" }: ProjectCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['project-comments', projectId, entityType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          ),
          mentions (
            id,
            mentioned_user_id,
            profiles!mentions_mentioned_user_id_fkey (
              full_name,
              email
            )
          )
        `)
        .eq('entity_id', projectId)
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch team members for mentions
  const { data: teamMembers } = useQuery({
    queryKey: ['project-team-members', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('project_id', projectId);
      
      if (error) throw error;
      return data.map(m => m.profiles).filter(Boolean);
    }
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      // Create comment
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          entity_id: projectId,
          entity_type: entityType,
          content: newComment,
          user_id: user.id,
          company_id: (await supabase.from('profiles').select('company_id').eq('id', user.id).single()).data?.company_id,
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
          company_id: comment.company_id
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

  const renderCommentContent = (content: string, mentions: any[]) => {
    let processedContent = content;
    
    mentions?.forEach(mention => {
      const mentionText = `@${mention.profiles?.full_name || mention.profiles?.email}`;
      processedContent = processedContent.replace(
        new RegExp(`@${mention.profiles?.full_name || mention.profiles?.email}`, 'g'),
        `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mx-1">${mentionText}</span>`
      );
    });

    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
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
                <AvatarImage src={comment.profiles?.avatar_url} />
                <AvatarFallback>
                  {comment.profiles?.full_name?.[0] || comment.profiles?.email[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {comment.profiles?.full_name || comment.profiles?.email}
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
                  {renderCommentContent(comment.content, comment.mentions)}
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