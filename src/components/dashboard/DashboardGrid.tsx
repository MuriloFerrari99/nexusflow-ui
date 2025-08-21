import { DollarSign, Package, Users, TrendingUp, ShoppingCart, AlertTriangle } from "lucide-react";
import { KPICard } from "./KPICard";

export const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
      {/* Faturamento */}
      <KPICard
        title="Faturamento Mensal"
        value="R$ 142.850"
        subtitle="Receita bruta atual"
        trend={{ value: 12.5, isPositive: true }}
        icon={<DollarSign className="w-5 h-5" />}
        variant="success"
      />

      {/* Vendas */}
      <KPICard
        title="Vendas Hoje"
        value="24"
        subtitle="Pedidos processados"
        trend={{ value: 8.2, isPositive: true }}
        icon={<ShoppingCart className="w-5 h-5" />}
        variant="primary"
      />

      {/* Estoque Baixo */}
      <KPICard
        title="Estoque Baixo"
        value="5"
        subtitle="Produtos precisam reposição"
        trend={{ value: 15.3, isPositive: false }}
        icon={<AlertTriangle className="w-5 h-5" />}
        variant="warning"
      />

      {/* Clientes Ativos */}
      <KPICard
        title="Clientes Ativos"
        value="1.247"
        subtitle="Total de clientes cadastrados"
        trend={{ value: 3.1, isPositive: true }}
        icon={<Users className="w-5 h-5" />}
        variant="default"
      />

      {/* Total de Produtos */}
      <KPICard
        title="Produtos em Estoque"
        value="487"
        subtitle="Itens disponíveis"
        trend={{ value: 2.8, isPositive: true }}
        icon={<Package className="w-5 h-5" />}
        variant="default"
      />

      {/* Crescimento Mensal */}
      <KPICard
        title="Crescimento"
        value="+18.2%"
        subtitle="Comparado ao mês anterior"
        trend={{ value: 4.5, isPositive: true }}
        icon={<TrendingUp className="w-5 h-5" />}
        variant="success"
      />
    </div>
  );
};