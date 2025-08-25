import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, TrendingDown, Users } from "lucide-react";

export function DefaultRiskDashboard() {
  // TODO: Integrar com dados reais de IA
  const riskData = [
    {
      customer: "João Silva",
      document: "123.456.789-00",
      score: 85,
      level: "high" as const,
      factors: ["Histórico de atrasos", "3 parcelas em aberto"],
      lastPayment: "15 dias atrás",
      recommendation: "Contato proativo recomendado"
    },
    {
      customer: "Maria Santos", 
      document: "987.654.321-00",
      score: 45,
      level: "medium" as const,
      factors: ["Atraso ocasional", "Boa capacidade de pagamento"],
      lastPayment: "7 dias atrás",
      recommendation: "Monitoramento padrão"
    },
    {
      customer: "Tech Solutions",
      document: "12.345.678/0001-90",
      score: 92,
      level: "critical" as const,
      factors: ["Múltiplos atrasos", "Valor alto em aberto"],
      lastPayment: "30 dias atrás",
      recommendation: "Ação imediata necessária"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "default";
      case "medium": return "secondary"; 
      case "high": return "destructive";
      case "critical": return "destructive";
      default: return "secondary";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "low": return "Baixo";
      case "medium": return "Médio";
      case "high": return "Alto";
      case "critical": return "Crítico";
      default: return level;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* KPIs de Risco */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risco Crítico</p>
                <p className="text-2xl font-bold text-red-600">8</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risco Alto</p>
                <p className="text-2xl font-bold text-orange-600">15</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risco Médio</p>
                <p className="text-2xl font-bold text-yellow-600">23</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes com Risco */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Risco de Inadimplência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskData.map((customer, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{customer.customer}</h4>
                    <p className="text-sm text-muted-foreground">{customer.document}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(customer.score)}`}>
                      {customer.score}
                    </div>
                    <Badge variant={getRiskColor(customer.level)}>
                      {getRiskLabel(customer.level)}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Score de Risco</span>
                    <span>{customer.score}/100</span>
                  </div>
                  <Progress value={customer.score} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Fatores de Risco:</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {customer.factors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Último Pagamento:</p>
                    <p className="text-muted-foreground">{customer.lastPayment}</p>
                  </div>
                  <div>
                    <p className="font-medium">Recomendação:</p>
                    <p className="text-muted-foreground">{customer.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}