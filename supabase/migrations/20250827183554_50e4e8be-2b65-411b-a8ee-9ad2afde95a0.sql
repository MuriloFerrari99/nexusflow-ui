-- Create fiscal module tables for Brazilian ERP

-- Companies fiscal configuration
CREATE TABLE public.fiscal_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  ie TEXT,
  im TEXT,
  cnae_principal TEXT,
  crt INTEGER NOT NULL DEFAULT 1, -- 1=SN, 2=Lucro Presumido, 3=Lucro Real
  address_logradouro TEXT,
  address_numero TEXT,
  address_complemento TEXT,
  address_bairro TEXT,
  address_municipio_codigo TEXT,
  address_municipio_nome TEXT,
  address_uf TEXT,
  address_cep TEXT,
  nfe_series INTEGER DEFAULT 1,
  nfe_next_number INTEGER DEFAULT 1,
  nfse_series TEXT DEFAULT '1',
  nfse_next_number INTEGER DEFAULT 1,
  environment TEXT DEFAULT 'homologacao' CHECK (environment IN ('homologacao', 'producao')),
  a1_cert_alias TEXT,
  a1_cert_encrypted BYTEA,
  a1_cert_password_encrypted BYTEA,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tax profiles per product/service
CREATE TABLE public.fiscal_tax_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID,
  service_id UUID,
  name TEXT NOT NULL,
  ncm TEXT,
  cest TEXT,
  cfop_saida TEXT,
  cfop_entrada TEXT,
  regime TEXT DEFAULT 'sn' CHECK (regime IN ('sn', 'normal')),
  cst_icms TEXT,
  csosn TEXT,
  aliquota_icms NUMERIC(5,2) DEFAULT 0,
  reducao_base_icms NUMERIC(5,2) DEFAULT 0,
  mva_st NUMERIC(5,2) DEFAULT 0,
  fcp_percent NUMERIC(5,2) DEFAULT 0,
  aliquota_pis NUMERIC(5,4) DEFAULT 0,
  aliquota_cofins NUMERIC(5,4) DEFAULT 0,
  aliquota_ipi NUMERIC(5,2),
  carga_efetiva_percent NUMERIC(5,4),
  iss_municipio_codigo TEXT,
  aliquota_iss NUMERIC(5,2),
  natureza_operacao TEXT,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- NF-e headers
CREATE TABLE public.nfe_headers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  fiscal_company_id UUID REFERENCES fiscal_companies(id),
  numero INTEGER NOT NULL,
  serie INTEGER NOT NULL,
  chave TEXT UNIQUE,
  protocolo TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'enviado', 'autorizado', 'rejeitado', 'cancelado', 'inutilizado', 'denegado')),
  tp_ambiente TEXT DEFAULT 'homologacao',
  emit_xml TEXT,
  proc_xml TEXT,
  danfe_pdf_url TEXT,
  destinatario JSONB DEFAULT '{}',
  totais JSONB DEFAULT '{}',
  contingencia JSONB DEFAULT '{}',
  rejeicoes JSONB DEFAULT '[]',
  codigo_status TEXT,
  motivo_status TEXT,
  dhRecbto TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- NF-e items
CREATE TABLE public.nfe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nfe_id UUID NOT NULL REFERENCES nfe_headers(id) ON DELETE CASCADE,
  product_id UUID,
  item_number INTEGER NOT NULL,
  codigo_produto TEXT,
  descricao TEXT NOT NULL,
  ncm TEXT,
  cfop TEXT,
  cst_csosn TEXT,
  qtd NUMERIC(16,4) NOT NULL,
  unidade TEXT NOT NULL,
  preco_unitario NUMERIC(16,4) NOT NULL,
  valor_total NUMERIC(16,2) NOT NULL,
  desconto NUMERIC(16,2) DEFAULT 0,
  frete_rateado NUMERIC(16,2) DEFAULT 0,
  outras_despesas NUMERIC(16,2) DEFAULT 0,
  base_icms NUMERIC(16,2) DEFAULT 0,
  aliquota_icms NUMERIC(5,2) DEFAULT 0,
  valor_icms NUMERIC(16,2) DEFAULT 0,
  base_st NUMERIC(16,2) DEFAULT 0,
  mva_st NUMERIC(5,2) DEFAULT 0,
  valor_st NUMERIC(16,2) DEFAULT 0,
  pis_aliquota NUMERIC(5,4) DEFAULT 0,
  pis_valor NUMERIC(16,2) DEFAULT 0,
  cofins_aliquota NUMERIC(5,4) DEFAULT 0,
  cofins_valor NUMERIC(16,2) DEFAULT 0,
  ipi_aliquota NUMERIC(5,2) DEFAULT 0,
  ipi_valor NUMERIC(16,2) DEFAULT 0,
  fcp_valor NUMERIC(16,2) DEFAULT 0,
  carga_efetiva_valor NUMERIC(16,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- NFS-e headers
CREATE TABLE public.nfse_headers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  fiscal_company_id UUID REFERENCES fiscal_companies(id),
  rps_numero INTEGER NOT NULL,
  rps_serie TEXT DEFAULT '1',
  nfse_numero INTEGER,
  municipio_codigo TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'enviado', 'autorizado', 'rejeitado', 'cancelado')),
  xml_envio TEXT,
  xml_retorno TEXT,
  danfse_pdf_url TEXT,
  tomador JSONB DEFAULT '{}',
  servicos JSONB DEFAULT '[]',
  totais JSONB DEFAULT '{}',
  codigo_status TEXT,
  motivo_status TEXT,
  protocolo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fiscal providers (integrations)
