import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Scan, Plus, Minus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeEntry {
  id: string;
  barcode: string;
  quantity: number;
  movement_type: string;
  created_at: string;
  processed: boolean;
  products?: { name: string; current_stock: number };
}

export const BarcodeSimulator = () => {
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [movementType, setMovementType] = useState("in");
  const [entries, setEntries] = useState<BarcodeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!barcode.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código de barras válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // For now, just create a mock entry since products table structure is being set up
      const mockEntry: BarcodeEntry = {
        id: Date.now().toString(),
        barcode: barcode,
        quantity: parseInt(quantity),
        movement_type: movementType,
        created_at: new Date().toISOString(),
        processed: false,
        products: { name: `Produto ${barcode}`, current_stock: 10 }
      };

      setEntries(prev => [mockEntry, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Código de barras escaneado com sucesso!",
      });

      // Clear form
      setBarcode("");
      setQuantity("1");
    } catch (error: any) {
      console.error('Error processing barcode:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar código de barras.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processEntry = async (entryId: string) => {
    try {
      // Update local state to mark as processed
      setEntries(prev => prev.map(e => 
        e.id === entryId ? { ...e, processed: true } : e
      ));

      toast({
        title: "Sucesso",
        description: "Movimentação processada com sucesso!",
      });
    } catch (error: any) {
      console.error('Error processing entry:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar entrada.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner Simulator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Simulador de Código de Barras
            </CardTitle>
            <CardDescription>
              Digite ou escaneie códigos de barras para movimentar estoque
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Digite o código de barras"
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="movement_type">Tipo de Movimento</Label>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Entrada</SelectItem>
                    <SelectItem value="out">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleScan} 
              disabled={loading || !barcode.trim()}
              className="w-full gap-2"
            >
              <Scan className="h-4 w-4" />
              {loading ? "Processando..." : "Escanear"}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Como usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium">Digite o código de barras</p>
                  <p className="text-sm text-muted-foreground">Insira o código manualmente ou use um leitor de código de barras</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium">Defina quantidade e tipo</p>
                  <p className="text-sm text-muted-foreground">Escolha se é entrada ou saída e a quantidade</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium">Processe a movimentação</p>
                  <p className="text-sm text-muted-foreground">Revise e confirme para atualizar o estoque</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Entradas Recentes</CardTitle>
            <CardDescription>
              Códigos escaneados aguardando processamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {entry.movement_type === 'in' ? (
                        <Plus className="h-4 w-4 text-green-600" />
                      ) : (
                        <Minus className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant={entry.movement_type === 'in' ? 'default' : 'destructive'}>
                        {entry.movement_type === 'in' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{entry.products?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Código: {entry.barcode} • Quantidade: {entry.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.processed ? (
                      <Badge variant="default" className="gap-1">
                        <Check className="h-3 w-3" />
                        Processado
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => processEntry(entry.id)}
                      >
                        Processar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};