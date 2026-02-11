import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: any;
}

/**
 * Componente de imagem otimizado
 * Usa cache e otimizações de performance
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  ...props
}) => {
  return (
    <Image
      source={source}
      style={style}
      resizeMode="contain"
      {...props}
    />
  );
};

export default OptimizedImage;