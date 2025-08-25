-- Create bank reconciliations table
CREATE TABLE public.bank_reconciliations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    account_id UUID NOT NULL,
    reconciliation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'approved')),
    total_bank_balance NUMERIC(15,2) DEFAULT 0,
    total_system_balance NUMERIC(15,2) DEFAULT 0,
    difference_amount NUMERIC(15,2) DEFAULT 0,
    reconciled_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank statement items table
CREATE TABLE public.bank_statement_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    reconciliation_id UUID NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    document_number TEXT,
    balance NUMERIC(15,2),
    matched_transaction_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statement_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bank_reconciliations
CREATE POLICY "Users can manage company bank reconciliations"
ON public.bank_reconciliations
FOR ALL
USING (company_id = get_user_company_id());

-- Create RLS policies for bank_statement_items
CREATE POLICY "Users can manage company bank statement items"
ON public.bank_statement_items
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.bank_reconciliations br
        WHERE br.id = bank_statement_items.reconciliation_id
        AND br.company_id = get_user_company_id()
    )
);

-- Add foreign key constraints
ALTER TABLE public.bank_reconciliations
ADD CONSTRAINT bank_reconciliations_account_id_fkey 
FOREIGN KEY (account_id) REFERENCES public.financial_accounts(id);

ALTER TABLE public.bank_statement_items
ADD CONSTRAINT bank_statement_items_reconciliation_id_fkey 
FOREIGN KEY (reconciliation_id) REFERENCES public.bank_reconciliations(id) ON DELETE CASCADE;

-- Add triggers for updated_at
CREATE TRIGGER update_bank_reconciliations_updated_at
    BEFORE UPDATE ON public.bank_reconciliations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();