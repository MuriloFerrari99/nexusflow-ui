import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
}

interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  can_edit?: boolean;
  can_assign_tasks?: boolean;
  added_by: string;
  added_at: string;
  profile?: Profile;
}

interface ProjectMemberManagerProps {
  projectId: string;
}

export const ProjectMemberManager = ({ projectId }: ProjectMemberManagerProps) => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [canEdit, setCanEdit] = useState(false);
  const [canAssignTasks, setCanAssignTasks] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch project members with profiles in separate calls for better type safety
  const { data: members, isLoading } = useQuery<ProjectMember[]>({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const { data: memberData, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      // Fetch profiles separately
      if (memberData && memberData.length > 0) {
        const userIds = memberData.map(m => m.user_id);
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', userIds);
        
        if (profileError) throw profileError;
        
        // Combine data
        return memberData.map(member => ({
          ...member,
          profile: profiles?.find(p => p.id === member.user_id)
        })) as ProjectMember[];
      }
      
      return (memberData || []) as ProjectMember[];
    }
  });

  // Fetch available users for invitation
  const { data: availableUsers } = useQuery({
    queryKey: ['available-users', projectId, searchEmail],
    queryFn: async () => {
      if (!searchEmail || searchEmail.length < 3) return [];
      
      const memberUserIds = members?.map(m => m.user_id) || [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .ilike('email', `%${searchEmail}%`)
        .not('id', 'in', `(${memberUserIds.length > 0 ? memberUserIds.join(',') : 'null'})`)
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: searchEmail.length >= 3
  });

  // Add member mutation
  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          role: selectedRole,
          can_edit: canEdit,
          can_assign_tasks: canAssignTasks,
          added_by: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      setIsAddingMember(false);
      setSearchEmail("");
      toast.success("Membro adicionado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao adicionar membro");
    }
  });

  // Remove member mutation
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      toast.success("Membro removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover membro");
    }
  });

  // Update member permissions mutation
  const updateMember = useMutation({
    mutationFn: async ({ memberId, updates }: { memberId: string; updates: any }) => {
      const { error } = await supabase
        .from('project_members')
        .update(updates)
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectId] });
      toast.success("Permissões atualizadas!");
    },
    onError: () => {
      toast.error("Erro ao atualizar permissões");
    }
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Proprietário';
      case 'admin': return 'Administrador';
      case 'member': return 'Membro';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Carregando membros...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Membros do Projeto
          </CardTitle>
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Membro</DialogTitle>
                <DialogDescription>
                  Busque por email para adicionar um membro ao projeto
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email do usuário</Label>
                  <Input
                    id="email"
                    placeholder="Digite o email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                </div>

                {availableUsers && availableUsers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Usuários encontrados:</Label>
                    {availableUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback>{user.full_name?.[0] || user.email[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name || user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addMember.mutate(user.id)}
                          disabled={addMember.isPending}
                        >
                          Adicionar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-edit">Pode editar projeto</Label>
                    <Switch 
                      id="can-edit"
                      checked={canEdit}
                      onCheckedChange={setCanEdit}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-assign">Pode atribuir tarefas</Label>
                    <Switch 
                      id="can-assign"
                      checked={canAssignTasks}
                      onCheckedChange={setCanAssignTasks}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingMember(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {members?.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {member.profile?.full_name?.[0] || member.profile?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium">{member.profile?.full_name || member.profile?.email || "Usuário"}</p>
                  <p className="text-sm text-muted-foreground">{member.profile?.email || ""}</p>
                  
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className={getRoleColor(member.role)}>
                      {getRoleLabel(member.role)}
                    </Badge>
                    {member.can_edit && (
                      <Badge variant="outline" className="text-xs">Pode editar</Badge>
                    )}
                    {member.can_assign_tasks && (
                      <Badge variant="outline" className="text-xs">Atribui tarefas</Badge>
                    )}
                  </div>
                </div>
              </div>

              {member.role !== 'owner' && (
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Permissões</DialogTitle>
                        <DialogDescription>
                          Altere as permissões de {member.profile?.full_name || "usuário"}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Função</Label>
                          <Select 
                            defaultValue={member.role}
                            onValueChange={(value) => updateMember.mutate({
                              memberId: member.id,
                              updates: { role: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Membro</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Pode editar projeto</Label>
                            <Switch 
                              defaultChecked={member.can_edit}
                              onCheckedChange={(checked) => updateMember.mutate({
                                memberId: member.id,
                                updates: { can_edit: checked }
                              })}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Pode atribuir tarefas</Label>
                            <Switch 
                              defaultChecked={member.can_assign_tasks}
                              onCheckedChange={(checked) => updateMember.mutate({
                                memberId: member.id,
                                updates: { can_assign_tasks: checked }
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeMember.mutate(member.id)}
                    disabled={removeMember.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {(!members || members.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum membro adicionado ainda
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};