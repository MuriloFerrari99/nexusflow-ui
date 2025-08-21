import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(['pendente', 'em_andamento', 'concluida', 'cancelada']),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  estimated_hours: z.string().optional(),
  assigned_to: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: any;
  projectId: string;
  onClose: () => void;
}

export const TaskForm = ({ task, projectId, onClose }: TaskFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "pendente",
      priority: task?.priority || "media",
      start_date: task?.start_date || "",
      due_date: task?.due_date || "",
      estimated_hours: task?.estimated_hours?.toString() || "",
      assigned_to: task?.assigned_to || "",
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userProfile } = useQueryClient().getQueryData(['user-profile']) as any;

  const saveTask = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const baseData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        start_date: data.start_date || null,
        due_date: data.due_date || null,
        estimated_hours: data.estimated_hours ? parseFloat(data.estimated_hours) : null,
        assigned_to: data.assigned_to || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('project_tasks')
          .update(baseData)
          .eq('id', task.id);
        if (error) throw error;
      } else {
        const taskData = {
          ...baseData,
          project_id: projectId,
          created_by: userProfile?.id,
        };
        const { error } = await supabase
          .from('project_tasks')
          .insert([taskData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
      toast.success(isEditing ? 'Tarefa atualizada!' : 'Tarefa criada!');
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao salvar tarefa');
      console.error(error);
    }
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', task.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] });
      toast.success('Tarefa excluída!');
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao excluir tarefa');
      console.error(error);
    }
  });

  const onSubmit = (data: TaskFormData) => {
    saveTask.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Tarefa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Implementar autenticação" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Descreva a tarefa..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um responsável" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum responsável</SelectItem>
                    {teamMembers?.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Entrega</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="estimated_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas Estimadas</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.5" 
                    {...field} 
                    placeholder="Ex: 8" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <div>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => deleteTask.mutate()}
                  disabled={deleteTask.isPending}
                >
                  {deleteTask.isPending ? 'Excluindo...' : 'Excluir'}
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saveTask.isPending}>
                {saveTask.isPending ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};