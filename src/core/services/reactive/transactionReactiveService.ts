import { BehaviorSubject, Observable, combineLatest, from } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { ITransaction } from '@shared/types/transaction';
import { getMyTransactions } from '../transactions';

export class TransactionReactiveService {
  private transactionsSubject = new BehaviorSubject<ITransaction[]>([]);
  private searchTextSubject = new BehaviorSubject<string>('');
  private categoryFilterSubject = new BehaviorSubject<string>('');
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables públicos
  public transactions$: Observable<ITransaction[]> = this.transactionsSubject.asObservable();
  public searchText$: Observable<string> = this.searchTextSubject.asObservable();
  public categoryFilter$: Observable<string> = this.categoryFilterSubject.asObservable();
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  public error$: Observable<string | null> = this.errorSubject.asObservable();

  // Observable combinado para transações filtradas (reativo)
  public filteredTransactions$: Observable<ITransaction[]> = combineLatest([
    this.transactions$,
    this.searchText$.pipe(
      debounceTime(300), // Debounce de 300ms para otimizar performance
      distinctUntilChanged()
    ),
    this.categoryFilter$.pipe(distinctUntilChanged())
  ]).pipe(
    map(([transactions, searchText, categoryFilter]) => {
      return transactions.filter((transaction) => {
        const matchesCategory =
          categoryFilter === '' || transaction.category === categoryFilter;

        const matchesSearch =
          !searchText ||
          transaction.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchText.toLowerCase());

        return matchesCategory && matchesSearch;
      });
    })
  );

  // Observable para categorias únicas (reativo)
  public uniqueCategories$: Observable<string[]> = this.transactions$.pipe(
    map((transactions) => [...new Set(transactions.map((t) => t.category))])
  );

  // Métodos para atualizar estado
  setTransactions(transactions: ITransaction[]): void {
    this.transactionsSubject.next(transactions);
  }

  setSearchText(text: string): void {
    this.searchTextSubject.next(text);
  }

  setCategoryFilter(category: string): void {
    this.categoryFilterSubject.next(category);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  // Carregar transações de forma reativa
  loadTransactions(userId: string): Observable<ITransaction[]> {
    this.setLoading(true);
    this.setError(null);

    return from(getMyTransactions(userId)).pipe(
      map((transactions) => {
        this.setTransactions(transactions);
        this.setLoading(false);
        return transactions;
      }),
      catchError((error) => {
        this.setError(error.message || 'Erro ao carregar transações');
        this.setLoading(false);
        return [];
      })
    );
  }

  // Reset
  reset(): void {
    this.transactionsSubject.next([]);
    this.searchTextSubject.next('');
    this.categoryFilterSubject.next('');
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}

// Singleton
export const transactionReactiveService = new TransactionReactiveService();