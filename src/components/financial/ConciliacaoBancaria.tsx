import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, CheckCircle, AlertCircle, Zap, RotateCcw, Settings } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  document: string;
  matched?: boolean;
  matchedWith?: string;
}

interface SystemTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  matched?: boolean;
  matchedWith?: string;
}

export function ConciliacaoBancaria() {
  const { toast } = useToast();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();
  const [activeTab, setActiveTab] = useState("setup");
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [systemTransactions, setSystemTransactions] = useState<SystemTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [accounts, setAccounts] = useState<any[]>([]);

  // Carregar contas reais do banco de dados
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_accounts')
        .select('id, name, account_number, bank_name')
        .eq('is_active', true)
        .in('account_type', ['checking', 'savings']); // Apenas contas bancárias

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar contas",
        variant: "destructive"
      });
    }
  };

  const mockSystemTransactions: SystemTransaction[] = [
    { id: "s1", date: "2025-01-15", description: "Recebimento Cliente A", amount: 2500.00, type: "income" },
    { id: "s2", date: "2025-01-16", description: "Pagamento Fornecedor B", amount: -1200.00, type: "expense" },
    { id: "s3", date: "2025-01-17", description: "Taxa de Manutenção", amount: -45.00, type: "expense" },
    { id: "s4", date: "2025-01-18", description: "Recebimento Cliente C", amount: 3200.00, type: "income" }
  ];

  const mockBankTransactions: BankTransaction[] = [
    { id: "b1", date: "2025-01-15", description: "TED RECEBIDA CLIENTE A", amount: 2500.00, document: "DOC001" },
    { id: "b2", date: "2025-01-16", description: "PIX ENVIADO FORNECEDOR", amount: -1200.00, document: "PIX002" },
    { id: "b3", date: "2025-01-17", description: "TAR MANUTENCAO CONTA", amount: -45.00, document: "TAR003" },
    { id: "b4", date: "2025-01-19", description: "DEPOSITO EM DINHEIRO", amount: 500.00, document: "DEP004" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Arquivo carregado",
        description: `Processando ${file.name}...`
      });
      
      // Simular processamento
      setTimeout(() => {
        setBankTransactions(mockBankTransactions);
        setSystemTransactions(mockSystemTransactions);
        setActiveTab("matching");
        toast({
          title: "Extrato processado",
          description: `${mockBankTransactions.length} transações encontradas.`
        });
      }, 1500);
    }
  };

  const handleAutoMatch = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Algoritmo simples de matching por valor e data próxima
      const updatedBankTransactions = [...bankTransactions];
      const updatedSystemTransactions = [...systemTransactions];
      
      bankTransactions.forEach((bankTx, bIndex) => {
        systemTransactions.forEach((sysTx, sIndex) => {
          if (!bankTx.matched && !sysTx.matched && 
              Math.abs(bankTx.amount - sysTx.amount) < 0.01 &&
              Math.abs(new Date(bankTx.date).getTime() - new Date(sysTx.date).getTime()) < 3 * 24 * 60 * 60 * 1000) {
            updatedBankTransactions[bIndex].matched = true;
            updatedBankTransactions[bIndex].matchedWith = sysTx.id;
            updatedSystemTransactions[sIndex].matched = true;
            updatedSystemTransactions[sIndex].matchedWith = bankTx.id;
          }
        });
      });
      
      setBankTransactions(updatedBankTransactions);
      setSystemTransactions(updatedSystemTransactions);
      setIsProcessing(false);
      
      const matchedCount = updatedBankTransactions.filter(tx => tx.matched).length;
      toast({
        title: "Matching automático concluído",
        description: `${matchedCount} transações foram conciliadas automaticamente.`
      });
    }, 2000);
  };

  const getMatchingStats = () => {
    const totalBank = bankTransactions.length;
    const totalSystem = systemTransactions.length;
    const matchedBank = bankTransactions.filter(tx => tx.matched).length;
    const matchedSystem = systemTransactions.filter(tx => tx.matched).length;
    
    return {
      totalBank,
      totalSystem,
      matchedBank,
      matchedSystem,
      pendingBank: totalBank - matchedBank,
      pendingSystem: totalSystem - matchedSystem
    };
  };

  const stats = getMatchingStats();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conciliação Bancária</h2>
          <p className="text-muted-foreground">Reconcilie suas transações bancárias com o sistema</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="matching">Conciliação</TabsTrigger>
          <TabsTrigger value="differences">Diferenças</TabsTrigger>
          <TabsTrigger value="report">Relatório</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Conciliação</CardTitle>
              <CardDescription>Selecione a conta e período para conciliar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Conta Bancária</Label>
                  <div className="flex gap-2">
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione uma conta" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} {account.bank_name && `- ${account.bank_name}`} {account.account_number && `(${account.account_number})`}
                          </SelectItem>
                        ))}
                        {accounts.length === 0 && (
                          <SelectItem value="none" disabled>
                            Nenhuma conta bancária encontrada
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        // Navigate to accounts tab
                        const tabs = document.querySelector('[role="tablist"]');
                        const accountsTab = tabs?.querySelector('[value="contas"]') as HTMLElement;
                        accountsTab?.click();
                      }}
                      title="Gerenciar Contas"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !periodStart && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {periodStart ? format(periodStart, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={periodStart}
                        onSelect={setPeriodStart}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !periodEnd && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {periodEnd ? format(periodEnd, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={periodEnd}
                        onSelect={setPeriodEnd}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Upload do Extrato Bancário</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Formatos aceitos: CSV, OFX, XLS, XLSX
                  </p>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Arraste o arquivo aqui ou clique para selecionar
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv,.ofx,.xls,.xlsx"
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Extrato Bancário</p>
                    <p className="text-2xl font-bold">{stats.totalBank}</p>
                  </div>
                  <Badge variant="secondary">{stats.matchedBank} conciliadas</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sistema</p>
                    <p className="text-2xl font-bold">{stats.totalSystem}</p>
                  </div>
                  <Badge variant="secondary">{stats.matchedSystem} conciliadas</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingBank + stats.pendingSystem}</p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxa de Conciliação</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.totalBank > 0 ? Math.round((stats.matchedBank / stats.totalBank) * 100) : 0}%
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={handleAutoMatch} disabled={isProcessing}>
              <Zap className="h-4 w-4 mr-2" />
              {isProcessing ? "Processando..." : "Matching Automático"}
            </Button>
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Extrato Bancário</CardTitle>
                <CardDescription>{bankTransactions.length} transações</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className={transaction.matched ? "bg-green-50" : ""}>
                        <TableCell>{format(new Date(transaction.date), "dd/MM", { locale: ptBR })}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className={`text-right font-mono ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          {transaction.matched ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Conciliado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transações do Sistema</CardTitle>
                <CardDescription>{systemTransactions.length} transações</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className={transaction.matched ? "bg-green-50" : ""}>
                        <TableCell>{format(new Date(transaction.date), "dd/MM", { locale: ptBR })}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className={`text-right font-mono ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          {transaction.matched ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Conciliado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pendente
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="differences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diferenças Encontradas</CardTitle>
              <CardDescription>Transações que não puderam ser conciliadas automaticamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Somente no Extrato Bancário</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankTransactions.filter(tx => !tx.matched).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(new Date(transaction.date), "dd/MM", { locale: ptBR })}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell className={`text-right font-mono ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Criar Lançamento
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Somente no Sistema</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {systemTransactions.filter(tx => !tx.matched).map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{format(new Date(transaction.date), "dd/MM", { locale: ptBR })}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell className={`text-right font-mono ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              Investigar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Conciliação</CardTitle>
              <CardDescription>Resumo completo da conciliação bancária</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.matchedBank}</p>
                  <p className="text-sm text-muted-foreground">Transações Conciliadas</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingBank + stats.pendingSystem}</p>
                  <p className="text-sm text-muted-foreground">Pendências</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalBank > 0 ? Math.round((stats.matchedBank / stats.totalBank) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Próximos Passos</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Revisar {stats.pendingBank} transações do extrato não conciliadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Investigar {stats.pendingSystem} lançamentos do sistema sem correspondência</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Finalizar conciliação após resolução das pendências</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  Finalizar Conciliação
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}