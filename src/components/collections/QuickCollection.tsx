import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Zap, CreditCard, QrCode, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickCollection() {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { toast } = useToast();

  const handleQuickCollection = () => {
    // TODO: Implementar lógica de envio de cobrança
    toast({
      title: "Cobrança enviada!",
      description: `Link de pagamento via ${paymentMethod} criado com sucesso.`,
    });
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Cobrança Rápida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              Enviar Cobrança
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Cobrança</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer">Cliente</Label>
                  <Input id="customer" placeholder="Nome do cliente" />
                </div>
                <div>
                  <Label htmlFor="document">CPF/CNPJ</Label>
                  <Input id="document" placeholder="000.000.000-00" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input id="amount" type="number" placeholder="0,00" />
                </div>
                <div>
                  <Label htmlFor="dueDate">Vencimento</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              
              <div>
                <Label>Método de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        PIX
                      </div>
                    </SelectItem>
                    <SelectItem value="boleto">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Boleto
                      </div>
                    </SelectItem>
                    <SelectItem value="credit_card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Cartão de Crédito
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descrição da cobrança..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleQuickCollection} className="flex-1">
                  Gerar Cobrança
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="mt-4 space-y-2">
          <div className="text-xs text-muted-foreground">Métodos disponíveis:</div>
          <div className="flex gap-1">
            <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              <QrCode className="h-3 w-3" />
              PIX
            </div>
            <div className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              <FileText className="h-3 w-3" />
              Boleto
            </div>
            <div className="flex items-center gap-1 text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
              <CreditCard className="h-3 w-3" />
              Cartão
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}