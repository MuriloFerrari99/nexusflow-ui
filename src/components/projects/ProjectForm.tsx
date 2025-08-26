import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const projectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: any;
  onClose: () => void;
}

export const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!project;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      start_date: project?.start_date || "",
      end_date: project?.end_date || "",
      budget: project?.budget?.toString() || "",
      status: project?.status || "planning",
      priority: project?.priority || "medium",
    },
  });

  const { data: userAuth } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  const { data: userCompany } = useQuery({
    queryKey: ['user-company'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_company_id')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userAuth
  });

  const createProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const baseData = {
        name: data.name,
        description: data.description,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        budget: data.budget ? parseFloat(data.budget) : null,
        status: data.status,
        priority: data.priority,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update(baseData)
          .eq('id', project.id);
        if (error) throw error;
      } else {
        const projectData = {
          ...baseData,
          company_id: userCompany,
          created_by: userAuth?.id,
        };
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-dashboard'] });
      toast.success(isEditing ? 'Projeto atualizado!' : 'Projeto criado!');
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao salvar projeto');
      console.error(error);
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    createProject.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Projeto</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Desenvolvimento do App" />
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
                  <Textarea {...field} placeholder="Descreva o projeto..." />
                </FormControl>
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
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Fim</FormLabel>
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orçamento (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field} 
                    placeholder="0.00" 
                  />
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
                      <SelectItem value="planning">Planejamento</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="on_hold">Em Pausa</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
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
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};