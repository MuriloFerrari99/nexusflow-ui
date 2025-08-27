import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Shield, 
  Settings, 
  Upload,
  Download,
  Globe,
  FileKey,
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const FiscalConfig: React.FC = () => {
  const [environment, setEnvironment] = useState("homologacao");
  const [autoEmission, setAutoEmission] = useState(true);
  const [contingencyMode, setContingencyMode] = useState(false);

  const mockFiscalCompany = {
    id: "1",
    name: "EMPRESA EXEMPLO LTDA",
    cnpj: "12.345.678/0001-90",
    ie: "123.456.789.123",
    im: "987654321",
    crt: 1, // Simples Nacional
    address: {
      logradouro: "Rua das Empresas, 123",
      bairro: "Centro",
      municipio: "São Paulo",
      uf: "SP",
      cep: "01234-567"
    },
    nfeSeries: 1,
    nfeNextNumber: 125,
    nfseSeries: "1",
    nfseNextNumber: 45,
    environment: "homologacao",
  };

  const mockCertificate = {
    alias: "EMPRESA EXEMPLO:12345678000190",
    subject: "CN=EMPRESA EXEMPLO LTDA:12345678000190, OU=...",
    validFrom: new Date("2023-06-15"),
    validTo: new Date("2026-06-15"),
    serialNumber: "1A2B3C4D5E6F7G8H",
    isActive: true,
  };

  const mockProviders = [
    {
      id: "1",
      name: "TecnoSpeed - NF-e",
      type: "nfe",
      provider: "tecnospeed",
      active: true,
      environment: "homologacao",
    },
    {
      id: "2", 
      name: "São Paulo - NFS-e",
      type: "nfse",
      provider: "municipal",
      active: true,
      municipio: "São Paulo - SP",
    },
  ];

  const getEnvironmentBadge = (env: string) => {
    return env === "producao" ? (
      <Badge className="bg-red-500 text-white">Produção</Badge>
    ) : (
      <Badge className="bg-yellow-500 text-white">Homologação</Badge>
    );
  };

  const getCertificateStatus = () => {
    const now = new Date();
    const daysToExpire = Math.ceil((mockCertificate.validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpire < 30) {
      return <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Expira em {daysToExpire} dias</Badge>;
    } else if (daysToExpire < 90) {
      return <Badge className="bg-yellow-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Expira em {daysToExpire} dias</Badge>;
    } else {
      return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Válido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações Fiscais</h2>
        <p className="text-muted-foreground">
          Configure dados da empresa, certificados e integrações fiscais
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="certificate">Certificado</TabsTrigger>
          <TabsTrigger value="providers">Provedores</TabsTrigger>
          <TabsTrigger value="general">Gerais</TabsTrigger>
        </TabsList>

        {/* Company Configuration */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Dados da Empresa
              </CardTitle>
              <CardDescription>
                Informações fiscais da empresa emitente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Razão Social</Label>
                  <Input 
                    id="company-name" 
                    defaultValue={mockFiscalCompany.name}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input 
                    id="cnpj" 
                    defaultValue={mockFiscalCompany.cnpj}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input 
                    id="ie" 
                    defaultValue={mockFiscalCompany.ie}
                  />
                </div>
                <div>
                  <Label htmlFor="im">Inscrição Municipal</Label>
                  <Input 
                    id="im" 
                    defaultValue={mockFiscalCompany.im}
                  />
                </div>
                <div>
                  <Label htmlFor="crt">Regime Tributário</Label>
                  <Select defaultValue={mockFiscalCompany.crt.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Simples Nacional</SelectItem>
                      <SelectItem value="2">Lucro Presumido</SelectItem>
                      <SelectItem value="3">Lucro Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Endereço Completo</Label>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Logradouro"
                      defaultValue={mockFiscalCompany.address.logradouro}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        placeholder="Bairro"
                        defaultValue={mockFiscalCompany.address.bairro}
                      />
                      <Input 
                        placeholder="CEP"
                        defaultValue={mockFiscalCompany.address.cep}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        placeholder="Município"
                        defaultValue={mockFiscalCompany.address.municipio}
                      />
                      <Input 
                        placeholder="UF"
                        defaultValue={mockFiscalCompany.address.uf}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Numeração</Label>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">NF-e</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Série"
                          defaultValue={mockFiscalCompany.nfeSeries}
                        />
                        <Input 
                          placeholder="Próximo Número"
                          defaultValue={mockFiscalCompany.nfeNextNumber}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">NFS-e</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Série"
                          defaultValue={mockFiscalCompany.nfseSeries}
                        />
                        <Input 
                          placeholder="Próximo RPS"
                          defaultValue={mockFiscalCompany.nfseNextNumber}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Configuration */}
        <TabsContent value="certificate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileKey className="w-5 h-5 mr-2" />
                Certificado Digital A1
              </CardTitle>
              <CardDescription>
                Gerenciar certificado digital para assinatura das NF-e
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCertificate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="font-medium">{mockCertificate.alias}</div>
                      <div className="text-sm text-muted-foreground">
                        {mockCertificate.subject}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Válido até: {format(mockCertificate.validTo, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        {getCertificateStatus()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Renovar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <FileKey className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-lg font-medium mb-2">Nenhum certificado configurado</div>
                  <div className="text-muted-foreground mb-4">
                    Faça upload do certificado A1 (.pfx/.p12) para assinar as NF-e
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Certificado
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Configuration */}
        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Provedores de Integração
              </CardTitle>
              <CardDescription>
                Configure integrações com provedores de NF-e e NFS-e
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {provider.type === "nfe" ? "Nota Fiscal Eletrônica" : "Nota Fiscal de Serviços"}
                        {provider.municipio && ` - ${provider.municipio}`}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {provider.active ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="text-center py-6 border-2 border-dashed rounded-lg">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Adicionar Provedor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Configuration */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configurações operacionais do módulo fiscal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Ambiente de Operação</Label>
                    <div className="text-sm text-muted-foreground">
                      Define se as operações serão realizadas em homologação ou produção
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getEnvironmentBadge(environment)}
                    <Select value={environment} onValueChange={setEnvironment}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homologacao">Homologação</SelectItem>
                        <SelectItem value="producao">Produção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Emissão Automática</Label>
                    <div className="text-sm text-muted-foreground">
                      Emitir automaticamente NF-e ao finalizar vendas
                    </div>
                  </div>
                  <Switch checked={autoEmission} onCheckedChange={setAutoEmission} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Modo Contingência</Label>
                    <div className="text-sm text-muted-foreground">
                      Ativar modo de contingência em caso de indisponibilidade da SEFAZ
                    </div>
                  </div>
                  <Switch checked={contingencyMode} onCheckedChange={setContingencyMode} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};