import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCanvas } from "./DashboardCanvas";
import { ExportMenu } from "./ExportMenu";
import { ArrowLeft, Share, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface DashboardViewerProps {
  dashboardId: string;
  onClose: () => void;
}

export function DashboardViewer({ dashboardId, onClose }: DashboardViewerProps) {
  const { data: dashboard, isLoading, refetch } = useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_dashboards")
        .select("*")
        .eq("id", dashboardId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleRefresh = () => {
    refetch();
    toast.success("Dashboard atualizado");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/relatorios?dashboard=${dashboardId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Erro ao copiar link");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Dashboard não encontrado</p>
          <Button onClick={onClose} className="mt-4">
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const widgets = dashboard.layout ? JSON.parse(dashboard.layout.toString()) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{dashboard.name}</h1>
            {dashboard.description && (
              <p className="text-muted-foreground">{dashboard.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>Por Admin</span>
              <span>•</span>
              <span>Atualizado em {new Date(dashboard.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          <ExportMenu dashboardId={dashboardId} dashboardName={dashboard.name} />
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardCanvas
        widgets={widgets}
        selectedWidget={null}
        onSelectWidget={() => {}}
        onUpdateWidget={() => {}}
        onRemoveWidget={() => {}}
        previewMode={true}
      />

      {/* Dashboard Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Widgets:</span>
              <span className="ml-2">{widgets.length}</span>
            </div>
            <div>
              <span className="font-medium">Visibilidade:</span>
              <span className="ml-2">Privado</span>
            </div>
            <div>
              <span className="font-medium">Última atualização:</span>
              <span className="ml-2">
                {new Date(dashboard.updated_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}