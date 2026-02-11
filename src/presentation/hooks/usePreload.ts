import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { PreloadService } from '../../core/services/preloadService';
import { useAuth } from './useAuth';

/**
 * Hook para pré-carregar dados antes da navegação
 */
export const usePreload = (screenName: string) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Pré-carrega quando o componente monta
    PreloadService.preloadScreenData(screenName, user.uid);

    // Pré-carrega antes de navegar
    const unsubscribe = navigation.addListener('focus', () => {
      PreloadService.preloadScreenData(screenName, user.uid);
    });

    return unsubscribe;
  }, [user, screenName, navigation]);
};