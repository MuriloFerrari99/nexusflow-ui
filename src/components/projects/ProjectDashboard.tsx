import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

export const ProjectDashboard = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_tasks (id, status, priority),
          project_members (id, user_id)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['project-stats'],
    queryFn: async () => {
      const { data: projectCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact' });

      const { data: activeProjects } = await supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('status', 'active');

      const { data: tasksTotal } = await supabase
        .from('project_tasks')
        .select('id', { count: 'exact' });

      const { data: tasksCompleted } = await supabase
        .from('project_tasks')
        .select('id', { count: 'exact' })
        .eq('status', 'concluida');

      return {
        totalProjects: projectCount?.length || 0,
        activeProjects: activeProjects?.length || 0,
        totalTasks: tasksTotal?.length || 0,
        completedTasks: tasksCompleted?.length || 0
      };
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge variant="secondary" className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{Math.round(project.progress || 0)}%</span>
                </div>
                <Progress value={project.progress || 0} className="h-2" />
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tarefas: {project.project_tasks?.length || 0}</span>
                <span>Membros: {project.project_members?.length || 0}</span>
              </div>

              {project.end_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Prazo: {new Date(project.end_date).toLocaleDateString('pt-BR')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!projects || projects.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <TrendingUpIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground text-center">
              Comece criando seu primeiro projeto para organizar suas tarefas e equipe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};