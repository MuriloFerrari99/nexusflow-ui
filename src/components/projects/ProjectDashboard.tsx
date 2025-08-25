import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ClockIcon, TrendingUpIcon, UsersIcon, FilterIcon, SearchIcon } from "lucide-react";

interface Profile {
  id: string;
  full_name?: string;
  email: string;
}

interface ProjectMember {
  id: string;
  user_id: string;
  profile?: Profile;
}

interface ProjectWithData {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority?: string;
  progress?: number;
  end_date?: string;
  project_tasks?: Array<{ id: string; status: string; priority?: string }>;
  project_members?: ProjectMember[];
}

export const ProjectDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  const { data: projects, isLoading } = useQuery<ProjectWithData[]>({
    queryKey: ['projects-dashboard', statusFilter, searchTerm, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          project_tasks (id, status, priority),
          project_members (id, user_id)
        `);
      
      // Apply filters - using any for filter values to avoid type issues
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter as any);
      }
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      if (priorityFilter !== "all") {
        query = query.eq('priority', priorityFilter as any);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch profiles for project members separately
      if (data && data.length > 0) {
        const allMemberUserIds = data.flatMap(p => p.project_members?.map(m => m.user_id) || []);
        if (allMemberUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', allMemberUserIds);
          
          // Attach profiles to members
          data.forEach(project => {
            if (project.project_members) {
              project.project_members = project.project_members.map(member => ({
                ...member,
                profile: profiles?.find(p => p.id === member.user_id)
              }));
            }
          });
        }
      }
      
      return data as ProjectWithData[];
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

  // Filter projects for better stats
  const filteredProjects = projects || [];
  const activeProjectsCount = filteredProjects.filter(p => p.status === 'active').length;
  const totalTasks = filteredProjects.reduce((acc, p) => acc + (p.project_tasks?.length || 0), 0);
  const completedTasks = filteredProjects.reduce((acc, p) => 
    acc + (p.project_tasks?.filter(t => t.status === 'concluida').length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <SearchIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="on_hold">Em Pausa</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Prioridade</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter("all");
                  setSearchTerm("");
                  setPriorityFilter("all");
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {statusFilter !== "all" ? `Filtrados por: ${getStatusLabel(statusFilter)}` : "Total na base"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjectsCount}</div>
            <p className="text-xs text-muted-foreground">
              {((activeProjectsCount / (filteredProjects.length || 1)) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {filteredProjects.length > 0 ? (totalTasks / filteredProjects.length).toFixed(1) : 0} por projeto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} de {totalTasks} tarefas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects?.map((project) => {
          const completedTasksCount = project.project_tasks?.filter(t => t.status === 'concluida').length || 0;
          const totalTasksCount = project.project_tasks?.length || 0;
          const completionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
          
          return (
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
                  <span>{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tarefas:</span>
                  <div className="font-medium">{completedTasksCount}/{totalTasksCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Membros:</span>
                  <div className="font-medium">{project.project_members?.length || 0}</div>
                </div>
              </div>

              {project.priority && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Prioridade:</span>
                  <Badge variant={project.priority === 'high' || project.priority === 'urgent' ? 'destructive' : 'secondary'}>
                    {project.priority}
                  </Badge>
                </div>
              )}

              {project.end_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Prazo: {new Date(project.end_date).toLocaleDateString('pt-BR')}
                </div>
              )}

              {/* Team avatars */}
              {project.project_members && project.project_members.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Equipe:</span>
                  <div className="flex -space-x-2">
                    {project.project_members.slice(0, 3).map((member, index) => (
                      <div 
                        key={member.id} 
                        className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border-2 border-background"
                        title={member.profile?.full_name || member.profile?.email || "Usuário"}
                      >
                        {(member.profile?.full_name || member.profile?.email || "U")?.[0]?.toUpperCase()}
                      </div>
                    ))}
                    {project.project_members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center border-2 border-background">
                        +{project.project_members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          );
        })}
      </div>

      {(!filteredProjects || filteredProjects.length === 0) && (
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