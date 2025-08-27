import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Download, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar as CalendarIcon,
  Play,
  Pause,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const mockSPEDExports = [
  {
    id: "1",
    type: "efd_icms_ipi",
    typeName: "EFD ICMS/IPI",
    period: "01/2024",
    periodStart: new Date("2024-01-01"),
    periodEnd: new Date("2024-01-31"),
    status: "ready",
    fileSize: "2.4 MB",
    recordsCount: 15420,
    createdAt: new Date("2024-02-02T10:30:00"),
    fileUrl: "/exports/efd_icms_ipi_012024.txt",
  },
  {
    id: "2",
    type: "efd_contrib",
    typeName: "EFD Contribuições",
    period: "01/2024",
    periodStart: new Date("2024-01-01"),
    periodEnd: new Date("2024-01-31"),
    status: "processing",
    fileSize: null,
    recordsCount: 0,
    createdAt: new Date("2024-02-02T14:15:00"),
    fileUrl: null,
  },
  {
    id: "3",
    type: "reinf",
    typeName: "EFD-REINF",
    period: "01/2024",
    periodStart: new Date("2024-01-01"),
    periodEnd: new Date("2024-01-31"),
    status: "error",
    fileSize: null,
    recordsCount: 0,
    createdAt: new Date("2024-02-02T16:45:00"),
    fileUrl: null,
  },
];

export const SPEDDashboard: React.FC = () => {
  const [selectedPeriodStart, setSelectedPeriodStart] = useState<Date>();
  const [selectedPeriodEnd, setSelectedPeriodEnd] = useState<Date>();
  const [selectedType, setSelectedType] = useState<string>("efd_icms_ipi");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Pronto</Badge>;
      case "processing":
        return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" />Processando</Badge>;
      case "error":
        return <Badge className="bg-red-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" />Erro</Badge>;
      case "pending":
        return <Badge variant="outline"><Pause className="w-3 h-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateExport = () => {
    console.log("Gerar exportação SPED", {
      type: selectedType,
      periodStart: selectedPeriodStart,
      periodEnd: selectedPeriodEnd,
    });
  };

  const formatFileSize = (size: string | null) => {
    return size || "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Nova Exportação SPED</CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar arquivos SPED conforme layout oficial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Arquivo</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efd_icms_ipi">EFD ICMS/IPI</SelectItem>
                  <SelectItem value="efd_contrib">EFD Contribuições</SelectItem>
                  <SelectItem value="reinf">EFD-REINF</SelectItem>
                  <SelectItem value="esocial">eSocial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Period Start */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período Inicial</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedPeriodStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedPeriodStart ? (
                      format(selectedPeriodStart, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecionar data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedPeriodStart}
                    onSelect={setSelectedPeriodStart}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Period End */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período Final</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedPeriodEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedPeriodEnd ? (
                      format(selectedPeriodEnd, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecionar data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedPeriodEnd}
                    onSelect={setSelectedPeriodEnd}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleGenerateExport}>
              <Play className="w-4 h-4 mr-2" />
              Gerar Exportação
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exportações Geradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Processamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com Erro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tamanho Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124 MB</div>
          </CardContent>
        </Card>
      </div>

      {/* Exports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exportações SPED</CardTitle>
          <CardDescription>
            Histórico de arquivos SPED gerados para obrigações fiscais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Gerado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSPEDExports.map((export_) => (
                <TableRow key={export_.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                      {export_.typeName}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {export_.period}
                  </TableCell>
                  <TableCell>{getStatusBadge(export_.status)}</TableCell>
                  <TableCell>
                    {export_.recordsCount > 0 ? 
                      export_.recordsCount.toLocaleString('pt-BR') : 
                      "N/A"
                    }
                  </TableCell>
                  <TableCell>{formatFileSize(export_.fileSize)}</TableCell>
                  <TableCell>
                    {format(export_.createdAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {export_.status === "ready" && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {mockSPEDExports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma exportação SPED encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};