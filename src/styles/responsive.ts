import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const BREAKPOINTS = {
  xs: 320,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1200,
  xxl: 1440,
};

export const isMobile = () => width < BREAKPOINTS.md;
export const isTablet = () => width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
export const isDesktop = () => width >= BREAKPOINTS.lg;
export const isSmallScreen = () => width < BREAKPOINTS.sm;

export const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
  if (isMobile()) return mobile;
  if (isTablet()) return tablet;
  return desktop;
};

export const SPACING = {
  xs: getResponsiveValue(4, 6, 8),
  sm: getResponsiveValue(8, 12, 16),
  md: getResponsiveValue(16, 24, 32),
  lg: getResponsiveValue(24, 32, 48),
  xl: getResponsiveValue(32, 48, 64),
};

export const FONT_SIZES = {
  xs: getResponsiveValue(10, 12, 14),
  sm: getResponsiveValue(12, 14, 16),
  md: getResponsiveValue(14, 16, 18),
  lg: getResponsiveValue(16, 18, 20),
  xl: getResponsiveValue(18, 20, 24),
  xxl: getResponsiveValue(20, 24, 28),
  xxxl: getResponsiveValue(24, 28, 32),
};

export const LAYOUT = {
  containerPadding: getResponsiveValue(16, 24, 32),
  maxWidth: getResponsiveValue(width, 768, 1200),
  borderRadius: getResponsiveValue(8, 12, 16),
};

export const GRID = {
  columns: getResponsiveValue(1, 2, 3),
  gap: getResponsiveValue(16, 24, 32),
};
