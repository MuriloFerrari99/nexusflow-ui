import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    badge: null,
  },
  {
    title: "Finanças",
    icon: DollarSign,
    path: "/financas",
    badge: "novo",
    subItems: [
      { title: "Contas a Pagar", path: "/financas/contas-pagar" },
      { title: "Contas a Receber", path: "/financas/contas-receber" },
      { title: "Fluxo de Caixa", path: "/financas/fluxo-caixa" },
    ],
  },
  {
    title: "Produtos",
    icon: Package,
    path: "/produtos",
    badge: "novo",
  },
  {
    title: "Estoque",
    icon: Package,
    path: "/estoque",
    badge: "5",
    subItems: [
      { title: "Movimentações", path: "/estoque/movimentacoes" },
      { title: "Relatórios", path: "/estoque/relatorios" },
    ],
  },
  {
    title: "CRM",
    icon: Users,
    path: "/crm",
    badge: null,
    subItems: [
      { title: "Clientes", path: "/crm/clientes" },
      { title: "Vendas", path: "/crm/vendas" },
      { title: "Pipeline", path: "/crm/pipeline" },
    ],
  },
  {
    title: "RH",
    icon: UserCheck,
    path: "/rh",
    badge: "novo",
    subItems: [
      { title: "Funcionários", path: "/rh/funcionarios" },
      { title: "Ponto", path: "/rh/ponto" },
      { title: "Folha", path: "/rh/folha" },
      { title: "Relatórios", path: "/rh/relatorios" },
      { title: "Autoatendimento", path: "/rh/autoatendimento" },
    ],
  },
  {
    title: "Projetos",
    icon: Users,
    path: "/projetos",
    badge: "novo",
    subItems: [
      { title: "Dashboard", path: "/projetos" },
      { title: "Lista", path: "/projetos" },
      { title: "Kanban", path: "/projetos" },
      { title: "Gantt", path: "/projetos" },
    ],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    path: "/relatorios",
    badge: null,
  },
  {
    title: "Documentos",
    icon: FolderOpen,
    path: "/documentos",
    badge: "Novo",
  },
  {
    title: "Fiscal",
    icon: FileText,
    path: "/fiscal",
    badge: "novo",
    subItems: [
      { title: "NF-e", path: "/fiscal" },
      { title: "NFS-e", path: "/fiscal" },
      { title: "SPED", path: "/fiscal" },
      { title: "Tributação", path: "/fiscal" },
      { title: "Auditoria", path: "/fiscal" },
      { title: "Configurações", path: "/fiscal" },
    ],
  },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col h-screen sticky top-0",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-8 h-8 hover:bg-muted/60"
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.title}>
            {/* Main Item */}
            <div className="group">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "sidebar-item group-hover:bg-muted/60",
                    isActive && "active",
                    isCollapsed && "justify-center px-2"
                  )
                }
                end={item.path === "/"}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.title}</span>
                    <div className="ml-auto flex items-center gap-2">
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          item.badge === "novo" 
                            ? "bg-success text-success-foreground" 
                            : "bg-warning text-warning-foreground"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {item.subItems && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleExpanded(item.title);
                          }}
                        >
                          {expandedItems.includes(item.title) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            </div>

            {/* Sub Items */}
            {!isCollapsed && item.subItems && expandedItems.includes(item.title) && (
              <div className="ml-6 mt-2 space-y-1 fade-in">
                {item.subItems.map((subItem) => (
                  <NavLink
                    key={subItem.path}
                    to={subItem.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-muted/40",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )
                    }
                  >
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                    <span className="truncate">{subItem.title}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings at Bottom */}
      <div className="p-4 border-t border-border">
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            cn(
              "sidebar-item",
              isActive && "active",
              isCollapsed && "justify-center px-2"
            )
          }
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Configurações</span>}
        </NavLink>
      </div>
    </aside>
  );
};