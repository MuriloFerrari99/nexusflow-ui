import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calculator,
  Plus,
} from "lucide-react";
import { ProjectTransactionForm } from "./ProjectTransactionForm";
import { ProjectBudgetForm } from "./ProjectBudgetForm";

interface ProjectDREProps {
  projectId: string;
}

export const ProjectDRE: React.FC<ProjectDREProps> = ({ projectId }) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  // Buscar resumo financeiro do projeto
  const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["project-financial-summary", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_project_financial_summary", {
        p_project_id: projectId,
      });
      if (error) throw error;
      return data[0];
    },
  });

  // Buscar transações do projeto
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["project-transactions", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select(`
          *,
          financial_categories (
            name
          )
        `)
        .eq("project_id", projectId)
        .order("transaction_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Buscar orçamentos do projeto
  const { data: budgets, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ["project-budgets", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_budgets")
        .select(`
          *,
          financial_categories (
            name
          )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoadingSummary || isLoadingTransactions || isLoadingBudgets) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const summary = financialSummary || {
    total_receita: 0,
    total_custos: 0,
    margem_liquida: 0,
    margem_percentual: 0,
    orcamento_receita: 0,
    orcamento_custos: 0,
    percentual_orcamento_usado: 0,
  };

  return (
    <div className="space-y-6">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(Number(summary.total_receita))}
            </div>
            <p className="text-xs text-muted-foreground">
              Orçado: {formatCurrency(Number(summary.orcamento_receita))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(Number(summary.total_custos))}
            </div>
            <p className="text-xs text-muted-foreground">
              Orçado: {formatCurrency(Number(summary.orcamento_custos))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Líquida</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              Number(summary.margem_liquida) >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {formatCurrency(Number(summary.margem_liquida))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(Number(summary.margem_percentual))} de margem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Usado</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatPercentage(Number(summary.percentual_orcamento_usado))}
            </div>
            <p className="text-xs text-muted-foreground">
              do orçamento total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => setShowTransactionForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
        <Button variant="outline" onClick={() => setShowBudgetForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Gerenciar Orçamento
        </Button>
      </div>

      {/* Tabs for detailed view */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="budget">Orçamento vs Realizado</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{transaction.description}</span>
                          <Badge
                            variant={
                              transaction.transaction_type === "receita" ? "default" : "destructive"
                            }
                          >
                            {transaction.transaction_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.financial_categories?.name} • {" "}
                          {new Date(transaction.transaction_date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${
                        transaction.transaction_type === "receita" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.transaction_type === "receita" ? "+" : "-"}
                        {formatCurrency(Number(transaction.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma transação encontrada para este projeto.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamento vs Realizado</CardTitle>
            </CardHeader>
            <CardContent>
              {budgets && budgets.length > 0 ? (
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{budget.description}</span>
                          <Badge variant="outline">{budget.budget_type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {budget.financial_categories?.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Planejado</div>
                        <div className="font-semibold">
                          {formatCurrency(Number(budget.planned_amount))}
                        </div>
                        <div className="text-sm text-muted-foreground">Realizado</div>
                        <div className="font-semibold">
                          {formatCurrency(Number(budget.actual_amount))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum orçamento definido para este projeto.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>ROI do Projeto:</span>
                    <span className={`font-semibold ${
                      Number(summary.margem_percentual) >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatPercentage(Number(summary.margem_percentual))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eficiência de Custo:</span>
                    <span className="font-semibold">
                      {summary.orcamento_custos > 0 
                        ? formatPercentage((Number(summary.total_custos) / Number(summary.orcamento_custos)) * 100)
                        : "N/A"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receita vs Orçamento:</span>
                    <span className="font-semibold">
                      {summary.orcamento_receita > 0 
                        ? formatPercentage((Number(summary.total_receita) / Number(summary.orcamento_receita)) * 100)
                        : "N/A"
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Executivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium">Status do Projeto</div>
                    <div className="text-lg">
                      {Number(summary.margem_liquida) >= 0 ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Lucrativo
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <TrendingDown className="h-4 w-4" />
                          Prejuízo
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Este projeto {Number(summary.margem_liquida) >= 0 ? "está gerando" : "apresenta"} uma margem de{" "}
                    <strong>{formatCurrency(Number(summary.margem_liquida))}</strong>, 
                    representando <strong>{formatPercentage(Number(summary.margem_percentual))}</strong> da receita.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      {showTransactionForm && (
        <ProjectTransactionForm
          projectId={projectId}
          onClose={() => setShowTransactionForm(false)}
        />
      )}

      {showBudgetForm && (
        <ProjectBudgetForm
          projectId={projectId}
          onClose={() => setShowBudgetForm(false)}
        />
      )}
    </div>
  );
};