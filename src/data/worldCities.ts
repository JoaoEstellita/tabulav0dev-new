// Cidades de referência para ancorar geograficamente as linhas do Astro Map.
// Cobertura ampla por continente; lat/lon aproximados (só posicionamento visual).
export type City = { name: string; lat: number; lon: number }

export const WORLD_CITIES: City[] = [
  // América do Sul
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
  { name: 'Brasília', lat: -15.79, lon: -47.88 },
  { name: 'Buenos Aires', lat: -34.60, lon: -58.38 },
  { name: 'Lima', lat: -12.05, lon: -77.04 },
  { name: 'Bogotá', lat: 4.71, lon: -74.07 },
  { name: 'Santiago', lat: -33.45, lon: -70.67 },
  // América do Norte / Central
  { name: 'Cidade do México', lat: 19.43, lon: -99.13 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'Nova York', lat: 40.71, lon: -74.01 },
  { name: 'Miami', lat: 25.76, lon: -80.19 },
  { name: 'Toronto', lat: 43.65, lon: -79.38 },
  { name: 'Chicago', lat: 41.88, lon: -87.63 },
  // Europa
  { name: 'Lisboa', lat: 38.72, lon: -9.14 },
  { name: 'Madri', lat: 40.42, lon: -3.70 },
  { name: 'Barcelona', lat: 41.39, lon: 2.17 },
  { name: 'Paris', lat: 48.85, lon: 2.35 },
  { name: 'Londres', lat: 51.51, lon: -0.13 },
  { name: 'Roma', lat: 41.90, lon: 12.50 },
  { name: 'Berlim', lat: 52.52, lon: 13.40 },
  { name: 'Amsterdã', lat: 52.37, lon: 4.90 },
  { name: 'Atenas', lat: 37.98, lon: 23.73 },
  { name: 'Moscou', lat: 55.76, lon: 37.62 },
  { name: 'Istambul', lat: 41.01, lon: 28.98 },
  // África
  { name: 'Lagos', lat: 6.52, lon: 3.38 },
  { name: 'Cairo', lat: 30.04, lon: 31.24 },
  { name: 'Joanesburgo', lat: -26.20, lon: 28.05 },
  { name: 'Nairóbi', lat: -1.29, lon: 36.82 },
  { name: 'Casablanca', lat: 33.57, lon: -7.59 },
  // Ásia
  { name: 'Dubai', lat: 25.20, lon: 55.27 },
  { name: 'Mumbai', lat: 19.08, lon: 72.88 },
  { name: 'Nova Délhi', lat: 28.61, lon: 77.21 },
  { name: 'Bangkok', lat: 13.76, lon: 100.50 },
  { name: 'Cingapura', lat: 1.35, lon: 103.82 },
  { name: 'Hong Kong', lat: 22.32, lon: 114.17 },
  { name: 'Xangai', lat: 31.23, lon: 121.47 },
  { name: 'Pequim', lat: 39.90, lon: 116.41 },
  { name: 'Tóquio', lat: 35.68, lon: 139.69 },
  { name: 'Seul', lat: 37.57, lon: 126.98 },
  { name: 'Bali', lat: -8.34, lon: 115.09 },
  // Oceania
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'Melbourne', lat: -37.81, lon: 144.96 },
  { name: 'Auckland', lat: -36.85, lon: 174.76 },
]
