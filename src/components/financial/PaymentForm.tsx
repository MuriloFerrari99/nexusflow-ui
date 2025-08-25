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

interface PaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  payment_type: "received" | "sent";
  amount: string;
  description: string;
  payment_date: string;
  payment_method: string;
  account_id: string;
  reference: string;
  invoice_id?: string;
}

export function PaymentForm({ open, onOpenChange, onSuccess }: PaymentFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadAccounts();
      loadPendingInvoices();
    }
  }, [open]);

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

  const loadPendingInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, invoice_number, client_name, net_amount')
        .eq('status', 'pending')
        .order('invoice_number');
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const paymentData = {
        ...data,
        amount: parseFloat(data.amount),
        company_id: '00000000-0000-0000-0000-000000000000', // Temporary
        created_by: '00000000-0000-0000-0000-000000000000' // Temporary
      };

      const { error } = await supabase
        .from('payments')
        .insert(paymentData);

      if (error) throw error;

      // If payment is for an invoice, update invoice status
      if (data.invoice_id && data.payment_type === 'received') {
        const { error: invoiceError } = await supabase
          .from('invoices')
          .update({ 
            status: 'paid',
            payment_method: data.payment_method
          })
          .eq('id', data.invoice_id);

        if (invoiceError) throw invoiceError;
      }

      toast({
        title: "Sucesso!",
        description: "Pagamento registrado com sucesso.",
      });

      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar pagamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_type">Tipo de Pagamento</Label>
              <Select onValueChange={(value) => setValue("payment_type", value as "received" | "sent")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Recebido</SelectItem>
                  <SelectItem value="sent">Enviado</SelectItem>
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
              placeholder="Descrição do pagamento"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_date">Data do Pagamento</Label>
              <Input
                {...register("payment_date", { required: "Campo obrigatório" })}
                type="date"
              />
              {errors.payment_date && <span className="text-sm text-destructive">{errors.payment_date.message}</span>}
            </div>

            <div>
              <Label htmlFor="invoice_id">Fatura (opcional)</Label>
              <Select onValueChange={(value) => setValue("invoice_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fatura" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      #{invoice.invoice_number} - {invoice.client_name} - R$ {invoice.net_amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Referência (opcional)</Label>
            <Input
              {...register("reference")}
              placeholder="Número do comprovante, nota fiscal, etc."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Registrar Pagamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}