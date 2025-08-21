-- Create analytics dashboards table
CREATE TABLE public.analytics_dashboards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    layout JSONB NOT NULL DEFAULT '[]'::jsonb,
    filters JSONB DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view accessible dashboards" 
ON public.analytics_dashboards 
FOR SELECT 
USING (
    company_id = get_user_company_id() AND 
    (is_public = true OR created_by = auth.uid() OR is_company_admin())
);

CREATE POLICY "Users can create company dashboards" 
ON public.analytics_dashboards 
FOR INSERT 
WITH CHECK (company_id = get_user_company_id() AND created_by = auth.uid());

CREATE POLICY "Users can update their own dashboards" 
ON public.analytics_dashboards 
FOR UPDATE 
USING (
    company_id = get_user_company_id() AND 
    (created_by = auth.uid() OR is_company_admin())
);

CREATE POLICY "Admins can delete company dashboards" 
ON public.analytics_dashboards 
FOR DELETE 
USING (company_id = get_user_company_id() AND is_company_admin());

-- Create report exports table
CREATE TABLE public.report_exports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    dashboard_id UUID REFERENCES public.analytics_dashboards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'excel', 'csv')),
    file_url TEXT,
    filters JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for exports
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their exports" 
ON public.report_exports 
FOR ALL 
USING (company_id = get_user_company_id() AND user_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_analytics_dashboards_updated_at
    BEFORE UPDATE ON public.analytics_dashboards
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();