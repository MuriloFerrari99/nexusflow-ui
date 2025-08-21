import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockDashboard } from "@/components/stock/StockDashboard";
import { ProductManager } from "@/components/stock/ProductManager";
import { SupplierManager } from "@/components/stock/SupplierManager";
import { PurchaseOrderManager } from "@/components/stock/PurchaseOrderManager";
import { StockMovements } from "@/components/stock/StockMovements";
import { BarcodeSimulator } from "@/components/stock/BarcodeSimulator";

const Estoque = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Gestão de Estoque
            </h1>
            <p className="text-muted-foreground">
              Controle completo do seu estoque e cadeia de suprimentos
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
              <TabsTrigger value="purchase-orders">Pedidos</TabsTrigger>
              <TabsTrigger value="movements">Movimentações</TabsTrigger>
              <TabsTrigger value="barcode">Código de Barras</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <StockDashboard />
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <ProductManager />
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              <SupplierManager />
            </TabsContent>

            <TabsContent value="purchase-orders" className="space-y-4">
              <PurchaseOrderManager />
            </TabsContent>

            <TabsContent value="movements" className="space-y-4">
              <StockMovements />
            </TabsContent>

            <TabsContent value="barcode" className="space-y-4">
              <BarcodeSimulator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Estoque;