-- Adicionar campos que faltam na tabela products existente
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS ean TEXT,
ADD COLUMN IF NOT EXISTS ncm TEXT,
ADD COLUMN IF NOT EXISTS freight_unit_cost NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS packaging_unit_cost NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_variable_cost NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_current NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS price_suggested NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS updated_by UUID;

-- Renomear campos para padronizar
ALTER TABLE public.products 
RENAME COLUMN base_price TO cost_base;

-- Criar tabela de regras de preço
CREATE TABLE IF NOT EXISTS public.product_pricing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  channel TEXT DEFAULT 'default',
  mode TEXT CHECK (mode IN ('markup', 'margin', 'target_price')),
  markup_percent NUMERIC(5,2),
  margin_target_percent NUMERIC(5,2),
  target_price NUMERIC(10,2),
  rounding TEXT DEFAULT 'psychological' CHECK (rounding IN ('none', 'normal', 'psychological')),
  rounding_decimals INTEGER DEFAULT 2,
  rounding_ending TEXT DEFAULT ',99',
  -- Impostos
  icms_percent NUMERIC(5,2) DEFAULT 0,
  pis_percent NUMERIC(5,2) DEFAULT 0,
  cofins_percent NUMERIC(5,2) DEFAULT 0,
  iss_percent NUMERIC(5,2) DEFAULT 0,
  tax_burden_percent NUMERIC(5,2) DEFAULT 0,
  -- Taxas
  gateway_percent NUMERIC(5,2) DEFAULT 0,
  marketplace_percent NUMERIC(5,2) DEFAULT 0,
  sales_commission_percent NUMERIC(5,2) DEFAULT 0,
  admin_fixed_fee NUMERIC(10,2) DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico de preços
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  channel TEXT DEFAULT 'default',
  old_price NUMERIC(10,2),
  new_price NUMERIC(10,2),
  reason TEXT,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de canais
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  gateway_percent NUMERIC(5,2) DEFAULT 0,
  marketplace_percent NUMERIC(5,2) DEFAULT 0,
  sales_commission_percent NUMERIC(5,2) DEFAULT 0,
  admin_fixed_fee NUMERIC(10,2) DEFAULT 0,
  icms_percent NUMERIC(5,2) DEFAULT 0,
  pis_percent NUMERIC(5,2) DEFAULT 0,
  cofins_percent NUMERIC(5,2) DEFAULT 0,
  iss_percent NUMERIC(5,2) DEFAULT 0,
  tax_burden_percent NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, name)
);

-- Criar tabela de aprovações
CREATE TABLE IF NOT EXISTS public.product_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  proposed_price NUMERIC(10,2) NOT NULL,
  proposed_by UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  decision_by UUID,
  decision_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.product_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_approvals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para product_pricing_rules
CREATE POLICY "Users can manage company pricing rules" ON public.product_pricing_rules
  FOR ALL USING (company_id = get_user_company_id());

-- Políticas RLS para price_history
CREATE POLICY "Users can view company price history" ON public.price_history
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "System can create price history" ON public.price_history
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- Políticas RLS para channels
CREATE POLICY "Users can manage company channels" ON public.channels
  FOR ALL USING (company_id = get_user_company_id());

-- Políticas RLS para product_approvals
CREATE POLICY "Users can manage company product approvals" ON public.product_approvals
  FOR ALL USING (company_id = get_user_company_id());