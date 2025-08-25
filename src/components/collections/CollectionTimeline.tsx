import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, MessageSquare, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";

export function CollectionTimeline() {
  // TODO: Integrar com dados reais do Supabase
  const timelineEvents = [
    {
      id: "1",
      type: "collection_sent",
      title: "Cobrança enviada via PIX",
      description: "Link de pagamento gerado para João Silva",
      timestamp: new Date("2024-08-21T10:30:00"),
      user: "Sistema",
      automated: true,
      status: "success",
      icon: CreditCard,
      amount: "R$ 1.250,00"
    },
    {
      id: "2",
      type: "email_reminder",
      title: "Lembrete por email enviado",
      description: "Email de cobrança enviado para maria@email.com",
      timestamp: new Date("2024-08-20T14:15:00"),
      user: "Ana Costa",
      automated: false,
      status: "success",
      icon: Mail
    },
    {
      id: "3",
      type: "sms_reminder",
      title: "SMS de cobrança enviado",
      description: "Mensagem enviada para (11) 99999-9999",
      timestamp: new Date("2024-08-19T09:00:00"),
      user: "Sistema",
      automated: true,
      status: "delivered",
      icon: MessageSquare
    },
    {
      id: "4",
      type: "payment_received",
      title: "Pagamento confirmado",
      description: "PIX recebido de Maria Santos",
      timestamp: new Date("2024-08-18T16:45:00"),
      user: "Sistema",
      automated: true,
      status: "success",
      icon: CheckCircle,
      amount: "R$ 850,00"
    },
    {
      id: "5",
      type: "collection_failed",
      title: "Cobrança não entregue",
      description: "Email retornado - endereço inválido",
      timestamp: new Date("2024-08-17T11:20:00"),
      user: "Sistema",
      automated: true,
      status: "error",
      icon: XCircle
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "default";
      case "delivered": return "secondary";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  const getEventIcon = (type: string, IconComponent: any) => {
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline de Cobranças</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  {getEventIcon(event.type, event.icon)}
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className="w-px h-8 bg-border mt-2" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    {event.amount && (
                      <p className="text-sm font-mono text-primary mt-1">{event.amount}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(event.status)} className="text-xs">
                      {event.automated ? "Automático" : "Manual"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(event.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  <span>•</span>
                  <span>{event.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button className="text-sm text-primary hover:underline">
            Ver mais eventos
          </button>
        </div>
      </CardContent>
    </Card>
  );
}