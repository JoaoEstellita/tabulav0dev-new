import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });

    return () => subscription?.remove();
  }, []);

  return {
    orientation,
    dimensions,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    width: dimensions.width,
    height: dimensions.height,
  };
};
