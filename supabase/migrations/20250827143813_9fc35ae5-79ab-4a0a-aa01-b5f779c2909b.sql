-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  unit TEXT DEFAULT 'UN',
  ean TEXT,
  ncm TEXT,
  cost_base NUMERIC(10,2) NOT NULL DEFAULT 0,
  freight_unit_cost NUMERIC(10,2) DEFAULT 0,
  packaging_unit_cost NUMERIC(10,2) DEFAULT 0,
  other_variable_cost NUMERIC(10,2) DEFAULT 0,
  price_current NUMERIC(10,2),
  price_suggested NUMERIC(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  stock_qty NUMERIC(10,2) DEFAULT 0,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, sku)
);

-- Criar tabela de regras de preço
CREATE TABLE public.product_pricing_rules (
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
CREATE TABLE public.price_history (
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
CREATE TABLE public.channels (
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
CREATE TABLE public.product_approvals (
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

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_approvals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para products
CREATE POLICY "Users can manage company products" ON public.products
  FOR ALL USING (company_id = get_user_company_id());

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

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON public.product_pricing_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON public.channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_product_approvals_updated_at
  BEFORE UPDATE ON public.product_approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger para registrar histórico de preços
CREATE OR REPLACE FUNCTION public.log_price_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.price_current IS DISTINCT FROM NEW.price_current THEN
    INSERT INTO public.price_history (
      company_id, product_id, old_price, new_price, reason, changed_by
    ) VALUES (
      NEW.company_id, NEW.id, OLD.price_current, NEW.price_current, 
      'Price updated', NEW.updated_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_product_price_changes
  AFTER UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.log_price_changes();

-- Inserir canal padrão para demonstração
INSERT INTO public.channels (company_id, name, gateway_percent, marketplace_percent, sales_commission_percent, tax_burden_percent)
SELECT company_id, 'Loja Física', 2.0, 0.0, 3.0, 12.0
FROM public.profiles 
WHERE company_id IS NOT NULL
GROUP BY company_id;

-- Inserir produtos de exemplo
INSERT INTO public.products (company_id, sku, name, category, brand, cost_base, freight_unit_cost, packaging_unit_cost, price_current, stock_qty, created_by)
SELECT 
  p.company_id,
  'TSH-001',
  'Camiseta Básica',
  'Vestuário',
  'BasicWear',
  20.00,
  2.00,
  0.50,
  49.90,
  120,
  p.id
FROM public.profiles p 
WHERE p.company_id IS NOT NULL
GROUP BY p.company_id, p.id;

INSERT INTO public.products (company_id, sku, name, category, brand, cost_base, freight_unit_cost, packaging_unit_cost, price_current, stock_qty, created_by)
SELECT 
  p.company_id,
  'SHO-009',
  'Tênis Urban',
  'Calçados',
  'UrbanStyle',
  110.00,
  6.00,
  1.50,
  299.90,
  45,
  p.id
FROM public.profiles p 
WHERE p.company_id IS NOT NULL
GROUP BY p.company_id, p.id;