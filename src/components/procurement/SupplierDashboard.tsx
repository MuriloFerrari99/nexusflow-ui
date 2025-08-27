import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Filter, Star, TrendingUp, TrendingDown, Phone, Mail, MapPin } from "lucide-react";

export const SupplierDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const suppliers = [
    {
      id: "SUPP-001",
      name: "Metalúrgica ABC Ltda",
      cnpj: "12.345.678/0001-90",
      contact: "Carlos Silva",
      email: "carlos@metalurgicaabc.com.br",
      phone: "(11) 9999-8888",
      city: "São Paulo",
      status: "active",
      rating: 4.8,
      otdRate: 95.2,
      qualityPPM: 150,
      totalPOs: 24,
      totalValue: 125400.50,
      paymentTerms: "30 dias"
    },
    {
      id: "SUPP-002", 
      name: "Eletromec Indústria",
      cnpj: "98.765.432/0001-10",
      contact: "Ana Costa",
      email: "ana@eletromec.com.br",
      phone: "(11) 8888-7777",
      city: "São Paulo",
      status: "active",
      rating: 4.5,
      otdRate: 88.7,
      qualityPPM: 280,
      totalPOs: 18,
      totalValue: 87650.25,
      paymentTerms: "45 dias"
    },
    {
      id: "SUPP-003",
      name: "Tech Solutions Brasil",
      cnpj: "11.222.333/0001-44",
      contact: "Roberto Lima",
      email: "roberto@techsolutions.com.br", 
      phone: "(11) 7777-6666",
      city: "São Paulo",
      status: "active",
      rating: 4.2,
      otdRate: 92.1,
      qualityPPM: 95,
      totalPOs: 12,
      totalValue: 156789.75,
      paymentTerms: "30 dias"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const },
      inactive: { label: "Inativo", variant: "secondary" as const },
      blocked: { label: "Bloqueado", variant: "destructive" as const },
      pending: { label: "Pendente", variant: "outline" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) 
                ? "fill-warning text-warning" 
                : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  const getPerformanceIcon = (value: number, threshold: number) => {
    if (value >= threshold) {
      return <TrendingUp className="w-4 h-4 text-success" />;
    }
    return <TrendingDown className="w-4 h-4 text-destructive" />;
  };

  const stats = [
    { label: "Fornecedores Ativos", value: "42", change: "+3" },
    { label: "OTD Médio", value: "91.8%", change: "+2.1%" },
    { label: "Qualidade Média", value: "185 PPM", change: "-25 PPM" },
    { label: "Score Médio", value: "4.5", change: "+0.2" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fornecedores</h2>
          <p className="text-muted-foreground">
            Gerencie fornecedores, scorecards e listas de preço
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="pricelists">Listas de Preço</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Catálogo de Fornecedores</CardTitle>
                  <CardDescription>
                    Lista de todos os fornecedores cadastrados
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar fornecedores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>OTD</TableHead>
                    <TableHead>POs/Valor</TableHead>
                    <TableHead>Condições</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-muted-foreground">{supplier.cnpj}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{supplier.contact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{supplier.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{supplier.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {supplier.city}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                      <TableCell>{getRatingStars(supplier.rating)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getPerformanceIcon(supplier.otdRate, 90)}
                          <span className={supplier.otdRate >= 90 ? "text-success" : "text-destructive"}>
                            {supplier.otdRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.totalPOs} POs</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {supplier.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {supplier.paymentTerms}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorecard">
          <Card>
            <CardHeader>
              <CardTitle>Scorecard de Fornecedores</CardTitle>
              <CardDescription>
                Avaliação de performance: OTD, qualidade, preço e atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Scorecards em desenvolvimento</p>
                <p className="text-sm">OTD, PPM, variação de preço e SLA</p>
                <Button className="mt-4" variant="outline">
                  Ver Scorecards
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricelists">
          <Card>
            <CardHeader>
              <CardTitle>Listas de Preço</CardTitle>
              <CardDescription>
                Gerencie preços por faixa de quantidade e validade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma lista de preço cadastrada</p>
                <Button className="mt-4">
                  Importar Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contatos dos Fornecedores</CardTitle>
              <CardDescription>
                Gerencie múltiplos contatos por fornecedor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>42 contatos cadastrados</p>
                <Button className="mt-4" variant="outline">
                  Ver Todos os Contatos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};