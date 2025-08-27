import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand?: string;
  cost_base: number;
  freight_unit_cost: number;
  packaging_unit_cost: number;
  other_variable_cost: number;
  price_current?: number;
  price_suggested?: number;
  status: 'active' | 'inactive';
  current_stock: number;
  unit: string;
  ean?: string;
  ncm?: string;
}

interface Props {
  product?: Product | null;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    category: product?.category || '',
    brand: product?.brand || '',
    unit: product?.unit || 'UN',
    ean: product?.ean || '',
    ncm: product?.ncm || '',
    cost_base: product?.cost_base || 0,
    freight_unit_cost: product?.freight_unit_cost || 0,
    packaging_unit_cost: product?.packaging_unit_cost || 0,
    other_variable_cost: product?.other_variable_cost || 0,
    price_current: product?.price_current || 0,
    price_suggested: product?.price_suggested || 0,
    status: product?.status || 'active',
    current_stock: product?.current_stock || 0,
    description: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Obter company_id do perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('Usuário não associado a uma empresa');
      }

      const productData = {
        company_id: profile.company_id,
        sku: formData.sku,
        name: formData.name,
        category: formData.category,
        brand: formData.brand || null,
        unit: formData.unit,
        ean: formData.ean || null,
        ncm: formData.ncm || null,
        cost_base: formData.cost_base,
        freight_unit_cost: formData.freight_unit_cost,
        packaging_unit_cost: formData.packaging_unit_cost,
        other_variable_cost: formData.other_variable_cost,
        price_current: formData.price_current || null,
        price_suggested: formData.price_suggested || null,
        status: formData.status,
        current_stock: formData.current_stock,
        description: formData.description,
        updated_at: new Date().toISOString(),
      };

      if (product) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso",
        });
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso",
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar produto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                placeholder="Ex: TSH-001"
              />
            </div>
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Camiseta Básica"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="Ex: Vestuário"
              />
            </div>
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => updateField('brand', e.target.value)}
                placeholder="Ex: Nike"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select value={formData.unit} onValueChange={(value) => updateField('unit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UN">Unidade (UN)</SelectItem>
                  <SelectItem value="CX">Caixa (CX)</SelectItem>
                  <SelectItem value="KG">Quilograma (KG)</SelectItem>
                  <SelectItem value="LT">Litro (LT)</SelectItem>
                  <SelectItem value="MT">Metro (MT)</SelectItem>
                  <SelectItem value="M2">Metro² (M²)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ean">EAN/GTIN</Label>
              <Input
                id="ean"
                value={formData.ean}
                onChange={(e) => updateField('ean', e.target.value)}
                placeholder="Código de barras"
              />
            </div>
            <div>
              <Label htmlFor="ncm">NCM</Label>
              <Input
                id="ncm"
                value={formData.ncm}
                onChange={(e) => updateField('ncm', e.target.value)}
                placeholder="Ex: 6109.10.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descrição detalhada do produto"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custos */}
      <Card>
        <CardHeader>
          <CardTitle>Estrutura de Custos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost_base">Custo Base (R$)</Label>
              <Input
                id="cost_base"
                type="number"
                step="0.01"
                value={formData.cost_base}
                onChange={(e) => updateField('cost_base', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="freight_unit_cost">Frete Unitário (R$)</Label>
              <Input
                id="freight_unit_cost"
                type="number"
                step="0.01"
                value={formData.freight_unit_cost}
                onChange={(e) => updateField('freight_unit_cost', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="packaging_unit_cost">Embalagem Unitária (R$)</Label>
              <Input
                id="packaging_unit_cost"
                type="number"
                step="0.01"
                value={formData.packaging_unit_cost}
                onChange={(e) => updateField('packaging_unit_cost', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="other_variable_cost">Outros Custos Variáveis (R$)</Label>
              <Input
                id="other_variable_cost"
                type="number"
                step="0.01"
                value={formData.other_variable_cost}
                onChange={(e) => updateField('other_variable_cost', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium">Custo Total</div>
            <div className="text-2xl font-bold">
              R$ {(formData.cost_base + formData.freight_unit_cost + formData.packaging_unit_cost + formData.other_variable_cost).toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preços e Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Preços e Estoque</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_current">Preço Atual (R$)</Label>
              <Input
                id="price_current"
                type="number"
                step="0.01"
                value={formData.price_current}
                onChange={(e) => updateField('price_current', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="price_suggested">Preço Sugerido (R$)</Label>
              <Input
                id="price_suggested"
                type="number"
                step="0.01"
                value={formData.price_suggested}
                onChange={(e) => updateField('price_suggested', Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_stock">Estoque Atual</Label>
              <Input
                id="current_stock"
                type="number"
                value={formData.current_stock}
                onChange={(e) => updateField('current_stock', Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : (product ? "Atualizar" : "Criar")} Produto
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}