-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  cnpj TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2),
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  max_stock INTEGER,
  unit TEXT NOT NULL DEFAULT 'un',
  category TEXT,
  supplier_id UUID REFERENCES public.suppliers(id),
  barcode TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, sku)
);

-- Create stock_movements table
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  reference_id UUID,
  reference_type TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  po_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  expected_date DATE,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, po_number)
);

-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  received_quantity INTEGER DEFAULT 0
);

-- Create stock_alerts table
CREATE TABLE public.stock_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create barcode_entries table for simulation
CREATE TABLE public.barcode_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id),
  barcode TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out')),
  processed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barcode_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage company suppliers" ON public.suppliers
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company products" ON public.products
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company stock movements" ON public.stock_movements
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company purchase orders" ON public.purchase_orders
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company PO items" ON public.purchase_order_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.purchase_orders po 
    WHERE po.id = purchase_order_items.purchase_order_id 
    AND po.company_id = get_user_company_id()
  ));

CREATE POLICY "Users can manage company stock alerts" ON public.stock_alerts
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "Users can manage company barcode entries" ON public.barcode_entries
  FOR ALL USING (company_id = get_user_company_id());

-- Create indexes for performance
CREATE INDEX idx_products_company_sku ON public.products(company_id, sku);
CREATE INDEX idx_products_barcode ON public.products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_date ON public.stock_movements(created_at);
CREATE INDEX idx_purchase_orders_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX idx_stock_alerts_product ON public.stock_alerts(product_id) WHERE is_active = true;

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check stock levels and create alerts
CREATE OR REPLACE FUNCTION public.check_stock_levels()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove existing alerts for this product
  DELETE FROM public.stock_alerts 
  WHERE product_id = NEW.id AND alert_type IN ('low_stock', 'out_of_stock');

  -- Check for out of stock
  IF NEW.current_stock <= 0 THEN
    INSERT INTO public.stock_alerts (company_id, product_id, alert_type)
    VALUES (NEW.company_id, NEW.id, 'out_of_stock');
  -- Check for low stock
  ELSIF NEW.current_stock <= NEW.min_stock THEN
    INSERT INTO public.stock_alerts (company_id, product_id, alert_type)
    VALUES (NEW.company_id, NEW.id, 'low_stock');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check stock levels when product is updated
CREATE TRIGGER check_product_stock_levels
  AFTER UPDATE OF current_stock ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.check_stock_levels();

-- Function to update product stock when movement is created
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'in' THEN
    UPDATE public.products 
    SET current_stock = current_stock + NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;
  ELSIF NEW.movement_type = 'out' THEN
    UPDATE public.products 
    SET current_stock = current_stock - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;
  ELSIF NEW.movement_type = 'adjustment' THEN
    UPDATE public.products 
    SET current_stock = NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stock when movement is created
CREATE TRIGGER update_stock_on_movement
  AFTER INSERT ON public.stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_stock();