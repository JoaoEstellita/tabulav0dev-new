// Web fallback – evita dependência de 'react-native-reanimated' no build da Vercel
// API compatível com a versão nativa, porém sem animação (leve e suficiente para web)

export function usePressScale() {
  const onPressIn = () => {}
  const onPressOut = () => {}
  const style: any = { transform: [{ scale: 1 }] }
  return { onPressIn, onPressOut, style }
}


