// Sentry ANTES de tudo — arma o crash handler antes da avaliação dos módulos do
// App, para capturar crashes de boot (firebase/providers) que hoje escapam.
import './src/instrument';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

// Importado ANTES do App: registra o listener de `beforeinstallprompt` no início
// do bundle. O evento dispara uma única vez e não se repete — se esperássemos o
// botão montar, ele já teria passado e a instalação do PWA nunca funcionaria.
import './src/utils/pwaInstall';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
