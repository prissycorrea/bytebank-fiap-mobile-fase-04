import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

export interface AutocompleteOption {
  id: string;
  nome: string;
  busca?: string;
}

export class AutocompleteReactiveService {
  private querySubject = new BehaviorSubject<string>('');
  private optionsSubject = new BehaviorSubject<AutocompleteOption[]>([]);
  private isFocusedSubject = new BehaviorSubject<boolean>(false);

  public query$: Observable<string> = this.querySubject.asObservable();
  public options$: Observable<AutocompleteOption[]> = this.optionsSubject.asObservable();
  public isFocused$: Observable<boolean> = this.isFocusedSubject.asObservable();

  // Observable reativo para opções filtradas com debounce
  public filteredOptions$: Observable<AutocompleteOption[]> = combineLatest([
    this.options$,
    this.query$.pipe(
      debounceTime(200), // Debounce de 200ms
      distinctUntilChanged(),
      startWith('')
    ),
    this.isFocused$
  ]).pipe(
    map(([options, query, isFocused]) => {
      if (!isFocused) return [];
      
      if (!query || query.length === 0) {
        return options;
      }

      return options.filter((option) =>
        option.nome.toLowerCase().includes(query.toLowerCase())
      );
    })
  );

  // Observable para controlar visibilidade da lista
  public showList$: Observable<boolean> = combineLatest([
    this.filteredOptions$,
    this.isFocused$
  ]).pipe(
    map(([filteredOptions, isFocused]) => 
      isFocused && filteredOptions.length > 0
    )
  );

  setQuery(query: string): void {
    this.querySubject.next(query);
  }

  setOptions(options: AutocompleteOption[]): void {
    this.optionsSubject.next(options);
  }

  setIsFocused(isFocused: boolean): void {
    this.isFocusedSubject.next(isFocused);
  }

  reset(): void {
    this.querySubject.next('');
    this.isFocusedSubject.next(false);
  }
}

// Singleton
export const autocompleteReactiveService = new AutocompleteReactiveService();