CREATE TABLE public.fiscal_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('nfe', 'nfse', 'ambos')),
  provider TEXT NOT NULL, -- tecnospeed, enotas, plugnotas, nfeio, municipal
  name TEXT NOT NULL,
  credentials_encrypted JSONB DEFAULT '{}',
  endpoints JSONB DEFAULT '{}',
  municipio_codigo TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SPED exports
CREATE TABLE public.sped_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('efd_icms_ipi', 'efd_contrib', 'reinf', 'esocial')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'error')),
  file_url TEXT,
  file_size BIGINT,
  records_count INTEGER DEFAULT 0,
  validation_errors JSONB DEFAULT '[]',
  processing_log JSONB DEFAULT '[]',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fiscal events (audit)
CREATE TABLE public.fiscal_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('nfe', 'nfse', 'sped', 'esocial', 'config')),
  entity_id UUID,
  event TEXT NOT NULL,
  user_id UUID,
  payload_masked JSONB DEFAULT '{}',
  response_masked JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fiscal certificate management
CREATE TABLE public.fiscal_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  fiscal_company_id UUID REFERENCES fiscal_companies(id),
  type TEXT DEFAULT 'A1' CHECK (type IN ('A1', 'A3')),
  alias_name TEXT NOT NULL,
  subject_name TEXT,
  serial_number TEXT,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,
  cert_data_encrypted BYTEA,
  password_encrypted BYTEA,
  is_active BOOLEAN DEFAULT true,
  environment TEXT DEFAULT 'homologacao',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fiscal_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfe_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfse_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sped_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage company fiscal data"
ON public.fiscal_companies
FOR ALL
USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company tax profiles"
ON public.fiscal_tax_profiles
FOR ALL
USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company NFe"
ON public.nfe_headers
FOR ALL
USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage NFe items"
ON public.nfe_items
FOR ALL
USING (EXISTS (
  SELECT 1 FROM nfe_headers 
  WHERE nfe_headers.id = nfe_items.nfe_id 
  AND nfe_headers.company_id = get_user_company_id()
));

CREATE POLICY "Users can manage company NFSe"
ON public.nfse_headers
FOR ALL
USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage fiscal providers"
ON public.fiscal_providers
FOR ALL
USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage SPED exports"
ON public.sped_exports
FOR ALL
USING (company_id = get_user_company_id());

CREATE POLICY "Users can view fiscal events"
ON public.fiscal_events
FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "System can create fiscal events"
ON public.fiscal_events
FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can manage fiscal certificates"
ON public.fiscal_certificates
FOR ALL
USING (company_id = get_user_company_id());

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_fiscal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fiscal_companies_updated_at
  BEFORE UPDATE ON public.fiscal_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

CREATE TRIGGER update_fiscal_tax_profiles_updated_at
  BEFORE UPDATE ON public.fiscal_tax_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

CREATE TRIGGER update_nfe_headers_updated_at
  BEFORE UPDATE ON public.nfe_headers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

CREATE TRIGGER update_nfse_headers_updated_at
  BEFORE UPDATE ON public.nfse_headers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

CREATE TRIGGER update_fiscal_providers_updated_at
  BEFORE UPDATE ON public.fiscal_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

CREATE TRIGGER update_sped_exports_updated_at
  BEFORE UPDATE ON public.sped_exports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

CREATE TRIGGER update_fiscal_certificates_updated_at
  BEFORE UPDATE ON public.fiscal_certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fiscal_updated_at();

-- Indexes for performance
CREATE INDEX idx_nfe_headers_company_status ON nfe_headers(company_id, status);
CREATE INDEX idx_nfe_headers_chave ON nfe_headers(chave);
CREATE INDEX idx_nfe_items_nfe_id ON nfe_items(nfe_id);
CREATE INDEX idx_nfse_headers_company_status ON nfse_headers(company_id, status);
CREATE INDEX idx_fiscal_events_company_entity ON fiscal_events(company_id, entity_type, entity_id);
CREATE INDEX idx_sped_exports_company_period ON sped_exports(company_id, period_start, period_end);

-- Function to generate NFe number
CREATE OR REPLACE FUNCTION public.generate_nfe_number(p_fiscal_company_id UUID, p_serie INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  UPDATE fiscal_companies 
  SET nfe_next_number = nfe_next_number + 1
  WHERE id = p_fiscal_company_id
  RETURNING nfe_next_number - 1 INTO next_number;
  
  RETURN next_number;
END;
$$;

-- Function to generate NFSe RPS number
CREATE OR REPLACE FUNCTION public.generate_rps_number(p_fiscal_company_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_number INTEGER;
BEGIN
  UPDATE fiscal_companies 
  SET nfse_next_number = nfse_next_number + 1
  WHERE id = p_fiscal_company_id
  RETURNING nfse_next_number - 1 INTO next_number;
  
  RETURN next_number;
END;
$$;