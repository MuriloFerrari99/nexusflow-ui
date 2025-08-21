import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Eye, Edit, Share, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardViewer } from "./DashboardViewer";
import { toast } from "sonner";

interface DashboardGridProps {
  filters: {
    dateRange: { from: Date | null; to: Date | null };
    users: string[];
    modules: string[];
    categories: string[];
  };
}

export function DashboardGrid({ filters }: DashboardGridProps) {
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

  const { data: dashboards, isLoading, refetch } = useQuery({
    queryKey: ["analytics-dashboards", filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_dashboards")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (dashboardId: string) => {
    try {
      const { error } = await supabase
        .from("analytics_dashboards")
        .delete()
        .eq("id", dashboardId);

      if (error) throw error;

      toast.success("Dashboard excluído com sucesso");
      refetch();
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast.error("Erro ao excluir dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (selectedDashboard) {
    return (
      <DashboardViewer
        dashboardId={selectedDashboard}
        onClose={() => setSelectedDashboard(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Default Dashboards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Dashboards Padrão</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Visão Geral", module: "Geral", description: "Métricas gerais da empresa" },
            { name: "Vendas", module: "CRM", description: "Performance de vendas e pipeline" },
            { name: "Estoque", module: "Estoque", description: "Controle e movimentações" },
            { name: "Financeiro", module: "Financeiro", description: "Fluxo de caixa e receitas" },
            { name: "RH", module: "RH", description: "Indicadores de recursos humanos" },
            { name: "Projetos", module: "Projetos", description: "Status e progresso dos projetos" },
          ].map((dashboard) => (
            <Card key={dashboard.name} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{dashboard.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {dashboard.module}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Preview do Dashboard</span>
                </div>
                <Button className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Dashboards */}
      {dashboards && dashboards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Dashboards Personalizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Card key={dashboard.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{dashboard.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedDashboard(dashboard.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(dashboard.id)}
                          className="text-destructive"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Por Admin</span>
                    <span>•</span>
                    <span>{new Date(dashboard.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {dashboard.layout ? JSON.parse(dashboard.layout.toString()).length : 0} widgets
                    </span>
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => setSelectedDashboard(dashboard.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!dashboards || dashboards.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum dashboard personalizado encontrado</p>
            <Button>Criar Primeiro Dashboard</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}