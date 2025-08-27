import { Layout } from "@/components/layout/Layout";
import { ProductList } from "@/components/products/ProductList";

export default function Produtos() {
  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos e calcule preços com markup e margem
          </p>
        </div>
        
        <ProductList />
      </div>
    </Layout>
  );
}