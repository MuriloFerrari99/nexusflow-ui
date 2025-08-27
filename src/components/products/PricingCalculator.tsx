import { useState, useEffect } from "react";
import { Calculator, Save, RefreshCw, TrendingUp, DollarSign, Percent, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculatePricing, PricingInputs, PricingMode, RoundingConfig, PricingResult } from "@/lib/pricing";

interface Product {
  id: string;
  sku: string;
  name: string;
  cost_base: number;
  freight_unit_cost: number;
  packaging_unit_cost: number;
  other_variable_cost: number;
  price_current?: number;
  price_suggested?: number;
}

interface Channel {
  id: string;
  name: string;
  gateway_percent: number;
  marketplace_percent: number;
  sales_commission_percent: number;
  admin_fixed_fee: number;
  tax_burden_percent: number;
}

interface Props {
  product: Product;
  onClose: () => void;
}

export function PricingCalculator({ product, onClose }: Props) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [mode, setMode] = useState<PricingMode>({ mode: 'markup' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Inputs de preço
  const [inputs, setInputs] = useState<PricingInputs>({
    cost_base: product.cost_base,
    freight_unit_cost: product.freight_unit_cost,
    packaging_unit_cost: product.packaging_unit_cost,
    other_variable_cost: product.other_variable_cost,
    markup_percent: 50,
    margin_target_percent: 25,
    target_price: product.price_current || 0,
    tax_burden_percent: 12,
    gateway_percent: 2,
    marketplace_percent: 0,
    sales_commission_percent: 3,
    admin_fixed_fee: 0,
  });

  // Configuração de arredondamento
  const [rounding, setRounding] = useState<RoundingConfig>({
    rounding: 'psychological',
    rounding_decimals: 2,
    rounding_ending: ',99'
  });

  // Resultado do cálculo
  const [result, setResult] = useState<PricingResult | null>(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [inputs, mode, rounding]);

  useEffect(() => {
    if (selectedChannelId && channels.length > 0) {
      const channel = channels.find(c => c.id === selectedChannelId);
      if (channel) {
        setInputs(prev => ({
          ...prev,
          gateway_percent: channel.gateway_percent,
          marketplace_percent: channel.marketplace_percent,
          sales_commission_percent: channel.sales_commission_percent,
          admin_fixed_fee: channel.admin_fixed_fee,
          tax_burden_percent: channel.tax_burden_percent,
        }));
      }
    }
  }, [selectedChannelId, channels]);

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const formattedChannels = data?.map(channel => ({
        id: channel.id,
        name: channel.name,
        gateway_percent: Number(channel.gateway_percent || 0),
        marketplace_percent: Number(channel.marketplace_percent || 0),
        sales_commission_percent: Number(channel.sales_commission_percent || 0),
        admin_fixed_fee: Number(channel.admin_fixed_fee || 0),
        tax_burden_percent: Number(channel.tax_burden_percent || 0),
      })) || [];

      setChannels(formattedChannels);
      
      if (formattedChannels.length > 0) {
        setSelectedChannelId(formattedChannels[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar canais:', error);
    }
  };

  const calculatePrice = () => {
    try {
      const calculation = calculatePricing(inputs, mode, rounding);
      setResult(calculation);
    } catch (error) {
      console.error('Erro no cálculo:', error);
    }
  };

  const updateInput = (field: keyof PricingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const savePrice = async () => {
    if (!result?.price_suggested) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update({
          price_suggested: result.price_suggested,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Preço sugerido salvo: R$ ${result.price_suggested.toFixed(2)}`,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar preço sugerido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyCurrentPrice = async () => {
    if (!result?.price_suggested) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update({
          price_current: result.price_suggested,
          price_suggested: result.price_suggested,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Preço atual atualizado: R$ ${result.price_suggested.toFixed(2)}`,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao aplicar preço:', error);
      toast({
        title: "Erro",
        description: "Erro ao aplicar preço atual",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com informações do produto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            SKU: {product.sku} | Custo base: R$ {product.cost_base.toFixed(2)}
          </p>
        </CardHeader>
      </Card>

      {/* Seleção de Canal */}
      <Card>
        <CardHeader>
          <CardTitle>Canal de Venda</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o canal" />
            </SelectTrigger>
            <SelectContent>
              {channels.map(channel => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabs para diferentes modos de cálculo */}
      <Tabs value={mode.mode} onValueChange={(value) => setMode({ mode: value as any })}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="markup">Markup</TabsTrigger>
          <TabsTrigger value="margin">Margem</TabsTrigger>
          <TabsTrigger value="target_price">Preço Alvo</TabsTrigger>
        </TabsList>

        <TabsContent value="markup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cálculo por Markup</CardTitle>
              <p className="text-sm text-muted-foreground">
                Define o percentual de lucro sobre o custo
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Markup (%)</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <Slider
                      value={[inputs.markup_percent || 0]}
                      onValueChange={([value]) => updateInput('markup_percent', value)}
                      max={200}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={inputs.markup_percent || 0}
                      onChange={(e) => updateInput('markup_percent', Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="margin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cálculo por Margem</CardTitle>
              <p className="text-sm text-muted-foreground">
                Define o percentual de lucro sobre o preço de venda
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Margem Desejada (%)</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <Slider
                      value={[inputs.margin_target_percent || 0]}
                      onValueChange={([value]) => updateInput('margin_target_percent', value)}
                      max={80}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={inputs.margin_target_percent || 0}
                      onChange={(e) => updateInput('margin_target_percent', Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="target_price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preço Alvo</CardTitle>
              <p className="text-sm text-muted-foreground">
                Insira o preço desejado para calcular a margem resultante
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Preço Alvo (R$)</Label>
                  <Input
                    type="number"
                    value={inputs.target_price || 0}
                    onChange={(e) => updateInput('target_price', Number(e.target.value))}
                    step="0.01"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configurações de Impostos e Taxas */}
      <Card>
        <CardHeader>
          <CardTitle>Impostos e Taxas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Carga Tributária (%)</Label>
              <Input
                type="number"
                value={inputs.tax_burden_percent || 0}
                onChange={(e) => updateInput('tax_burden_percent', Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div>
              <Label>Gateway (%)</Label>
              <Input
                type="number"
                value={inputs.gateway_percent || 0}
                onChange={(e) => updateInput('gateway_percent', Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div>
              <Label>Marketplace (%)</Label>
              <Input
                type="number"
                value={inputs.marketplace_percent || 0}
                onChange={(e) => updateInput('marketplace_percent', Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div>
              <Label>Comissão Vendedor (%)</Label>
              <Input
                type="number"
                value={inputs.sales_commission_percent || 0}
                onChange={(e) => updateInput('sales_commission_percent', Number(e.target.value))}
                step="0.1"
              />
            </div>
          </div>
          
          <div>
            <Label>Taxa Administrativa Fixa (R$)</Label>
            <Input
              type="number"
              value={inputs.admin_fixed_fee || 0}
              onChange={(e) => updateInput('admin_fixed_fee', Number(e.target.value))}
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>

      {/* Arredondamento */}
      <Card>
        <CardHeader>
          <CardTitle>Arredondamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select 
                value={rounding.rounding} 
                onValueChange={(value: any) => setRounding(prev => ({ ...prev, rounding: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem arredondamento</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="psychological">Psicológico (,99)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rounding.rounding === 'psychological' && (
              <div>
                <Label>Terminação</Label>
                <Select 
                  value={rounding.rounding_ending} 
                  onValueChange={(value) => setRounding(prev => ({ ...prev, rounding_ending: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",99">,99</SelectItem>
                    <SelectItem value=",95">,95</SelectItem>
                    <SelectItem value=",90">,90</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultado */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resultado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Métricas principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">R$ {result.price_suggested.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Preço Sugerido</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Percent className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{result.margin_percent.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Margem</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{result.markup_percent.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Markup</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">R$ {result.profit_amount.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Lucro</div>
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{warning}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhamento do Cálculo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.breakdown.steps.map((step, index) => (
                    <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                      {step}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botões de ação */}
            <div className="flex gap-2 pt-4">
              <Button onClick={savePrice} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar como Sugerido
              </Button>
              <Button onClick={applyCurrentPrice} variant="default" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Aplicar como Preço Atual
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}