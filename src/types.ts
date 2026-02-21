export interface Review {
  id: number;
  product_id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  pricing_tiers?: string; // JSON string from DB
  avg_rating?: number;
  review_count?: number;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: number;
  customer_name: string;
  customer_email: string;
  address: string;
  items: { id: number; quantity: number; price: number }[];
  total: number;
  payment_method: 'bank_transfer' | 'bitcoin';
  status?: string;
  created_at?: string;
}
