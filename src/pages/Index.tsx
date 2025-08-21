import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu sistema ERP. Aqui você encontra um resumo de todas as suas operações.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="mb-8">
            <DashboardGrid />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

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
        </main>
      </div>
    </div>
  );
};

export default Index;
