import React, { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PRIMARY_BLUE } from '../../../utils/colors';

interface LazyScreenWrapperProps {
  children: React.ReactNode;
}

const LazyScreenWrapper: React.FC<LazyScreenWrapperProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <View style={styles.container}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      }
    >
      {children}
    </Suspense>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default LazyScreenWrapper;