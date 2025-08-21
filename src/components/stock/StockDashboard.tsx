import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Package, TrendingUp, ShoppingCart, Boxes } from "lucide-react";

interface StockStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  recentMovements: number;
}

interface StockAlert {
  id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  alert_type: 'low_stock' | 'out_of_stock';
}

export const StockDashboard = () => {
  const [stats, setStats] = useState<StockStats>({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    recentMovements: 0
  });
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products statistics
      const { data: products } = await supabase
        .from('products')
        .select('current_stock, min_stock, price')
        .eq('is_active', true);

      // Fetch stock alerts
      const { data: alertsData } = await supabase
        .from('stock_alerts')
        .select(`
          id,
          alert_type,
          products!inner (
            name,
            current_stock,
            min_stock
          )
        `)
        .eq('is_active', true);

      // Fetch recent movements (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: movements } = await supabase
        .from('stock_movements')
        .select('id')
        .gte('created_at', sevenDaysAgo.toISOString());

      if (products) {
        const totalProducts = products.length;
        const lowStockItems = products.filter(p => p.current_stock <= p.min_stock && p.current_stock > 0).length;
        const outOfStockItems = products.filter(p => p.current_stock <= 0).length;
        const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.price), 0);

        setStats({
          totalProducts,
          lowStockItems,
          outOfStockItems,
          totalValue,
          recentMovements: movements?.length || 0
        });
      }

      if (alertsData) {
        const formattedAlerts = alertsData.map(alert => ({
          id: alert.id,
          product_name: alert.products.name,
          current_stock: alert.products.current_stock,
          min_stock: alert.products.min_stock,
          alert_type: alert.alert_type
        }));
        setAlerts(formattedAlerts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">produtos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">itens com estoque baixo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <Boxes className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">itens em falta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">valor do estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentMovements}</div>
            <p className="text-xs text-muted-foreground">últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>
              Items que precisam de atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={alert.alert_type === 'out_of_stock' ? 'border-destructive' : 'border-warning'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>
                      <strong>{alert.product_name}</strong> - 
                      {alert.alert_type === 'out_of_stock' 
                        ? ' Sem estoque' 
                        : ` Estoque baixo (${alert.current_stock}/${alert.min_stock})`
                      }
                    </span>
                    <Badge variant={alert.alert_type === 'out_of_stock' ? 'destructive' : 'secondary'}>
                      {alert.alert_type === 'out_of_stock' ? 'Urgente' : 'Atenção'}
                    </Badge>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};