import {
  ResponsiveContainer,
  LineChart,
  Line,
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
} from "recharts";

interface ChartWidgetProps {
  type: "line-chart" | "bar-chart" | "pie-chart";
  config: {
    dataSource?: string;
    xAxis?: string;
    yAxis?: string;
    data?: any[];
  };
}

// Sample data for demonstration
const sampleLineData = [
  { name: "Jan", value: 4000, target: 3500 },
  { name: "Fev", value: 3000, target: 3200 },
  { name: "Mar", value: 2000, target: 2800 },
  { name: "Abr", value: 2780, target: 3100 },
  { name: "Mai", value: 1890, target: 2900 },
  { name: "Jun", value: 2390, target: 3300 },
];

const sampleBarData = [
  { name: "Produto A", value: 400 },
  { name: "Produto B", value: 300 },
  { name: "Produto C", value: 300 },
  { name: "Produto D", value: 200 },
];

const samplePieData = [
  { name: "Desktop", value: 400, color: "hsl(var(--primary))" },
  { name: "Mobile", value: 300, color: "hsl(var(--secondary))" },
  { name: "Tablet", value: 300, color: "hsl(var(--accent))" },
  { name: "Outros", value: 200, color: "hsl(var(--muted))" },
];

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

export function ChartWidget({ type, config }: ChartWidgetProps) {
  const { data } = config;

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data || sampleLineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))" }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="5 5"
          strokeWidth={1}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data || sampleBarData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data || samplePieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="hsl(var(--primary))"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {(data || samplePieData).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (type) {
      case "line-chart":
        return renderLineChart();
      case "bar-chart":
        return renderBarChart();
      case "pie-chart":
        return renderPieChart();
      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Tipo de gráfico não suportado
          </div>
        );
    }
  };

  return <div className="h-full">{renderChart()}</div>;
}