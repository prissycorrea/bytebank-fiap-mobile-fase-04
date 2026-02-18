import { lazy } from 'react';

// Lazy loading de telas principais
export const LazyDashboardScreen = lazy(() => import('../screens/home/DashboardScreen/DashboardScreen'));

export const LazyTransactionList = lazy(() => import('../screens/Transactions/TransactionList/TransactionList'));

export const LazyTransactionCreate = lazy(() => import('../screens/Transactions/TransactionCreate/TransactionCreate'));

export const LazyTransactionDetails = lazy(() => import('../screens/Transactions/TransactionsDetails/TransactionsDetails'));

export const LazyEmptyStateScreen = lazy(() =>
  import('../screens/home/EmptyStateScreen/EmptyStateScreen').then(module => ({
    default: module.EmptyStateScreen
  }))
);