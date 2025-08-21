import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KPIWidget } from "./widgets/KPIWidget";
import { ChartWidget } from "./widgets/ChartWidget";
import { TableWidget } from "./widgets/TableWidget";
import { Settings, X, Maximize2 } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  type: string;
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

interface DashboardCanvasProps {
  widgets: Widget[];
  selectedWidget: string | null;
  onSelectWidget: (widgetId: string | null) => void;
  onUpdateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  onRemoveWidget: (widgetId: string) => void;
  previewMode?: boolean;
}

export function DashboardCanvas({
  widgets,
  selectedWidget,
  onSelectWidget,
  onUpdateWidget,
  onRemoveWidget,
  previewMode = false,
}: DashboardCanvasProps) {
  const [layouts, setLayouts] = useState({});

  const onLayoutChange = (layout: any[], layouts: any) => {
    setLayouts(layouts);
    
    // Update widget positions
    layout.forEach((item) => {
      const widget = widgets.find(w => w.id === item.i);
      if (widget) {
        onUpdateWidget(widget.id, {
          position: { x: item.x, y: item.y, w: item.w, h: item.h }
        });
      }
    });
  };

  const renderWidget = (widget: Widget) => {
    const isSelected = selectedWidget === widget.id;

    return (
      <Card 
        key={widget.id}
        className={`h-full ${isSelected && !previewMode ? 'ring-2 ring-primary' : ''}`}
        onClick={() => !previewMode && onSelectWidget(widget.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate">{widget.title}</CardTitle>
            {!previewMode && (
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  {widget.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open widget settings
                  }}
                >
                  <Settings className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveWidget(widget.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-[calc(100%-60px)]">
          {renderWidgetContent(widget)}
        </CardContent>
      </Card>
    );
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "kpi":
        return <KPIWidget config={widget.config} />;
      case "line-chart":
      case "bar-chart":
      case "pie-chart":
        return <ChartWidget type={widget.type} config={widget.config} />;
      case "data-table":
        return <TableWidget config={widget.config} />;
      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Maximize2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Widget: {widget.type}</p>
              <p className="text-xs">Configuração necessária</p>
            </div>
          </div>
        );
    }
  };

  const gridLayout = widgets.map(widget => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    minW: 2,
    minH: 2,
  }));

  if (widgets.length === 0) {
    return (
      <Card className="h-96">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <Maximize2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Canvas Vazio</h3>
            <p className="text-muted-foreground">
              Arraste widgets da biblioteca para começar a criar seu dashboard
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-96">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={!previewMode}
        isResizable={!previewMode}
        margin={[16, 16]}
        containerPadding={[0, 0]}
      >
        {widgets.map(renderWidget)}
      </ResponsiveGridLayout>
    </div>
  );
}