import { Plus, FileText, Package, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QuickActions = () => {
  const actions = [
    {
      title: "Nova Venda",
      description: "Registrar pedido",
      icon: <Plus className="w-4 h-4" />,
      variant: "default" as const,
    },
    {
      title: "Entrada Estoque",
      description: "Adicionar produtos",
      icon: <Package className="w-4 h-4" />,
      variant: "outline" as const,
    },
    {
      title: "Novo Cliente",
      description: "Cadastrar cliente",
      icon: <Users className="w-4 h-4" />,
      variant: "outline" as const,
    },
    {
      title: "Lançamento Financeiro",
      description: "Receita/Despesa",
      icon: <DollarSign className="w-4 h-4" />,
      variant: "outline" as const,
    },
    {
      title: "Relatório",
      description: "Gerar relatório",
      icon: <FileText className="w-4 h-4" />,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto p-4 flex flex-col items-center gap-2 btn-floating"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              {action.icon}
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};