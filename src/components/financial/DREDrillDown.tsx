import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  User,
  Building
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DrillDownItem {
  id: string;
  name: string;
  value: number;
  percentage: number;
  change?: number;
  category: string;
  hasChildren: boolean;
  children?: DrillDownItem[];
  transactions?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    responsible?: string;
    project?: string;
  }>;
}

interface DREDrillDownData {
  receitas: DrillDownItem[];
  custos: DrillDownItem[];
  despesas: DrillDownItem[];
}

interface DREDrillDownProps {
  data: DREDrillDownData;
  onItemClick?: (item: DrillDownItem) => void;
}

export function DREDrillDown({ data, onItemClick }: DREDrillDownProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<DrillDownItem | null>(null);
  const [view, setView] = useState<'overview' | 'detail'>('overview');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: DrillDownItem) => {
    setSelectedItem(item);
    setView('detail');
    onItemClick?.(item);
  };

  const TrendIndicator = ({ value }: { value?: number }) => {
    if (!value) return null;
    
    return (
      <div className={`flex items-center gap-1 ${value >= 0 ? 'text-success' : 'text-destructive'}`}>
        {value >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs">
          {value >= 0 ? '+' : ''}{formatPercentage(value)}
        </span>
      </div>
    );
  };

  const DrillDownTable = ({ items, title, type }: { 
    items: DrillDownItem[]; 
    title: string; 
    type: 'receitas' | 'custos' | 'despesas';
  }) => {
    const getTypeColor = () => {
      switch (type) {
        case 'receitas': return 'text-success';
        case 'custos': return 'text-destructive';
        case 'despesas': return 'text-warning';
        default: return 'text-foreground';
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className={`${getTypeColor()}`}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conta</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">% Total</TableHead>
                <TableHead className="text-right">Tendência</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <Collapsible key={item.id}>
                  <TableRow className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.hasChildren && (
                          <CollapsibleTrigger 
                            onClick={() => toggleExpanded(item.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {expandedItems.has(item.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </CollapsibleTrigger>
                        )}
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${getTypeColor()}`}>
                      {formatCurrency(item.value)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(item.percentage)}
                    </TableCell>
                    <TableCell className="text-right">
                      <TrendIndicator value={item.change} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleItemClick(item)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {item.hasChildren && (
                    <CollapsibleContent>
                      {item.children?.map((child) => (
                        <TableRow key={child.id} className="bg-muted/30">
                          <TableCell className="pl-12">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{child.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {child.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className={`text-right text-sm ${getTypeColor()}`}>
                            {formatCurrency(child.value)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatPercentage(child.percentage)}
                          </TableCell>
                          <TableCell className="text-right">
                            <TrendIndicator value={child.change} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleItemClick(child)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const DetailView = ({ item }: { item: DrillDownItem }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {item.name}
              <Badge variant="outline">{item.category}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Detalhamento das transações
            </p>
          </div>
          <Button variant="outline" onClick={() => setView('overview')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Resumo do Item */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
              <div className="text-xl font-bold">{formatCurrency(item.value)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Participação</div>
              <div className="text-xl font-bold">{formatPercentage(item.percentage)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Variação</div>
              <div className="text-xl font-bold">
                <TrendIndicator value={item.change} />
              </div>
            </div>
          </div>

          {/* Transações Detalhadas */}
          {item.transactions && item.transactions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Transações ({item.transactions.length})</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {transaction.date}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        {transaction.responsible && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {transaction.responsible}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.project && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {transaction.project}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (view === 'detail' && selectedItem) {
    return <DetailView item={selectedItem} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Análise Detalhada - Drill Down</h3>
        <p className="text-sm text-muted-foreground">
          Clique nos itens para explorar os detalhes das transações
        </p>
      </div>

      <div className="space-y-6">
        <DrillDownTable 
          items={data.receitas} 
          title="📈 Receitas" 
          type="receitas" 
        />
        
        <DrillDownTable 
          items={data.custos} 
          title="📉 Custos Diretos" 
          type="custos" 
        />
        
        <DrillDownTable 
          items={data.despesas} 
          title="💰 Despesas Operacionais" 
          type="despesas" 
        />
      </div>
    </div>
  );
}