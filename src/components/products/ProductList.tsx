import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Calculator, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "./ProductForm";
import { PricingCalculator } from "./PricingCalculator";

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

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPricingCalc, setShowPricingCalc] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForPricing, setSelectedProductForPricing] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedProducts = data?.map(product => ({
        id: product.id,
        sku: product.sku || '',
        name: product.name,
        category: product.category || 'Sem categoria',
        brand: product.brand,
        cost_base: Number(product.cost_base || 0),
        freight_unit_cost: Number(product.freight_unit_cost || 0),
        packaging_unit_cost: Number(product.packaging_unit_cost || 0),
        other_variable_cost: Number(product.other_variable_cost || 0),
        price_current: product.price_current ? Number(product.price_current) : undefined,
        price_suggested: product.price_suggested ? Number(product.price_suggested) : undefined,
        status: (product.status as 'active' | 'inactive') || 'active',
        current_stock: Number(product.current_stock || 0),
        unit: product.unit || 'UN',
        ean: product.ean,
        ncm: product.ncm,
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  };

  const getTotalCost = (product: Product) => {
    return product.cost_base + product.freight_unit_cost + product.packaging_unit_cost + product.other_variable_cost;
  };

  const getMarginPercent = (product: Product) => {
    if (!product.price_current) return null;
    const totalCost = getTotalCost(product);
    const profit = product.price_current - totalCost;
    return totalCost > 0 ? (profit / product.price_current) * 100 : 0;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sem estoque", variant: "destructive" as const };
    if (stock < 10) return { label: "Estoque baixo", variant: "secondary" as const };
    return { label: "Em estoque", variant: "default" as const };
  };

  const categories = [...new Set(products.map(p => p.category))];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handlePricing = (product: Product) => {
    setSelectedProductForPricing(product);
    setShowPricingCalc(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleClosePricingCalc = () => {
    setShowPricingCalc(false);
    setSelectedProductForPricing(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catálogo de Produtos</CardTitle>
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, SKU ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Custo Total</TableHead>
                  <TableHead className="text-right">Preço Atual</TableHead>
                  <TableHead className="text-right">Margem</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const totalCost = getTotalCost(product);
                    const marginPercent = getMarginPercent(product);
                    const stockStatus = getStockStatus(product.current_stock);

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-mono text-sm">
                          {product.sku || '-'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.brand && (
                              <div className="text-sm text-muted-foreground">{product.brand}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          R$ {totalCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.price_current ? `R$ ${product.price_current.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {marginPercent !== null ? (
                            <Badge variant={marginPercent < 10 ? "destructive" : marginPercent < 20 ? "secondary" : "default"}>
                              {marginPercent.toFixed(1)}%
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{product.current_stock} {product.unit}</span>
                            <Badge variant={stockStatus.variant} className="text-xs w-fit">
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === 'active' ? "default" : "secondary"}>
                            {product.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePricing(product)}>
                                <Calculator className="mr-2 h-4 w-4" />
                                Calcular Preço
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Histórico
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredProducts.length} de {products.length} produtos
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Drawer */}
      <Drawer open={showProductForm} onOpenChange={setShowProductForm}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onClose={handleCloseProductForm}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Pricing Calculator Drawer */}
      <Drawer open={showPricingCalc} onOpenChange={setShowPricingCalc}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>
              Calculadora de Preços - {selectedProductForPricing?.name}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            {selectedProductForPricing && (
              <PricingCalculator
                product={selectedProductForPricing}
                onClose={handleClosePricingCalc}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}