import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, FolderOpen, Upload, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DocumentDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["document-stats"],
    queryFn: async () => {
      // Total de documentos
      const { count: totalDocuments } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

      // Total de pastas
      const { count: totalFolders } = await supabase
        .from("document_folders")
        .select("*", { count: "exact", head: true });

      // Documentos por categoria
      const { data: byCategory } = await supabase
        .from("documents")
        .select("category")
        .then(({ data }) => {
          const counts = data?.reduce((acc: any, doc) => {
            acc[doc.category] = (acc[doc.category] || 0) + 1;
            return acc;
          }, {});
          return { data: counts };
        });

      // Documentos por status
      const { data: byStatus } = await supabase
        .from("documents")
        .select("status")
        .then(({ data }) => {
          const counts = data?.reduce((acc: any, doc) => {
            acc[doc.status] = (acc[doc.status] || 0) + 1;
            return acc;
          }, {});
          return { data: counts };
        });

      // Total de armazenamento usado
      const { data: storageData } = await supabase
        .from("documents")
        .select("file_size");
      
      const totalStorage = storageData?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0;

      // Documentos vencendo em 30 dias
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { data: expiringSoon } = await supabase
        .from("documents")
        .select("name, expires_at")
        .not("expires_at", "is", null)
        .lte("expires_at", thirtyDaysFromNow.toISOString())
        .gte("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: true })
        .limit(5);

      // Documentos vencidos
      const { data: expired } = await supabase
        .from("documents")
        .select("name, expires_at")
        .not("expires_at", "is", null)
        .lt("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: false })
        .limit(5);

      // Atividade recente (últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: recentUploads } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      return {
        totalDocuments: totalDocuments || 0,
        totalFolders: totalFolders || 0,
        byCategory: byCategory || {},
        byStatus: byStatus || {},
        totalStorage,
        expiringSoon: expiringSoon || [],
        expired: expired || [],
        recentUploads: recentUploads || 0,
      };
    },
  });

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      contracts: "Contratos",
      invoices: "Notas Fiscais",
      receipts: "Comprovantes",
      hr: "RH",
      legal: "Jurídico",
      technical: "Técnico",
      financial: "Financeiro",
      other: "Outros",
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      active: "Ativo",
      expired: "Vencido",
      pending_approval: "Pendente",
      archived: "Arquivado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "expired": return "bg-red-100 text-red-800 border-red-200";
      case "pending_approval": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!stats) {
    return <div>Carregando dashboard...</div>;
  }

  const storageLimit = 1024 * 1024 * 1024 * 10; // 10GB
  const storageUsagePercent = (stats.totalStorage / storageLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pastas</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploads Recentes</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(stats.totalStorage)}</div>
            <Progress value={storageUsagePercent} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {storageUsagePercent.toFixed(1)}% de {formatBytes(storageLimit)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm">{getCategoryLabel(category)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ 
                          width: `${(count as number / stats.totalDocuments) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentos por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge className={getStatusColor(status)}>
                    {getStatusLabel(status)}
                  </Badge>
                  <span className="text-sm font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentos Vencendo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Vencendo em 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.expiringSoon.length > 0 ? (
              <div className="space-y-2">
                {stats.expiringSoon.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                    <span className="text-sm truncate">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(doc.expires_at), "dd/MM", { locale: ptBR })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum documento vencendo</p>
            )}
          </CardContent>
        </Card>

        {/* Documentos Vencidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Documentos Vencidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.expired.length > 0 ? (
              <div className="space-y-2">
                {stats.expired.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm truncate">{doc.name}</span>
                    <span className="text-xs text-red-600">
                      {format(new Date(doc.expires_at), "dd/MM", { locale: ptBR })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum documento vencido</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};