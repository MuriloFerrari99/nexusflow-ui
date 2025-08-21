import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WidgetLibrary } from "./WidgetLibrary";
import { DashboardCanvas } from "./DashboardCanvas";
import { Save, Eye, Undo, Redo } from "lucide-react";
import { toast } from "sonner";

interface Widget {
  id: string;
  type: string;
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

export function DashboardBuilder() {
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const saveDashboard = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const dashboardData = {
        name: dashboardName,
        description: dashboardDescription,
        layout: JSON.stringify(widgets),
        is_public: isPublic,
        created_by: user.id,
        company_id: user.user_metadata?.company_id,
      };

      const { data, error } = await supabase
        .from("analytics_dashboards")
        .insert(dashboardData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Dashboard salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["analytics-dashboards"] });
      // Reset form
      setDashboardName("");
      setDashboardDescription("");
      setIsPublic(false);
      setWidgets([]);
    },
    onError: (error) => {
      console.error("Error saving dashboard:", error);
      toast.error("Erro ao salvar dashboard");
    },
  });

  const addWidget = (widgetType: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: `Novo ${widgetType}`,
      config: getDefaultConfig(widgetType),
      position: { x: 0, y: 0, w: 4, h: 4 },
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget.id);
  };

  const updateWidget = (widgetId: string, updates: Partial<Widget>) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, ...updates } : widget
    ));
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
    setSelectedWidget(null);
  };

  const getDefaultConfig = (type: string) => {
    switch (type) {
      case "kpi":
        return {
          metric: "",
          value: 0,
          comparison: { period: "previous", value: 0 },
          format: "number",
        };
      case "chart":
        return {
          chartType: "line",
          dataSource: "",
          xAxis: "",
          yAxis: "",
        };
      case "table":
        return {
          dataSource: "",
          columns: [],
          pagination: true,
        };
      default:
        return {};
    }
  };

  const canSave = dashboardName.trim() && widgets.length > 0;

  return (
    <div className="space-y-6">
      {/* Dashboard Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Dashboard</Label>
              <Input
                id="name"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                placeholder="Ex: Dashboard de Vendas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={dashboardDescription}
                onChange={(e) => setDashboardDescription(e.target.value)}
                placeholder="Descrição opcional do dashboard"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Dashboard público (visível para todos da empresa)</Label>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => saveDashboard.mutate()}
              disabled={!canSave || saveDashboard.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveDashboard.isPending ? "Salvando..." : "Salvar Dashboard"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "Editar" : "Visualizar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Widget Library */}
        {!previewMode && (
          <div className="lg:col-span-1">
            <WidgetLibrary onAddWidget={addWidget} />
          </div>
        )}

        {/* Dashboard Canvas */}
        <div className={previewMode ? "lg:col-span-4" : "lg:col-span-3"}>
          <DashboardCanvas
            widgets={widgets}
            selectedWidget={selectedWidget}
            onSelectWidget={setSelectedWidget}
            onUpdateWidget={updateWidget}
            onRemoveWidget={removeWidget}
            previewMode={previewMode}
          />
        </div>
      </div>
    </div>
  );
}