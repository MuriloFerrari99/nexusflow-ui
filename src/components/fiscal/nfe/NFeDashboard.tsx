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
  AlertTriangle,
  Copy
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NFeDashboardProps {
  searchTerm: string;
}

const mockNFeData = [
  {
    id: "1",
    numero: "000000123",
    serie: "1",
    chave: "35230814200166000187550010000001231123456789",
    status: "autorizado",
    destinatario: "EMPRESA EXEMPLO LTDA",
    valor: 15420.50,
    emissao: new Date("2024-01-27T10:30:00"),
    protocolo: "135230000123456",
  },
  {
    id: "2",
    numero: "000000124",
    serie: "1",
    chave: "35230814200166000187550010000001241234567890",
    status: "rejeitado",
    destinatario: "CLIENTE TESTE LTDA",
    valor: 8750.00,
    emissao: new Date("2024-01-27T14:15:00"),
    protocolo: null,
  },
  {
    id: "3",
    numero: "000000125",
    serie: "1",
    chave: "35230814200166000187550010000001251345678901",
    status: "enviado",
    destinatario: "FORNECEDOR ABC LTDA",
    valor: 22100.75,
    emissao: new Date("2024-01-27T16:45:00"),
    protocolo: "135230000234567",
  },
];

export const NFeDashboard: React.FC<NFeDashboardProps> = ({ searchTerm }) => {
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

  const filteredData = mockNFeData.filter((nfe) => {
    const matchesSearch = searchTerm === "" || 
      nfe.numero.includes(searchTerm) || 
      nfe.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nfe.chave.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || nfe.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const copyChave = (chave: string) => {
    navigator.clipboard.writeText(chave);
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
              Total Emitidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Autorizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">235</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejeitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.247.850</div>
          </CardContent>
        </Card>
      </div>

      {/* NFe Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais Eletrônicas</CardTitle>
          <CardDescription>
            Gestão completa das suas NF-e emitidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Chave de Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((nfe) => (
                <TableRow key={nfe.id}>
                  <TableCell className="font-medium">
                    {nfe.numero}/{nfe.serie}
                  </TableCell>
                  <TableCell>{nfe.destinatario}</TableCell>
                  <TableCell>{formatCurrency(nfe.valor)}</TableCell>
                  <TableCell>{getStatusBadge(nfe.status)}</TableCell>
                  <TableCell>
                    {format(nfe.emissao, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {nfe.chave.substring(0, 12)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyChave(nfe.chave)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {nfe.status === "rejeitado" && (
                        <Button variant="ghost" size="sm">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma NF-e encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};