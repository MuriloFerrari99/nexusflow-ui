import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Edit, Mail, Phone, MapPin, Calendar, Building, User, Users, DollarSign, AlertTriangle } from "lucide-react";

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  cpf?: string | null;
  birth_date?: string | null;
  address?: string | null;
  cargo?: string | null;
  hire_date?: string | null;
  salary?: number | null;
  employee_status: 'ativo' | 'inativo' | 'demitido' | 'afastado' | 'ferias' | null;
  created_at: string | null;
}

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
  onEdit: () => void;
}

export function EmployeeDetails({ employee, onClose, onEdit }: EmployeeDetailsProps) {
  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>;
    
    const variants = {
      'ativo': 'default',
      'inativo': 'secondary', 
      'demitido': 'destructive',
      'afastado': 'outline',
      'ferias': 'outline'
    } as const;

    const labels = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'demitido': 'Demitido',
      'afastado': 'Afastado',
      'ferias': 'Férias'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "Não informado";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateYearsOfService = (hireDate?: string) => {
    if (!hireDate) return "N/A";
    const hire = new Date(hireDate);
    const now = new Date();
    const years = now.getFullYear() - hire.getFullYear();
    const months = now.getMonth() - hire.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < hire.getDate())) {
      return years - 1 === 0 ? "Menos de 1 ano" : `${years - 1} anos`;
    }
    return years === 0 ? "Menos de 1 ano" : `${years} anos`;
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl">
            Detalhes do Funcionário
          </DialogTitle>
          <Button onClick={onEdit} size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </DialogHeader>

      {/* Header do funcionário */}
      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{employee.full_name}</h2>
          <p className="text-muted-foreground">{employee.cargo || "Cargo não informado"}</p>
          <div className="flex items-center gap-4 mt-2">
            {getStatusBadge(employee.employee_status)}
          </div>
        </div>
      </div>

      {/* Informações de Contato */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Informações de Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Email:</span>
            <p className="text-muted-foreground">{employee.email}</p>
          </div>
          <div>
            <span className="font-medium">Telefone:</span>
            <p className="text-muted-foreground">{employee.phone || "Não informado"}</p>
          </div>
        </div>
        {employee.address && (
          <div>
            <span className="font-medium">Endereço:</span>
            <p className="text-muted-foreground">{employee.address}</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Dados Pessoais */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <User className="w-5 h-5" />
          Dados Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">CPF:</span>
            <p className="text-muted-foreground">{employee.cpf || "Não informado"}</p>
          </div>
          <div>
            <span className="font-medium">RG:</span>
            <p className="text-muted-foreground">{"Não informado"}</p>
          </div>
          <div>
            <span className="font-medium">Data de Nascimento:</span>
            <p className="text-muted-foreground">{formatDate(employee.birth_date)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Informações Profissionais */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Building className="w-5 h-5" />
          Informações Profissionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Data de Admissão:</span>
            <p className="text-muted-foreground">{formatDate(employee.hire_date)}</p>
          </div>
          <div>
            <span className="font-medium">Tempo de Empresa:</span>
            <p className="text-muted-foreground">{calculateYearsOfService(employee.hire_date)}</p>
          </div>
          <div>
            <span className="font-medium">Salário:</span>
            <p className="text-muted-foreground">{formatCurrency(employee.salary)}</p>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <div className="mt-1">{getStatusBadge(employee.employee_status)}</div>
          </div>
        </div>
      </div>

      <Separator />


      {/* Informações do Sistema */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Informações do Sistema</h3>
        <div className="text-sm">
          <span className="font-medium">Cadastrado em:</span>
          <p className="text-muted-foreground">{formatDate(employee.created_at)}</p>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Editar Funcionário
        </Button>
      </div>
    </div>
  );
}