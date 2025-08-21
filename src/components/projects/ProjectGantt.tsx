import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ProjectGantt = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");

  const { data: projects } = useQuery({
    queryKey: ['projects-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: tasks } = useQuery({
    queryKey: ['project-tasks-gantt', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', selectedProject)
        .order('start_date');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedProject
  });

  const processTasksForGantt = () => {
    if (!tasks) return [];
    
    return tasks.map((task, index) => {
      const startDate = task.start_date ? new Date(task.start_date) : new Date();
      const endDate = task.due_date ? new Date(task.due_date) : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return {
        id: task.id,
        name: task.title,
        start: startDate,
        end: endDate,
        progress: task.progress || 0,
        assignee: task.assigned_to ? 'Atribuído' : 'Não atribuído',
        priority: task.priority,
        status: task.status,
        description: task.description,
        duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      };
    });
  };

  const ganttTasks = processTasksForGantt();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500';
      case 'em_andamento': return 'bg-blue-500';
      case 'concluida': return 'bg-green-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'border-green-300';
      case 'media': return 'border-yellow-300';
      case 'alta': return 'border-orange-300';
      case 'urgente': return 'border-red-300';
      default: return 'border-gray-300';
    }
  };

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gráfico de Gantt</h2>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Selecione um Projeto</h3>
            <p className="text-muted-foreground mb-4">
              Escolha um projeto para visualizar o cronograma das tarefas.
            </p>
            <Select onValueChange={setSelectedProject}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ganttTasks.length) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Gráfico de Gantt</h2>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-muted-foreground">
              Este projeto não possui tarefas com datas definidas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Gráfico de Gantt</h2>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 mb-4 font-semibold text-sm text-muted-foreground">
                <div className="col-span-3">Tarefa</div>
                <div className="col-span-2">Responsável</div>
                <div className="col-span-1">Duração</div>
                <div className="col-span-6">Cronograma</div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {ganttTasks.map((task) => (
                  <div key={task.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b">
                    <div className="col-span-3">
                      <div className="font-medium text-sm">{task.name}</div>
                      <div className={`text-xs px-2 py-1 rounded w-fit mt-1 ${getStatusColor(task.status)} text-white`}>
                        {task.status}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {task.assignee}
                    </div>
                    
                    <div className="col-span-1 text-sm text-muted-foreground">
                      {task.duration}d
                    </div>
                    
                    <div className="col-span-6">
                      <div className="relative h-8 bg-gray-100 rounded">
                        <div 
                          className={`absolute h-full rounded ${getStatusColor(task.status)} ${getPriorityColor(task.priority)} border-2`}
                          style={{
                            width: `${Math.min(task.progress, 100)}%`,
                            minWidth: '20px'
                          }}
                        />
                        <div className="absolute inset-0 flex items-center px-2 text-xs font-medium">
                          {task.progress}%
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{task.start.toLocaleDateString('pt-BR')}</span>
                        <span>{task.end.toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};