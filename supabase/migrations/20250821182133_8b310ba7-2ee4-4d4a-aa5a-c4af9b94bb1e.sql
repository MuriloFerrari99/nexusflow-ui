-- Create RLS policies for the new tables
CREATE POLICY "Users can manage company suppliers" ON public.suppliers
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
CREATE INDEX IF NOT EXISTS idx_suppliers_company ON public.suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON public.stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_product ON public.stock_alerts(product_id) WHERE is_active = true;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_suppliers_updated_at') THEN
    CREATE TRIGGER update_suppliers_updated_at
      BEFORE UPDATE ON public.suppliers
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_purchase_orders_updated_at') THEN
    CREATE TRIGGER update_purchase_orders_updated_at
      BEFORE UPDATE ON public.purchase_orders
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;