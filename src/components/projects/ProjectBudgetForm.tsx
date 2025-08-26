import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const budgetSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  budget_type: z.enum(["receita", "custo_direto", "custo_indireto"]),
  planned_amount: z.number().min(0, "Valor planejado deve ser maior ou igual a zero"),
  category_id: z.string().optional(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface ProjectBudgetFormProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectBudgetForm: React.FC<ProjectBudgetFormProps> = ({
  projectId,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      description: "",
      budget_type: "receita",
      planned_amount: 0,
    },
  });

  // Buscar categorias financeiras
  const { data: categories } = useQuery({
    queryKey: ["financial-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_categories")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Buscar dados do usuário
  const { data: userAuth } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  const { data: userCompany } = useQuery({
    queryKey: ["user-company"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_company_id')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userAuth
  });

  const createBudget = useMutation({
    mutationFn: async (data: BudgetFormData) => {
      if (!userCompany || !userAuth?.id) {
        throw new Error("Dados do usuário não encontrados");
      }
      
      const { error } = await supabase.from("project_budgets").insert({
        budget_type: data.budget_type,
        category_id: data.category_id || null,
        company_id: userCompany,
        created_by: userAuth.id,
        description: data.description,
        planned_amount: data.planned_amount,
        project_id: projectId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Orçamento atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["project-budgets"] });
      queryClient.invalidateQueries({ queryKey: ["project-financial-summary"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar orçamento. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error creating budget:", error);
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    createBudget.mutate(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Orçamento do Projeto</DialogTitle>
          <DialogDescription>
            Defina os valores planejados para receitas e custos do projeto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva este item do orçamento..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Orçamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="custo_direto">Custo Direto</SelectItem>
                        <SelectItem value="custo_indireto">Custo Indireto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planned_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Planejado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createBudget.isPending}>
                {createBudget.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};