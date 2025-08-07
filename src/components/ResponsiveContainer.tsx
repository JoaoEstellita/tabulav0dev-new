import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LAYOUT, isDesktop, isTablet } from '../styles/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: any;
  maxWidth?: number;
  centered?: boolean;
}

export default function ResponsiveContainer({ 
  children, 
  style, 
  maxWidth = LAYOUT.maxWidth,
  centered = true 
}: ResponsiveContainerProps) {
  return (
    <View style={[
      styles.container,
      centered && styles.centered,
      { maxWidth },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: LAYOUT.containerPadding,
  },
  centered: {
    alignSelf: 'center',
    width: '100%',
  },
});
