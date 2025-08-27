-- Create enum types for procurement module
CREATE TYPE public.purchase_requisition_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'converted');
CREATE TYPE public.rfq_status AS ENUM ('draft', 'sent', 'quoted', 'awarded', 'closed');
CREATE TYPE public.rfq_supplier_status AS ENUM ('invited', 'responded', 'declined');
CREATE TYPE public.purchase_order_status AS ENUM ('draft', 'sent', 'confirmed', 'partially_received', 'received', 'closed', 'cancelled');
CREATE TYPE public.receipt_status AS ENUM ('pending', 'matched', 'discrepant', 'posted');
CREATE TYPE public.replenishment_policy_type AS ENUM ('rop', 'minmax', 'periodic');
CREATE TYPE public.replenishment_suggestion_status AS ENUM ('new', 'converted', 'dismissed');
CREATE TYPE public.landed_cost_type AS ENUM ('freight', 'insurance', 'import_duty', 'other');
CREATE TYPE public.allocation_basis AS ENUM ('value', 'weight', 'volume', 'qty');
CREATE TYPE public.entity_type AS ENUM ('rfq', 'po');

-- Purchase requisitions
CREATE TABLE public.purchase_requisitions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    requester_id UUID NOT NULL,
    cost_center TEXT,
    status purchase_requisition_status DEFAULT 'draft',
    justification TEXT,
    needed_date DATE,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Purchase requisition items
CREATE TABLE public.purchase_requisition_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    pr_id UUID NOT NULL REFERENCES public.purchase_requisitions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    qty NUMERIC(15,4) NOT NULL,
    target_price NUMERIC(15,4),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RFQs (Request for Quotation)
CREATE TABLE public.rfqs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    pr_id UUID REFERENCES public.purchase_requisitions(id),
    title TEXT NOT NULL,
    description TEXT,
    status rfq_status DEFAULT 'draft',
    due_date DATE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RFQ suppliers
CREATE TABLE public.rfq_suppliers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    status rfq_supplier_status DEFAULT 'invited',
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    responded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(rfq_id, supplier_id)
);

-- RFQ items
CREATE TABLE public.rfq_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    qty NUMERIC(15,4) NOT NULL,
    specifications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RFQ quotes (cotações recebidas)
CREATE TABLE public.rfq_quotes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    rfq_item_id UUID NOT NULL REFERENCES public.rfq_items(id) ON DELETE CASCADE,
    price NUMERIC(15,4) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    lead_time_days INTEGER DEFAULT 7,
    moq INTEGER DEFAULT 1,
    pack_multiple INTEGER DEFAULT 1,
    incoterm TEXT,
    freight_included BOOLEAN DEFAULT false,
    valid_until DATE,
    notes TEXT,
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Purchase orders
CREATE TABLE public.purchase_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    po_number TEXT,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
    rfq_id UUID REFERENCES public.rfqs(id),
    status purchase_order_status DEFAULT 'draft',
    payment_terms TEXT,
    freight_terms TEXT,
    ship_to TEXT,
    currency TEXT DEFAULT 'BRL',
    subtotal NUMERIC(15,4) DEFAULT 0,
    tax_amount NUMERIC(15,4) DEFAULT 0,
    freight_amount NUMERIC(15,4) DEFAULT 0,
    total NUMERIC(15,4) DEFAULT 0,
    created_by UUID NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Purchase order items
CREATE TABLE public.purchase_order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    qty NUMERIC(15,4) NOT NULL,
    price NUMERIC(15,4) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    lead_time_days INTEGER DEFAULT 7,
    expected_date DATE,
    received_qty NUMERIC(15,4) DEFAULT 0,
    taxes_json JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Receipts (recebimentos)
CREATE TABLE public.receipts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    po_id UUID NOT NULL REFERENCES public.purchase_orders(id),
    document_number TEXT,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status receipt_status DEFAULT 'pending',
    received_by UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Receipt items
CREATE TABLE public.receipt_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_id UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
    po_item_id UUID NOT NULL REFERENCES public.purchase_order_items(id),
    qty_received NUMERIC(15,4) NOT NULL,
    qty_accepted NUMERIC(15,4) NOT NULL,
    qty_rejected NUMERIC(15,4) DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Landed cost allocations
CREATE TABLE public.landed_cost_allocations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    receipt_id UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
    type landed_cost_type NOT NULL,
    description TEXT,
    amount NUMERIC(15,4) NOT NULL,
    allocation_basis allocation_basis DEFAULT 'value',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Replenishment policies
