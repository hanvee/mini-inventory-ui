export interface ISaleItem {
  id?: number;
  invoice_id?: string;
  product_code: string;
  qty: number;
  created_at?: string;
  updated_at?: string;
}

export interface ISale {
  invoice_id?: string;
  date: string;
  customer_id: number;
  subtotal: number;
  items: ISaleItem[];
  created_at?: string;
  updated_at?: string;
  sale_items?: ISaleItem[];
}
