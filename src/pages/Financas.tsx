import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Download, FileText, CreditCard } from "lucide-react";

export default function Financas() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Módulo Financeiro</h1>
            <p className="text-muted-foreground">Gestão completa das finanças da empresa</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Lançamento
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="faturas">Faturas</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                  <Badge variant="secondary">BRL</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R$ 12.450,80</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                  <Badge variant="outline">Janeiro</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R$ 8.230,00</div>
                  <p className="text-xs text-muted-foreground">
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                  <Badge variant="destructive">Janeiro</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">R$ 5.780,00</div>
                  <p className="text-xs text-muted-foreground">
                    -3% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resultado</CardTitle>
                  <Badge variant="secondary">Lucro</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">R$ 2.450,00</div>
                  <p className="text-xs text-muted-foreground">
                    Margem de 29.8%
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ledger" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ledger Contábil</CardTitle>
                <CardDescription>
                  Registro de todos os lançamentos financeiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="data">Data</Label>
                      <Input type="date" id="data" />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Input id="descricao" placeholder="Descrição do lançamento" />
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor</Label>
                      <Input id="valor" type="number" placeholder="0,00" />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Lançamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faturas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Emissão de Faturas
                </CardTitle>
                <CardDescription>
                  Crie e gerencie faturas para seus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Funcionalidade de faturas em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagamentos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Registro de Pagamentos
                </CardTitle>
                <CardDescription>
                  Controle de pagamentos recebidos e efetuados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Funcionalidade de pagamentos em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}