CREATE TABLE public.replenishment_policies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    product_id UUID NOT NULL,
    policy replenishment_policy_type DEFAULT 'rop',
    service_level NUMERIC(5,2) DEFAULT 95.0,
    z_factor NUMERIC(8,4) DEFAULT 1.65,
    lead_time_days INTEGER DEFAULT 7,
    review_period_days INTEGER,
    sigma_daily NUMERIC(15,4) DEFAULT 0,
    demand_daily NUMERIC(15,4) DEFAULT 0,
    min_level NUMERIC(15,4),
    max_level NUMERIC(15,4),
    eoq NUMERIC(15,4),
    moq INTEGER DEFAULT 1,
    pack_multiple INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(company_id, product_id)
);

-- Replenishment suggestions
CREATE TABLE public.replenishment_suggestions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    product_id UUID NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id),
    suggested_qty NUMERIC(15,4) NOT NULL,
    reason TEXT,
    net_available NUMERIC(15,4) DEFAULT 0,
    in_transit NUMERIC(15,4) DEFAULT 0,
    rop NUMERIC(15,4),
    safety_stock NUMERIC(15,4),
    target_level NUMERIC(15,4),
    expected_stockout_date DATE,
    status replenishment_suggestion_status DEFAULT 'new',
    converted_po_id UUID REFERENCES public.purchase_orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Supplier scores
CREATE TABLE public.supplier_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    otd_percent NUMERIC(5,2) DEFAULT 0,
    quality_ppm NUMERIC(10,2) DEFAULT 0,
    price_variation_percent NUMERIC(5,2) DEFAULT 0,
    service_sla NUMERIC(5,2) DEFAULT 0,
    total_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(company_id, supplier_id, period_start, period_end)
);

-- Negotiation logs
CREATE TABLE public.negotiation_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.purchase_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requisition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landed_cost_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replenishment_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replenishment_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage company purchase requisitions" ON public.purchase_requisitions
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage purchase requisition items" ON public.purchase_requisition_items
FOR ALL USING (EXISTS (SELECT 1 FROM public.purchase_requisitions WHERE id = purchase_requisition_items.pr_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage company rfqs" ON public.rfqs
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage rfq suppliers" ON public.rfq_suppliers
FOR ALL USING (EXISTS (SELECT 1 FROM public.rfqs WHERE id = rfq_suppliers.rfq_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage rfq items" ON public.rfq_items
FOR ALL USING (EXISTS (SELECT 1 FROM public.rfqs WHERE id = rfq_items.rfq_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage rfq quotes" ON public.rfq_quotes
FOR ALL USING (EXISTS (SELECT 1 FROM public.rfqs WHERE id = rfq_quotes.rfq_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage company purchase orders" ON public.purchase_orders
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage purchase order items" ON public.purchase_order_items
FOR ALL USING (EXISTS (SELECT 1 FROM public.purchase_orders WHERE id = purchase_order_items.po_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage company receipts" ON public.receipts
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage receipt items" ON public.receipt_items
FOR ALL USING (EXISTS (SELECT 1 FROM public.receipts WHERE id = receipt_items.receipt_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage landed cost allocations" ON public.landed_cost_allocations
FOR ALL USING (EXISTS (SELECT 1 FROM public.receipts WHERE id = landed_cost_allocations.receipt_id AND company_id = get_user_company_id()));

CREATE POLICY "Users can manage company replenishment policies" ON public.replenishment_policies
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company replenishment suggestions" ON public.replenishment_suggestions
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company supplier scores" ON public.supplier_scores
FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company negotiation logs" ON public.negotiation_logs
FOR ALL USING (company_id = get_user_company_id());

-- Create function to generate PO number
CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  -- Get next PO number for the company
  SELECT COALESCE(MAX(CAST(SUBSTRING(po_number FROM '[0-9]+') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.purchase_orders 
  WHERE company_id = NEW.company_id;
  
  -- Set PO number
  NEW.po_number := 'PO-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for PO number generation
CREATE TRIGGER generate_po_number_trigger
  BEFORE INSERT ON public.purchase_orders
  FOR EACH ROW
  WHEN (NEW.po_number IS NULL)
  EXECUTE FUNCTION public.generate_po_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_procurement_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_purchase_requisitions_updated_at
  BEFORE UPDATE ON public.purchase_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_procurement_updated_at();

CREATE TRIGGER update_rfqs_updated_at
  BEFORE UPDATE ON public.rfqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_procurement_updated_at();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_procurement_updated_at();

CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_procurement_updated_at();

CREATE TRIGGER update_replenishment_policies_updated_at
  BEFORE UPDATE ON public.replenishment_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_procurement_updated_at();

CREATE TRIGGER update_replenishment_suggestions_updated_at
  BEFORE UPDATE ON public.replenishment_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_procurement_updated_at();