import { Clock, DollarSign, Package, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "sale" | "stock" | "customer" | "finance";
  title: string;
  description: string;
  time: string;
  value?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "sale",
    title: "Nova venda realizada",
    description: "Pedido #1234 - Cliente João Silva",
    time: "há 2 minutos",
    value: "R$ 450,00"
  },
  {
    id: "2", 
    type: "stock",
    title: "Estoque atualizado",
    description: "Produto: Notebook Dell - Entrada de 15 unidades",
    time: "há 15 minutos",
  },
  {
    id: "3",
    type: "customer",
    title: "Novo cliente cadastrado",
    description: "Maria Santos - Empresa ABC Ltda",
    time: "há 1 hora",
  },
  {
    id: "4",
    type: "finance",
    title: "Pagamento recebido",
    description: "Conta #5678 - Transferência bancária",
    time: "há 2 horas",
    value: "R$ 1.250,00"
  },
  {
    id: "5",
    type: "sale",
    title: "Pedido cancelado",
    description: "Pedido #1230 - Cancelamento solicitado pelo cliente",
    time: "há 3 horas",
  }
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "sale":
      return <DollarSign className="w-4 h-4" />;
    case "stock":
      return <Package className="w-4 h-4" />;
    case "customer":
      return <User className="w-4 h-4" />;
    case "finance":
      return <FileText className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "sale":
      return "text-success bg-success/10";
    case "stock":
      return "text-primary bg-primary/10";
    case "customer":
      return "text-warning bg-warning/10";
    case "finance":
      return "text-primary bg-primary/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

export const RecentActivity = () => {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Atividades Recentes</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              getActivityColor(activity.type)
            )}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {activity.title}
                </h3>
                {activity.value && (
                  <span className="text-sm font-medium text-success shrink-0">
                    {activity.value}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {activity.description}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
          Ver todas as atividades →
        </button>
      </div>
    </div>
  );
};