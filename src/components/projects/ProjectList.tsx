import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, Calendar, Eye } from "lucide-react";
import { ProjectForm } from "./ProjectForm";
import { ProjectMemberManager } from "./ProjectMemberManager";
import { ProjectComments } from "./ProjectComments";
import { ProjectDRE } from "./ProjectDRE";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const ProjectList = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_tasks (id, status),
          project_members (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir projeto');
      console.error(error);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'on_hold': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planejamento';
      case 'active': return 'Ativo';
      case 'on_hold': return 'Em Pausa';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projetos</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProject(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <ProjectForm 
              project={selectedProject} 
              onClose={() => {
                setIsFormOpen(false);
                setSelectedProject(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProjectForDetails(project)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <ProjectForm 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteProject.mutate(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(project.priority)}>
                  {getPriorityLabel(project.priority)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span>{Math.round(project.progress || 0)}%</span>
                  </div>
                  <Progress value={project.progress || 0} className="h-2" />
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {project.project_members?.length || 0} membros
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {project.end_date ? new Date(project.end_date).toLocaleDateString('pt-BR') : 'Sem prazo'}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Tarefas:</strong> {project.project_tasks?.length || 0} total
                {project.project_tasks && (
                  <span className="ml-2">
                    ({project.project_tasks.filter(t => t.status === 'concluida').length} concluídas)
                  </span>
                )}
              </div>

              {project.budget && (
                <div className="text-sm text-muted-foreground">
                  <strong>Orçamento:</strong> {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(project.budget)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!projects || projects.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro projeto para organizar suas tarefas e equipe.
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProjectForDetails} onOpenChange={(open) => !open && setSelectedProjectForDetails(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProjectForDetails?.name}</DialogTitle>
            <DialogDescription>
              {selectedProjectForDetails?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjectForDetails && (
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="financeiro">DRE do Projeto</TabsTrigger>
                <TabsTrigger value="comments">Comentários</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <ProjectMemberManager projectId={selectedProjectForDetails.id} />
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações do Projeto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="secondary" className={getStatusColor(selectedProjectForDetails.status)}>
                            {getStatusLabel(selectedProjectForDetails.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prioridade:</span>
                          <Badge variant={selectedProjectForDetails.priority === 'high' ? 'destructive' : 'secondary'}>
                            {getPriorityLabel(selectedProjectForDetails.priority)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Progresso:</span>
                          <span>{Math.round(selectedProjectForDetails.progress || 0)}%</span>
                        </div>
                        {selectedProjectForDetails.start_date && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Início:</span>
                            <span>{new Date(selectedProjectForDetails.start_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                        {selectedProjectForDetails.end_date && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Prazo:</span>
                            <span>{new Date(selectedProjectForDetails.end_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financeiro" className="space-y-6">
                <ProjectDRE projectId={selectedProjectForDetails.id} />
              </TabsContent>

              <TabsContent value="comments" className="space-y-6">
                <ProjectComments projectId={selectedProjectForDetails.id} entityType="project" />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};