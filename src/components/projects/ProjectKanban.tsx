import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, User } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const COLUMN_CONFIG = {
  pendente: { title: "Pendente", color: "bg-yellow-100 border-yellow-300" },
  em_andamento: { title: "Em Andamento", color: "bg-blue-100 border-blue-300" },
  concluida: { title: "Concluída", color: "bg-green-100 border-green-300" },
  cancelada: { title: "Cancelada", color: "bg-red-100 border-red-300" },
};

export const ProjectKanban = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const queryClient = useQueryClient();

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

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', selectedProject)
        .order('order_index');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedProject
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status, newIndex }: { taskId: string, status: string, newIndex: number }) => {
      const { error } = await supabase
        .from('project_tasks')
        .update({ 
          status: status as any,
          order_index: newIndex 
        })
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
    },
    onError: (error) => {
      toast.error('Erro ao mover tarefa');
      console.error(error);
    }
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      updateTaskStatus.mutate({
        taskId: draggableId,
        status: destination.droppableId,
        newIndex: destination.index
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks?.filter(task => task.status === status) || [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'bg-green-100 text-green-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Quadro Kanban</h2>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Selecione um Projeto</h3>
            <p className="text-muted-foreground mb-4">
              Escolha um projeto para visualizar suas tarefas no quadro Kanban.
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Quadro Kanban</h2>
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
        
        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedTask(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <TaskForm 
              task={selectedTask}
              projectId={selectedProject}
              onClose={() => {
                setIsTaskFormOpen(false);
                setSelectedTask(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">Carregando...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(COLUMN_CONFIG).map(([status, config]) => (
              <div key={status} className={`rounded-lg border-2 ${config.color} p-4`}>
                <h3 className="font-semibold mb-4 text-center">
                  {config.title} ({getTasksByStatus(status).length})
                </h3>
                
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3 min-h-[200px]"
                    >
                      {getTasksByStatus(status).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="cursor-move hover:shadow-md transition-shadow"
                              onClick={() => {
                                setSelectedTask(task);
                                setIsTaskFormOpen(true);
                              }}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">{task.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {task.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                </div>

                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                  {task.due_date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                    </div>
                                  )}
                                  
                                  {task.assigned_to && (
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span className="truncate max-w-20">
                                        Atribuído
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};