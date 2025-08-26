import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface DREChartsData {
  monthly: Array<{
    month: string;
    receita: number;
    custos: number;
    resultado: number;
    margem: number;
  }>;
  categories: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  trends: {
    receita: { value: number; change: number };
    custos: { value: number; change: number };
    margem: { value: number; change: number };
  };
}

interface DREChartsProps {
  data: DREChartsData;
}

export function DRECharts({ data }: DREChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'margem' ? formatPercentage(entry.value) : formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const TrendIcon = ({ change }: { change: number }) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Evolução Mensal */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Evolução Mensal - Receitas vs Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="receita"
                stackId="1"
                stroke="hsl(var(--success))"
                fill="hsl(var(--success))"
                fillOpacity={0.3}
                name="Receita"
              />
              <Area
                type="monotone"
                dataKey="custos"
                stackId="2"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.3}
                name="Custos"
              />
              <Line
                type="monotone"
                dataKey="resultado"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Resultado"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Margem de Lucro */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Margem</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [formatPercentage(value), 'Margem']}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="margem"
                stroke="hsl(var(--warning))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, fill: 'hsl(var(--warning))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Distribuição de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* KPIs de Tendência */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Indicadores de Tendência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Receita</span>
                <TrendIcon change={data.trends.receita.change} />
              </div>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(data.trends.receita.value)}
              </div>
              <div className={`text-sm ${data.trends.receita.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                {data.trends.receita.change >= 0 ? '+' : ''}{formatPercentage(data.trends.receita.change)} vs período anterior
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Custos</span>
                <TrendIcon change={-data.trends.custos.change} />
              </div>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(data.trends.custos.value)}
              </div>
              <div className={`text-sm ${data.trends.custos.change <= 0 ? 'text-success' : 'text-destructive'}`}>
                {data.trends.custos.change >= 0 ? '+' : ''}{formatPercentage(data.trends.custos.change)} vs período anterior
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Margem</span>
                <TrendIcon change={data.trends.margem.change} />
              </div>
              <div className={`text-2xl font-bold ${data.trends.margem.value >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercentage(data.trends.margem.value)}
              </div>
              <div className={`text-sm ${data.trends.margem.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                {data.trends.margem.change >= 0 ? '+' : ''}{formatPercentage(data.trends.margem.change)}pp vs período anterior
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}