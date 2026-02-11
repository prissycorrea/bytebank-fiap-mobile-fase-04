import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { transactionReactiveService } from '@core/services/reactive/transactionReactiveService';
import { ITransaction } from '@shared/types/transaction';

export const useReactiveTransactions = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscriptions = new Subscription();

    // Subscribe para transações
    subscriptions.add(
      transactionReactiveService.transactions$.subscribe(setTransactions)
    );

    // Subscribe para transações filtradas (reativo)
    subscriptions.add(
      transactionReactiveService.filteredTransactions$.subscribe(setFilteredTransactions)
    );

    // Subscribe para categorias únicas (reativo)
    subscriptions.add(
      transactionReactiveService.uniqueCategories$.subscribe(setUniqueCategories)
    );

    // Subscribe para loading
    subscriptions.add(
      transactionReactiveService.loading$.subscribe(setLoading)
    );

    // Subscribe para error
    subscriptions.add(
      transactionReactiveService.error$.subscribe(setError)
    );

    // Subscribe para searchText
    subscriptions.add(
      transactionReactiveService.searchText$.subscribe(setSearchText)
    );

    // Subscribe para categoryFilter
    subscriptions.add(
      transactionReactiveService.categoryFilter$.subscribe(setCategoryFilter)
    );

    return () => {
      subscriptions.unsubscribe();
    };
  }, []);

  return {
    transactions,
    filteredTransactions,
    uniqueCategories,
    searchText,
    categoryFilter,
    loading,
    error,
    setSearchText: (text: string) => transactionReactiveService.setSearchText(text),
    setCategoryFilter: (category: string) => transactionReactiveService.setCategoryFilter(category),
    loadTransactions: (userId: string) => transactionReactiveService.loadTransactions(userId),
    reset: () => transactionReactiveService.reset(),
  };
};