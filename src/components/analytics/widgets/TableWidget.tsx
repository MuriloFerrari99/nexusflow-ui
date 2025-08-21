import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TableWidgetProps {
  config: {
    dataSource?: string;
    columns?: string[];
    data?: any[];
    pagination?: boolean;
  };
}

// Sample data for demonstration
const sampleData = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@exemplo.com",
    status: "Ativo",
    value: 1500,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@exemplo.com",
    status: "Pendente",
    value: 2800,
    date: "2024-01-14",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@exemplo.com",
    status: "Ativo",
    value: 3200,
    date: "2024-01-13",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    email: "ana@exemplo.com",
    status: "Inativo",
    value: 950,
    date: "2024-01-12",
  },
];

const statusColors = {
  Ativo: "bg-green-100 text-green-800",
  Pendente: "bg-yellow-100 text-yellow-800",
  Inativo: "bg-red-100 text-red-800",
};

export function TableWidget({ config }: TableWidgetProps) {
  const { data = sampleData } = config;

  const formatValue = (value: any, key: string) => {
    if (key === "value") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    }
    if (key === "date") {
      return new Date(value).toLocaleDateString("pt-BR");
    }
    return value;
  };

  const renderCell = (value: any, key: string) => {
    if (key === "status") {
      return (
        <Badge 
          variant="secondary" 
          className={statusColors[value as keyof typeof statusColors] || ""}
        >
          {value}
        </Badge>
      );
    }
    return formatValue(value, key);
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">Nenhum dado disponível</p>
          <p className="text-xs">Configure a fonte de dados</p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0]).filter(key => key !== "id");

  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="text-xs">
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((row, index) => (
            <TableRow key={row.id || index}>
              {columns.map((column) => (
                <TableCell key={column} className="text-xs">
                  {renderCell(row[column], column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length > 10 && (
        <div className="p-2 text-center text-xs text-muted-foreground border-t">
          Mostrando 10 de {data.length} registros
        </div>
      )}
    </div>
  );
}