import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

/**
 * Hook para assinar um Observable e retornar seu valor atual como estado do React.
 * Facilita a integração entre RxJS e Componentes Funcionais.
 */
export function useObservable<T>(observable$: Observable<T>, initialValue: T): T {
    const [value, setValue] = useState<T>(initialValue);

    useEffect(() => {
        const subscription = observable$.subscribe(setValue);
        return () => subscription.unsubscribe();
    }, [observable$]);

    return value;
}
