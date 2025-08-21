import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockMovement {
  id: string;
  movement_type: string;
  quantity: number;
  unit_cost?: number;
  notes?: string;
  created_at: string;
  products: { name: string; sku: string };
}

export const StockMovements = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          id,
          movement_type,
          quantity,
          unit_cost,
          notes,
          created_at,
          products (name, sku)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMovements(data || []);
    } catch (error) {
      console.error('Error fetching movements:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as movimentações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'adjustment':
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getMovementBadge = (type: string) => {
    const typeMap = {
      in: { label: "Entrada", variant: "default" as const },
      out: { label: "Saída", variant: "destructive" as const },
      adjustment: { label: "Ajuste", variant: "secondary" as const }
    };
    
    return typeMap[type as keyof typeof typeMap] || { label: type, variant: "secondary" as const };
  };

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = 
      movement.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.products?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || movement.movement_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div>Carregando movimentações...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movimentações de Estoque</CardTitle>
          <CardDescription>
            Histórico completo de entradas, saídas e ajustes de estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar movimentações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="in">Entradas</SelectItem>
                  <SelectItem value="out">Saídas</SelectItem>
                  <SelectItem value="adjustment">Ajustes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Custo Unitário</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => {
                    const badge = getMovementBadge(movement.movement_type);
                    const total = movement.unit_cost ? movement.quantity * movement.unit_cost : 0;
                    
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {new Date(movement.created_at).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{movement.products?.name}</div>
                            <div className="text-sm text-muted-foreground">{movement.products?.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.movement_type)}
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.movement_type === 'out' ? '-' : '+'}{movement.quantity}
                        </TableCell>
                        <TableCell>
                          {movement.unit_cost 
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(movement.unit_cost)
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          {total > 0 
                            ? new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(total)
                            : "-"
                          }
                        </TableCell>
                        <TableCell>{movement.notes || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredMovements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma movimentação encontrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};