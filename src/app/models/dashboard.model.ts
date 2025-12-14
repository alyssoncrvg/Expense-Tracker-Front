import { Transaction } from './transaction.model';

export interface DashboardData {
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  expensesByPerson: {
    personName: string;
    amount: number;
  }[];
  cashFlowChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderRadius?: number;
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  };
  expensesByCategory: {
    categoryName: string;
    amount: number;
  }[];
  lastTransactions: Transaction[];
}