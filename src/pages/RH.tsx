import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  DollarSign, 
  FileText, 
  UserPlus,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const RH = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recursos Humanos</h1>
            <p className="text-muted-foreground">
              Gestão completa de funcionários e folha de pagamento
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">
                +2 este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Folha do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 87.450</div>
              <p className="text-xs text-muted-foreground">
                Dezembro 2024
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Extras</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142h</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnover</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4%</div>
              <p className="text-xs text-muted-foreground">
                -0.5% vs mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
            <TabsTrigger value="ponto">Registro de Ponto</TabsTrigger>
            <TabsTrigger value="folha">Folha de Pagamento</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Aniversariantes do Mês</CardTitle>
                  <CardDescription>Funcionários fazendo aniversário em dezembro</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maria Silva</p>
                        <p className="text-sm text-muted-foreground">Analista de RH</p>
                      </div>
                      <Badge variant="outline">15/12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">João Santos</p>
                        <p className="text-sm text-muted-foreground">Desenvolvedor</p>
                      </div>
                      <Badge variant="outline">22/12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Ana Costa</p>
                        <p className="text-sm text-muted-foreground">Gerente de Vendas</p>
                      </div>
                      <Badge variant="outline">28/12</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertas e Pendências</CardTitle>
                  <CardDescription>Items que precisam de atenção</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contratos vencendo</p>
                        <p className="text-xs text-muted-foreground">3 contratos vencem em 30 dias</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Férias pendentes</p>
                        <p className="text-xs text-muted-foreground">5 funcionários com férias vencidas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Documentos pendentes</p>
                        <p className="text-xs text-muted-foreground">2 funcionários com documentos em falta</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Departamentos</CardTitle>
                  <CardDescription>Distribuição por departamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Desenvolvimento</span>
                        <span>8 funcionários</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Vendas</span>
                        <span>6 funcionários</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Administrativo</span>
                        <span>5 funcionários</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Marketing</span>
                        <span>3 funcionários</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>RH</span>
                        <span>3 funcionários</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Meta de Contratações</CardTitle>
                  <CardDescription>Progresso das contratações 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Contratações realizadas</span>
                      <span className="text-sm text-muted-foreground">12/15</span>
                    </div>
                    <Progress value={80} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      Faltam 3 contratações para atingir a meta anual
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funcionarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Funcionários</CardTitle>
                <CardDescription>
                  Cadastro e gerenciamento de colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ponto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Ponto</CardTitle>
                <CardDescription>
                  Controle de entrada, saída e horas extras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="folha" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Folha de Pagamento</CardTitle>
                <CardDescription>
                  Processamento e cálculo da folha mensal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de RH</CardTitle>
                <CardDescription>
                  Relatórios e análises de recursos humanos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Funcionalidade em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RH;