-- Create financial categories table
CREATE TABLE public.financial_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  category_type TEXT NOT NULL CHECK (category_type IN ('income', 'expense')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create financial accounts table
CREATE TABLE public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('bank', 'cash', 'credit_card', 'investment')),
  balance DECIMAL(15,2) DEFAULT 0,
  account_number TEXT,
  bank_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create financial transactions table (Ledger)
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id),
  category_id UUID REFERENCES public.financial_categories(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer')),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT CHECK (payment_method IN ('cash', 'pix', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'other')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  tags TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  invoice_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_address TEXT,
  client_document TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  net_amount DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, invoice_number)
);

-- Create invoice items table
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('received', 'sent')),
  invoice_id UUID REFERENCES public.invoices(id),
  transaction_id UUID REFERENCES public.financial_transactions(id),
  account_id UUID NOT NULL REFERENCES public.financial_accounts(id),
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'pix', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'other')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  reference TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage company financial categories" ON public.financial_categories
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company financial accounts" ON public.financial_accounts
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company financial transactions" ON public.financial_transactions
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company invoices" ON public.invoices
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage invoice items" ON public.invoice_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND invoices.company_id = get_user_company_id()
  ));

CREATE POLICY "Users can manage company payments" ON public.payments
  FOR ALL USING (company_id = get_user_company_id());

-- Create updated_at triggers
CREATE TRIGGER update_financial_categories_updated_at
  BEFORE UPDATE ON public.financial_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_accounts_updated_at
  BEFORE UPDATE ON public.financial_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  -- Get next invoice number for the company
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.invoices 
  WHERE company_id = NEW.company_id;
  
  -- Set invoice number
  NEW.invoice_number := LPAD(next_number::TEXT, 6, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION public.generate_invoice_number();

-- Insert default financial categories
INSERT INTO public.financial_categories (company_id, name, category_type, description) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Vendas', 'income', 'Receitas de vendas de produtos/serviços'),
  ('00000000-0000-0000-0000-000000000000', 'Serviços', 'income', 'Receitas de prestação de serviços'),
  ('00000000-0000-0000-0000-000000000000', 'Juros', 'income', 'Receitas financeiras'),
  ('00000000-0000-0000-0000-000000000000', 'Salários', 'expense', 'Gastos com folha de pagamento'),
  ('00000000-0000-0000-0000-000000000000', 'Aluguel', 'expense', 'Despesas com aluguel'),
  ('00000000-0000-0000-0000-000000000000', 'Marketing', 'expense', 'Investimentos em marketing'),
  ('00000000-0000-0000-0000-000000000000', 'Materiais', 'expense', 'Compra de materiais e suprimentos'),
  ('00000000-0000-0000-0000-000000000000', 'Impostos', 'expense', 'Pagamento de impostos e taxas');

-- Insert default financial account
INSERT INTO public.financial_accounts (company_id, name, account_type, balance) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Caixa Principal', 'cash', 0);