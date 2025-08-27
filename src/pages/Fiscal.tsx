import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Settings, Activity, Download, Shield, Search } from "lucide-react";
import { NFeDashboard } from "@/components/fiscal/nfe/NFeDashboard";
import { NFSeDashboard } from "@/components/fiscal/nfse/NFSeDashboard";
import { SPEDDashboard } from "@/components/fiscal/sped/SPEDDashboard";
import { FiscalConfig } from "@/components/fiscal/config/FiscalConfig";
import { TaxProfileManager } from "@/components/fiscal/tax/TaxProfileManager";
import { FiscalEvents } from "@/components/fiscal/audit/FiscalEvents";
import { Input } from "@/components/ui/input";

const Fiscal = () => {
  const [activeTab, setActiveTab] = useState("nfe");
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewNFe = () => {
    console.log("Criar nova NF-e");
  };

  const handleNewNFSe = () => {
    console.log("Criar nova NFS-e");
  };

  const handleSPEDExport = () => {
    console.log("Exportar SPED");
  };

  const getActionButton = () => {
    switch (activeTab) {
      case "nfe":
        return (
          <Button onClick={handleNewNFe} className="ml-4">
            <Plus className="mr-2 h-4 w-4" />
            Nova NF-e
          </Button>
        );
      case "nfse":
        return (
          <Button onClick={handleNewNFSe} className="ml-4">
            <Plus className="mr-2 h-4 w-4" />
            Nova NFS-e
          </Button>
        );
      case "sped":
        return (
          <Button onClick={handleSPEDExport} className="ml-4">
            <Download className="mr-2 h-4 w-4" />
            Exportar SPED
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Módulo Fiscal</h1>
            <p className="text-muted-foreground">
              Gestão completa de NF-e, NFS-e, impostos e obrigações fiscais
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            {getActionButton()}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NF-e Enviadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NFS-e Autorizadas</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground">
                +8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ICMS Apurado</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.230</div>
              <p className="text-xs text-muted-foreground">
                Período atual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Sistema</CardTitle>
              <Badge variant="default" className="bg-green-500">
                Online
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">
                Disponibilidade SEFAZ
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="nfe">NF-e</TabsTrigger>
            <TabsTrigger value="nfse">NFS-e</TabsTrigger>
            <TabsTrigger value="sped">SPED</TabsTrigger>
            <TabsTrigger value="tax">Tributação</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="nfe" className="space-y-4">
            <NFeDashboard searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="nfse" className="space-y-4">
            <NFSeDashboard searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="sped" className="space-y-4">
            <SPEDDashboard />
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            <TaxProfileManager />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <FiscalEvents />
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <FiscalConfig />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Fiscal;