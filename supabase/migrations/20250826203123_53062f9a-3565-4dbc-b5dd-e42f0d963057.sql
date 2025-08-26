-- Add project_id to financial_transactions table
ALTER TABLE public.financial_transactions 
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_financial_transactions_project_id ON public.financial_transactions(project_id);

-- Create project_budgets table for detailed budget control
CREATE TABLE public.project_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  category_id UUID REFERENCES public.financial_categories(id),
  budget_type TEXT NOT NULL CHECK (budget_type IN ('receita', 'custo_direto', 'custo_indireto')),
  planned_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for project_budgets
ALTER TABLE public.project_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_budgets
CREATE POLICY "Users can manage company project budgets" 
ON public.project_budgets 
FOR ALL 
USING (company_id = get_user_company_id());

-- Create trigger for updated_at
CREATE TRIGGER update_project_budgets_updated_at
BEFORE UPDATE ON public.project_budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate project financial summary
CREATE OR REPLACE FUNCTION public.get_project_financial_summary(p_project_id UUID)
RETURNS TABLE(
  total_receita NUMERIC,
  total_custos NUMERIC,
  margem_liquida NUMERIC,
  margem_percentual NUMERIC,
  orcamento_receita NUMERIC,
  orcamento_custos NUMERIC,
  percentual_orcamento_usado NUMERIC
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN ft.type = 'receita' THEN ft.amount ELSE 0 END), 0) as total_receita,
    COALESCE(SUM(CASE WHEN ft.type IN ('despesa', 'custo') THEN ft.amount ELSE 0 END), 0) as total_custos,
    COALESCE(SUM(CASE WHEN ft.type = 'receita' THEN ft.amount ELSE -ft.amount END), 0) as margem_liquida,
    CASE 
      WHEN SUM(CASE WHEN ft.type = 'receita' THEN ft.amount ELSE 0 END) > 0 THEN
        (SUM(CASE WHEN ft.type = 'receita' THEN ft.amount ELSE -ft.amount END) / 
         SUM(CASE WHEN ft.type = 'receita' THEN ft.amount ELSE 0 END)) * 100
      ELSE 0 
    END as margem_percentual,
    COALESCE((SELECT SUM(planned_amount) FROM project_budgets WHERE project_id = p_project_id AND budget_type = 'receita'), 0) as orcamento_receita,
    COALESCE((SELECT SUM(planned_amount) FROM project_budgets WHERE project_id = p_project_id AND budget_type IN ('custo_direto', 'custo_indireto')), 0) as orcamento_custos,
    CASE 
      WHEN (SELECT SUM(planned_amount) FROM project_budgets WHERE project_id = p_project_id) > 0 THEN
        (COALESCE(SUM(ft.amount), 0) / (SELECT SUM(planned_amount) FROM project_budgets WHERE project_id = p_project_id)) * 100
      ELSE 0 
    END as percentual_orcamento_usado
  FROM financial_transactions ft
  WHERE ft.project_id = p_project_id;
END;
$$;