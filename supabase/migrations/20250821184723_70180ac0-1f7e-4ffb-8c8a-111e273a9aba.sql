-- Criar enum para tipos de cargo
CREATE TYPE public.job_type AS ENUM ('clt', 'pj', 'freelancer', 'estagiario', 'terceirizado');

-- Criar enum para tipos de benefício
CREATE TYPE public.benefit_type AS ENUM ('vale_refeicao', 'vale_transporte', 'plano_saude', 'plano_odontologico', 'vale_alimentacao', 'outro');

-- Criar enum para tipos de desconto
CREATE TYPE public.deduction_type AS ENUM ('inss', 'irrf', 'fgts', 'vale_refeicao', 'vale_transporte', 'plano_saude', 'outro');

-- Criar enum para status de funcionário
CREATE TYPE public.employee_status AS ENUM ('ativo', 'inativo', 'demitido', 'afastado', 'ferias');

-- Criar tabela de departamentos
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cargos
CREATE TABLE public.job_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  title TEXT NOT NULL,
  description TEXT,
  salary_min NUMERIC(10,2),
  salary_max NUMERIC(10,2),
  job_type public.job_type NOT NULL DEFAULT 'clt',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Estender tabela de profiles para funcionários
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_position_id UUID REFERENCES public.job_positions(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS termination_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salary NUMERIC(10,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_status public.employee_status DEFAULT 'ativo';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT;

-- Criar tabela de registro de ponto
CREATE TABLE public.time_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.profiles(id),
  date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  break_start TIME,
  break_end TIME,
  overtime_hours NUMERIC(4,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de folha de pagamento
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.profiles(id),
  reference_month INTEGER NOT NULL,
  reference_year INTEGER NOT NULL,
  base_salary NUMERIC(10,2) NOT NULL,
  overtime_amount NUMERIC(10,2) DEFAULT 0,
  bonus_amount NUMERIC(10,2) DEFAULT 0,
  total_benefits NUMERIC(10,2) DEFAULT 0,
  total_deductions NUMERIC(10,2) DEFAULT 0,
  gross_salary NUMERIC(10,2) NOT NULL,
  net_salary NUMERIC(10,2) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, employee_id, reference_month, reference_year)
);

-- Criar tabela de benefícios
CREATE TABLE public.employee_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.profiles(id),
  payroll_id UUID REFERENCES public.payroll(id),
  benefit_type public.benefit_type NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de descontos
CREATE TABLE public.employee_deductions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  employee_id UUID NOT NULL REFERENCES public.profiles(id),
  payroll_id UUID REFERENCES public.payroll(id),
  deduction_type public.deduction_type NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de contracheques
CREATE TABLE public.payslips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_id UUID NOT NULL REFERENCES public.payroll(id),
  employee_id UUID NOT NULL REFERENCES public.profiles(id),
  company_id UUID NOT NULL,
  pdf_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para departments
CREATE POLICY "Users can manage company departments" ON public.departments
FOR ALL USING (company_id = get_user_company_id());

-- Criar políticas RLS para job_positions
CREATE POLICY "Users can manage company job positions" ON public.job_positions
FOR ALL USING (company_id = get_user_company_id());

-- Criar políticas RLS para time_tracking
CREATE POLICY "Users can manage company time tracking" ON public.time_tracking
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Employees can view their own time tracking" ON public.time_tracking
FOR SELECT USING (employee_id = auth.uid());

-- Criar políticas RLS para payroll
CREATE POLICY "HR can manage company payroll" ON public.payroll
FOR ALL USING (company_id = get_user_company_id() AND is_company_admin());

CREATE POLICY "Employees can view their own payroll" ON public.payroll
FOR SELECT USING (employee_id = auth.uid());

-- Criar políticas RLS para employee_benefits
CREATE POLICY "HR can manage company benefits" ON public.employee_benefits
FOR ALL USING (company_id = get_user_company_id() AND is_company_admin());

CREATE POLICY "Employees can view their own benefits" ON public.employee_benefits
FOR SELECT USING (employee_id = auth.uid());

-- Criar políticas RLS para employee_deductions
CREATE POLICY "HR can manage company deductions" ON public.employee_deductions
FOR ALL USING (company_id = get_user_company_id() AND is_company_admin());

CREATE POLICY "Employees can view their own deductions" ON public.employee_deductions
FOR SELECT USING (employee_id = auth.uid());

-- Criar políticas RLS para payslips
CREATE POLICY "HR can manage company payslips" ON public.payslips
FOR ALL USING (company_id = get_user_company_id() AND is_company_admin());

CREATE POLICY "Employees can view their own payslips" ON public.payslips
FOR SELECT USING (employee_id = auth.uid());

-- Criar triggers para atualizar timestamps
CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON public.departments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_positions_updated_at
BEFORE UPDATE ON public.job_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_tracking_updated_at
BEFORE UPDATE ON public.time_tracking
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at
BEFORE UPDATE ON public.payroll
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para calcular folha de pagamento
CREATE OR REPLACE FUNCTION public.calculate_payroll(
  p_employee_id UUID,
  p_company_id UUID,
  p_month INTEGER,
  p_year INTEGER
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_payroll_id UUID;
  v_base_salary NUMERIC(10,2);
  v_overtime_amount NUMERIC(10,2) := 0;
  v_total_benefits NUMERIC(10,2) := 0;
  v_total_deductions NUMERIC(10,2) := 0;
  v_gross_salary NUMERIC(10,2);
  v_net_salary NUMERIC(10,2);
  v_inss_rate NUMERIC(4,2);
  v_inss_amount NUMERIC(10,2);
BEGIN
  -- Buscar salário base do funcionário
  SELECT salary INTO v_base_salary
  FROM profiles
  WHERE id = p_employee_id AND company_id = p_company_id;

  IF v_base_salary IS NULL THEN
    RAISE EXCEPTION 'Funcionário não encontrado ou salário não definido';
  END IF;

  -- Calcular horas extras (simplificado - 50% sobre valor hora)
  SELECT COALESCE(SUM(overtime_hours), 0) * (v_base_salary / 220) * 1.5
  INTO v_overtime_amount
  FROM time_tracking
  WHERE employee_id = p_employee_id
    AND company_id = p_company_id
    AND EXTRACT(MONTH FROM date) = p_month
    AND EXTRACT(YEAR FROM date) = p_year;

  -- Calcular benefícios
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_benefits
  FROM employee_benefits
  WHERE employee_id = p_employee_id
    AND company_id = p_company_id
    AND payroll_id IS NULL;

  -- Calcular salário bruto
  v_gross_salary := v_base_salary + v_overtime_amount + v_total_benefits;

  -- Calcular INSS (simplificado)
  IF v_gross_salary <= 1412.00 THEN
    v_inss_rate := 7.5;
  ELSIF v_gross_salary <= 2666.68 THEN
    v_inss_rate := 9.0;
  ELSIF v_gross_salary <= 4000.03 THEN
    v_inss_rate := 12.0;
  ELSE
    v_inss_rate := 14.0;
  END IF;

  v_inss_amount := v_gross_salary * (v_inss_rate / 100);

  -- Calcular total de descontos
  SELECT COALESCE(SUM(amount), 0) + v_inss_amount
  INTO v_total_deductions
  FROM employee_deductions
  WHERE employee_id = p_employee_id
    AND company_id = p_company_id
    AND payroll_id IS NULL;

  -- Adicionar desconto INSS automático
  INSERT INTO employee_deductions (
    company_id, employee_id, deduction_type, description, amount
  ) VALUES (
    p_company_id, p_employee_id, 'inss', 'INSS - ' || v_inss_rate || '%', v_inss_amount
  );

  -- Calcular salário líquido
  v_net_salary := v_gross_salary - v_total_deductions;

  -- Criar registro de folha
  INSERT INTO payroll (
    company_id, employee_id, reference_month, reference_year,
    base_salary, overtime_amount, total_benefits, total_deductions,
    gross_salary, net_salary, processed_at, processed_by
  ) VALUES (
    p_company_id, p_employee_id, p_month, p_year,
    v_base_salary, v_overtime_amount, v_total_benefits, v_total_deductions,
    v_gross_salary, v_net_salary, now(), auth.uid()
  ) RETURNING id INTO v_payroll_id;

  -- Atualizar referências de benefícios e descontos
  UPDATE employee_benefits
  SET payroll_id = v_payroll_id
  WHERE employee_id = p_employee_id
    AND company_id = p_company_id
    AND payroll_id IS NULL;

  UPDATE employee_deductions
  SET payroll_id = v_payroll_id
  WHERE employee_id = p_employee_id
    AND company_id = p_company_id
    AND payroll_id IS NULL;

  RETURN v_payroll_id;
END;
$$;