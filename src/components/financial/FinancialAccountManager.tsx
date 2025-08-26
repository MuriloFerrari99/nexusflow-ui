import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Trash2, Building2, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  account_type: z.enum(["checking", "savings", "credit", "investment"], {
    required_error: "Tipo de conta é obrigatório"
  }),
  account_number: z.string().optional(),
  bank_name: z.string().optional(),
  balance: z.coerce.number().default(0)
});

type AccountFormData = z.infer<typeof accountSchema>;

interface Account {
  id: string;
  name: string;
  account_type: string;
  account_number?: string;
  bank_name?: string;
  balance: number;
  is_active: boolean;
  created_at: string;
}

export function FinancialAccountManager() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      account_type: "checking",
      account_number: "",
      bank_name: "",
      balance: 0
    }
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar contas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AccountFormData) => {
    try {
      // Get user's company_id first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile?.company_id) {
        throw new Error('Erro ao obter informações da empresa');
      }

      if (editingAccount) {
        const { error } = await supabase
          .from('financial_accounts')
          .update(data)
          .eq('id', editingAccount.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Conta atualizada com sucesso"
        });
      } else {
        const insertData = {
          name: data.name,
          account_type: data.account_type,
          account_number: data.account_number || null,
          bank_name: data.bank_name || null,
          balance: data.balance,
          company_id: profile.company_id
        };

        const { error } = await supabase
          .from('financial_accounts')
          .insert([insertData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Conta criada com sucesso"
        });
      }

      setDialogOpen(false);
      setEditingAccount(null);
      form.reset();
      loadAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar conta",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    form.reset({
      name: account.name,
      account_type: account.account_type as any,
      account_number: account.account_number || "",
      bank_name: account.bank_name || "",
      balance: account.balance
    });
    setDialogOpen(true);
  };

  const handleNewAccount = () => {
    setEditingAccount(null);
    form.reset();
    setDialogOpen(true);
  };

  const toggleAccountStatus = async (accountId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('financial_accounts')
        .update({ is_active: !isActive })
        .eq('id', accountId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Conta ${!isActive ? 'ativada' : 'desativada'} com sucesso`
      });

      loadAccounts();
    } catch (error) {
      console.error('Error updating account status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status da conta",
        variant: "destructive"
      });
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const types = {
      checking: "Conta Corrente",
      savings: "Poupança",
      credit: "Cartão de Crédito",
      investment: "Investimento"
    };
    return types[type as keyof typeof types] || type;
  };

  const getAccountTypeIcon = (type: string) => {
    if (type === "credit") return <CreditCard className="h-4 w-4" />;
    return <Building2 className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando contas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Contas</h2>
          <p className="text-muted-foreground">Gerencie suas contas bancárias e cartões</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewAccount}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? 'Editar Conta' : 'Nova Conta'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount 
                  ? 'Atualize as informações da conta bancária'
                  : 'Adicione uma nova conta bancária ou cartão'
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Conta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Conta Corrente Bradesco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="account_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conta</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">Conta Corrente</SelectItem>
                          <SelectItem value="savings">Poupança</SelectItem>
                          <SelectItem value="credit">Cartão de Crédito</SelectItem>
                          <SelectItem value="investment">Investimento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Bradesco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Conta</FormLabel>
                        <FormControl>
                          <Input placeholder="1234-5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Saldo Inicial</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingAccount ? 'Atualizar' : 'Criar'} Conta
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contas Cadastradas</CardTitle>
          <CardDescription>
            {accounts.length} conta(s) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Número</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getAccountTypeIcon(account.account_type)}
                      {account.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getAccountTypeLabel(account.account_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.bank_name || '-'}</TableCell>
                  <TableCell>{account.account_number || '-'}</TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(account.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={account.is_active}
                        onCheckedChange={() => toggleAccountStatus(account.id, account.is_active)}
                      />
                      <span className="text-sm">
                        {account.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(account)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma conta cadastrada</p>
                      <p className="text-sm">Clique em "Nova Conta" para começar</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}