import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  amount: string;
  description: string;
  transaction_type: "income" | "expense";
  transaction_date: string;
  payment_method: string;
  category_id: string;
  account_id: string;
  reference: string;
}

export function TransactionForm({ open, onOpenChange, onSuccess }: TransactionFormProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>();
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const transactionType = watch("transaction_type");

  useEffect(() => {
    if (open) {
      loadCategories();
      loadAccounts();
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          ...data,
          amount: parseFloat(data.amount),
          company_id: '00000000-0000-0000-0000-000000000000', // Temporary
          created_by: '00000000-0000-0000-0000-000000000000' // Temporary
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Lançamento criado com sucesso.",
      });

      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar lançamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    transactionType ? cat.category_type === transactionType : true
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transaction_type">Tipo de Transação</Label>
              <Select onValueChange={(value) => setValue("transaction_type", value as "income" | "expense")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Entrada</SelectItem>
                  <SelectItem value="expense">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                {...register("amount", { required: "Campo obrigatório" })}
                type="number"
                step="0.01"
                placeholder="0,00"
              />
              {errors.amount && <span className="text-sm text-destructive">{errors.amount.message}</span>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              {...register("description", { required: "Campo obrigatório" })}
              placeholder="Descrição do lançamento"
            />
            {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_id">Conta</Label>
              <Select onValueChange={(value) => setValue("account_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category_id">Categoria</Label>
              <Select onValueChange={(value) => setValue("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transaction_date">Data</Label>
              <Input
                {...register("transaction_date", { required: "Campo obrigatório" })}
                type="date"
              />
              {errors.transaction_date && <span className="text-sm text-destructive">{errors.transaction_date.message}</span>}
            </div>

            <div>
              <Label htmlFor="payment_method">Forma de Pagamento</Label>
              <Select onValueChange={(value) => setValue("payment_method", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Referência (opcional)</Label>
            <Input
              {...register("reference")}
              placeholder="Número do documento, nota fiscal, etc."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}