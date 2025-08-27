import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Activity,
  Search,
  Filter,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockEvents = [
  {
    id: "1",
    entityType: "nfe",
    entityId: "nfe-123",
    event: "emit",
    success: true,
    message: "NF-e emitida com sucesso",
    userName: "João Silva",
    ipAddress: "192.168.1.100",
    createdAt: new Date("2024-01-27T10:30:00"),
  },
  {
    id: "2",
    entityType: "nfse",
    entityId: "rps-456", 
    event: "cancel",
    success: false,
    message: "Erro ao cancelar NFS-e: prazo expirado",
    userName: "Maria Santos",
    ipAddress: "192.168.1.101",
    createdAt: new Date("2024-01-27T14:15:00"),
  },
  {
    id: "3",
    entityType: "sped",
    entityId: "export-789",
    event: "export",
    success: true,
    message: "Exportação SPED EFD ICMS/IPI concluída",
    userName: "Carlos Lima",
    ipAddress: "192.168.1.102", 
    createdAt: new Date("2024-01-27T16:45:00"),
  },
];

export const FiscalEvents: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Sucesso</Badge>
    ) : (
      <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" />Erro</Badge>
    );
  };

  const getEntityTypeBadge = (type: string) => {
    switch (type) {
      case "nfe":
        return <Badge variant="outline">NF-e</Badge>;
      case "nfse":
        return <Badge variant="outline">NFS-e</Badge>;
      case "sped":
        return <Badge variant="outline">SPED</Badge>;
      case "config":
        return <Badge variant="outline">Config</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch = searchTerm === "" || 
      event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || event.entityType === typeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "success" && event.success) ||
      (statusFilter === "error" && !event.success);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Auditoria Fiscal</h2>
          <p className="text-muted-foreground">
            Histórico completo de eventos e operações fiscais
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Log
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="nfe">NF-e</SelectItem>
            <SelectItem value="nfse">NFS-e</SelectItem>
            <SelectItem value="sped">SPED</SelectItem>
            <SelectItem value="config">Configuração</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sucessos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,189</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Erros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">58</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.3%</div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Log de Eventos Fiscais
          </CardTitle>
          <CardDescription>
            Rastreamento completo de todas as operações fiscais realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{getEntityTypeBadge(event.entityType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
                      {event.event}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.success)}</TableCell>
                  <TableCell className="font-medium">{event.userName}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {event.ipAddress}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {event.message}
                  </TableCell>
                  <TableCell>
                    {format(event.createdAt, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};