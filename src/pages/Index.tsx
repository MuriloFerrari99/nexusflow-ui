import { Layout } from "@/components/layout/Layout";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu sistema ERP. Aqui você encontra um resumo de todas as suas operações.
          </p>
        </div>

        {/* KPI Cards */}
        <DashboardGrid />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          
          {/* Placeholder for charts/additional widgets */}
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Vendas por Mês</h2>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de vendas será implementado aqui</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
