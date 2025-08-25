import { Layout } from "@/components/layout/Layout";
import { CollectionDashboard } from "@/components/collections/CollectionDashboard";

export default function Cobrancas() {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Cobranças</h1>
          <p className="text-muted-foreground">
            Gerencie contas a receber e reduza a inadimplência
          </p>
        </div>
        <CollectionDashboard />
      </div>
    </Layout>
  );
}