import { Category } from "./categorie.model";

export interface TransactionRequest {
  description: string;
  amount: number;
  date: string;
  type: string;       // 'EXPENSE' | 'INCOME'
  categoryId: string;
}

export interface Transaction {
  uuid: string;
  description: string;
  amount: number;
  date: string;
  type: string;
  category: Category;
}