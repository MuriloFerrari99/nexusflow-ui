import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, FileText, Table, Image, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const exportTypeIcons = {
  pdf: FileText,
  excel: Table,
  csv: Table,
  image: Image,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pendente",
  processing: "Processando",
  completed: "Concluído",
  failed: "Falhou",
};

export function ReportExports() {
  const { data: exports, isLoading } = useQuery({
    queryKey: ["report-exports"],
    queryFn: async () => {
      // Return empty array until migration is approved
      return [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!exports || exports.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma exportação encontrada</h3>
          <p className="text-muted-foreground">
            Suas exportações de relatórios aparecerão aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Exportações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exports.map((exportItem) => {
              const IconComponent = exportTypeIcons[exportItem.export_type as keyof typeof exportTypeIcons];
              
              return (
                <div
                  key={exportItem.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {exportItem.analytics_dashboards?.name || "Dashboard"}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{exportItem.export_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>
                          {format(new Date(exportItem.created_at), "dd 'de' MMMM 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="secondary"
                      className={statusColors[exportItem.status as keyof typeof statusColors]}
                    >
                      {statusLabels[exportItem.status as keyof typeof statusLabels]}
                    </Badge>
                    
                    {exportItem.status === "completed" && exportItem.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={exportItem.file_url} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    )}
                    
                    {exportItem.status === "completed" && !exportItem.file_url && (
                      <Button variant="outline" size="sm" disabled>
                        <Download className="w-4 h-4 mr-2" />
                        Arquivo local
                      </Button>
                    )}
                    
                    {exportItem.status === "failed" && (
                      <Button variant="outline" size="sm" disabled>
                        Falhou
                      </Button>
                    )}
                    
                    {(exportItem.status === "pending" || exportItem.status === "processing") && (
                      <Button variant="outline" size="sm" disabled>
                        {exportItem.status === "pending" ? "Aguardando..." : "Processando..."}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Exportações</p>
                <p className="text-2xl font-bold">{exports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">
                  {exports.filter(e => e.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">
                  {exports.filter(e => 
                    new Date(e.created_at).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Formato Mais Usado</p>
                <p className="text-2xl font-bold">PDF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}