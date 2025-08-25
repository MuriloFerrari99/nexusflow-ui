-- Create enums for payment and collection status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'partial');
CREATE TYPE payment_method AS ENUM ('pix', 'boleto', 'credit_card', 'debit_card', 'bank_transfer');
CREATE TYPE reminder_type AS ENUM ('email', 'sms', 'whatsapp', 'phone_call');
CREATE TYPE collection_status AS ENUM ('active', 'suspended', 'completed', 'cancelled');
CREATE TYPE default_risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create accounts_receivable table
CREATE TABLE public.accounts_receivable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    customer_name TEXT NOT NULL,
    customer_document TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    invoice_number TEXT,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method,
    external_id TEXT,
    paid_amount NUMERIC(10,2) DEFAULT 0,
    paid_at TIMESTAMPTZ,
    late_fee NUMERIC(10,2) DEFAULT 0,
    interest_rate NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment_collections table
CREATE TABLE public.payment_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    account_receivable_id UUID NOT NULL REFERENCES public.accounts_receivable(id),
    collection_type TEXT NOT NULL DEFAULT 'automatic',
    payment_method payment_method NOT NULL,
    payment_link TEXT,
    pix_qr_code TEXT,
    boleto_code TEXT,
    amount NUMERIC(10,2) NOT NULL,
    status collection_status NOT NULL DEFAULT 'active',
    sent_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment_reminders table
CREATE TABLE public.payment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    account_receivable_id UUID NOT NULL REFERENCES public.accounts_receivable(id),
    reminder_type reminder_type NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending',
    attempt_number INTEGER NOT NULL DEFAULT 1,
    response_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create collection_timeline table
CREATE TABLE public.collection_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    account_receivable_id UUID NOT NULL REFERENCES public.accounts_receivable(id),
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    user_id UUID,
    automated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment_integrations table
CREATE TABLE public.payment_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    provider TEXT NOT NULL,
    api_key_encrypted TEXT,
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_sandbox BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create default_risk_scores table
CREATE TABLE public.default_risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    customer_document TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level default_risk_level NOT NULL,
    factors JSONB NOT NULL DEFAULT '{}',
    last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(company_id, customer_document)
);

-- Enable RLS on all tables
ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.default_risk_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage company accounts receivable" ON public.accounts_receivable
    FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company payment collections" ON public.payment_collections
    FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company payment reminders" ON public.payment_reminders
    FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can view company collection timeline" ON public.collection_timeline
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "System can create collection timeline" ON public.collection_timeline
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Company admins can manage payment integrations" ON public.payment_integrations
    FOR ALL USING (company_id = get_user_company_id() AND is_company_admin());

CREATE POLICY "Users can view company default risk scores" ON public.default_risk_scores
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "System can manage default risk scores" ON public.default_risk_scores
    FOR ALL USING (company_id = get_user_company_id());

-- Create updated_at triggers
CREATE TRIGGER update_accounts_receivable_updated_at
    BEFORE UPDATE ON public.accounts_receivable
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_collections_updated_at
    BEFORE UPDATE ON public.payment_collections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_integrations_updated_at
    BEFORE UPDATE ON public.payment_integrations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate overdue days
CREATE OR REPLACE FUNCTION public.calculate_overdue_days(due_date DATE)
RETURNS INTEGER AS $$
BEGIN
    IF due_date < CURRENT_DATE THEN
        RETURN CURRENT_DATE - due_date;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to track collection events
CREATE OR REPLACE FUNCTION public.track_collection_event(
    p_account_receivable_id UUID,
    p_event_type TEXT,
    p_event_data JSONB DEFAULT '{}',
    p_user_id UUID DEFAULT NULL,
    p_automated BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    v_company_id UUID;
    v_timeline_id UUID;
BEGIN
    -- Get company_id from account receivable
    SELECT company_id INTO v_company_id
    FROM public.accounts_receivable
    WHERE id = p_account_receivable_id;

    -- Insert timeline event
    INSERT INTO public.collection_timeline (
        company_id,
        account_receivable_id,
        event_type,
        event_data,
        user_id,
        automated
    ) VALUES (
        v_company_id,
        p_account_receivable_id,
        p_event_type,
        p_event_data,
        COALESCE(p_user_id, auth.uid()),
        p_automated
    ) RETURNING id INTO v_timeline_id;

    RETURN v_timeline_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;