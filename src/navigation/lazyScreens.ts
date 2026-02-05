import { lazy } from 'react';

// Lazy loading de telas principais
export const LazyDashboardScreen = lazy(() => 
  import('../screens/home/DashboardScreen/DashboardScreen').then(module => ({
    default: module.default
  }))
);

export const LazyTransactionList = lazy(() => 
  import('../screens/Transactions/TransactionList/TransactionList').then(module => ({
    default: module.default
  }))
);

export const LazyTransactionCreate = lazy(() => 
  import('../screens/Transactions/TransactionCreate/TransactionCreate').then(module => ({
    default: module.default
  }))
);

export const LazyTransactionDetails = lazy(() => 
  import('../screens/Transactions/TransactionsDetails/TransactionsDetails').then(module => ({
    default: module.default
  }))
);

export const LazyEmptyStateScreen = lazy(() => 
  import('../screens/home/EmptyStateScreen/EmptyStateScreen').then(module => ({
    default: module.EmptyStateScreen
  }))
);