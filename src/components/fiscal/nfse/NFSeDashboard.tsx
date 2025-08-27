import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Eye, 
  RotateCcw,
  MapPin
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NFSeDashboardProps {
  searchTerm: string;
}

const mockNFSeData = [
  {
    id: "1",
    rpsNumero: "000001",
    nfseNumero: "2024000000123",
    municipio: "São Paulo - SP",
    municipioCodigo: "3550308",
    status: "autorizado",
    tomador: "CLIENTE EXEMPLO LTDA",
    valorServicos: 5200.00,
    valorIss: 260.00,
    emissao: new Date("2024-01-27T10:30:00"),
    protocolo: "SP2024123456789",
  },
  {
    id: "2",
    rpsNumero: "000002",
    nfseNumero: null,
    municipio: "Rio de Janeiro - RJ",
    municipioCodigo: "3304557",
    status: "enviado",
    tomador: "EMPRESA TESTE LTDA",
    valorServicos: 3800.00,
    valorIss: 152.00,
    emissao: new Date("2024-01-27T14:15:00"),
    protocolo: "RJ2024234567890",
  },
  {
    id: "3",
    rpsNumero: "000003",
    nfseNumero: null,
    municipio: "Belo Horizonte - MG",
    municipioCodigo: "3106200",
    status: "rejeitado",
    tomador: "CONTRATANTE ABC LTDA",
    valorServicos: 12500.00,
    valorIss: 625.00,
    emissao: new Date("2024-01-27T16:45:00"),
    protocolo: null,
  },
];

export const NFSeDashboard: React.FC<NFSeDashboardProps> = ({ searchTerm }) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "autorizado":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Autorizado</Badge>;
      case "rejeitado":
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      case "enviado":
        return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" />Enviado</Badge>;
      case "cancelado":
        return <Badge className="bg-gray-500 text-white"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      case "draft":
        return <Badge variant="outline"><FileText className="w-3 h-3 mr-1" />Rascunho</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredData = mockNFSeData.filter((nfse) => {
    const matchesSearch = searchTerm === "" || 
      nfse.rpsNumero.includes(searchTerm) || 
      nfse.tomador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nfse.nfseNumero && nfse.nfseNumero.includes(searchTerm));
    
    const matchesStatus = statusFilter === "all" || nfse.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="autorizado">Autorizado</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total RPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NFS-e Autorizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">156</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ISS Retido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ 15.230</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 425.800</div>
          </CardContent>
        </Card>
      </div>

      {/* NFSe Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais de Serviços Eletrônicas</CardTitle>
          <CardDescription>
            Gestão completa das suas NFS-e e RPS emitidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RPS</TableHead>
                <TableHead>NFS-e</TableHead>
                <TableHead>Tomador</TableHead>
                <TableHead>Município</TableHead>
                <TableHead>Valor Serviços</TableHead>
                <TableHead>ISS</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((nfse) => (
                <TableRow key={nfse.id}>
                  <TableCell className="font-medium">
                    {nfse.rpsNumero}
                  </TableCell>
                  <TableCell>
                    {nfse.nfseNumero || (
                      <span className="text-muted-foreground">Aguardando</span>
                    )}
                  </TableCell>
                  <TableCell>{nfse.tomador}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                      {nfse.municipio}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(nfse.valorServicos)}</TableCell>
                  <TableCell>{formatCurrency(nfse.valorIss)}</TableCell>
                  <TableCell>{getStatusBadge(nfse.status)}</TableCell>
                  <TableCell>
                    {format(nfse.emissao, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma NFS-e encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};