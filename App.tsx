import React, { useEffect } from 'react';
import { SafeAreaView, LogBox, Text } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from './src/navigation/AppNavigation';
import { AuthNavigation } from './src/navigation/AuthNavigation';
// import { enableLatestRenderer } from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen';
import { useUsuario } from './src/store/useUsuario';
import { SafeAreaProvider } from 'react-native-safe-area-context';
//import { useAccesosWeb } from './src/store/accesos';
LogBox.ignoreAllLogs();
//  enableLatestRenderer();

const App = () => {
  const { sesionActiva, _hasHydrated, token } = useUsuario();
  // const obtenerClientes = useCliente(e => e.obtenerClientes);
  // const obtenerTiposVisita = useTipoVisita(e => e.obtenerTiposVisita);
  // const obtenerVisitas = useVisita(e => e.obtenerVisitas);
  // const obtenerTareas = useTarea(e => e.obtenerTareas);
  // const obtenerAccesosWeb = useAccesosWeb(e => e.obtenerAccesos);

  useEffect(() => {
    if (_hasHydrated && sesionActiva) {
      // obtenerTiposVisita(token);
      // obtenerClientes(token);
      // obtenerVisitas(token);
      // obtenerTareas(token);
      // obtenerAccesosWeb(token)
      SplashScreen.hide();
    }

    if (_hasHydrated && !sesionActiva) {
      SplashScreen.hide();
    }
  }, [_hasHydrated, sesionActiva]);

  return (
    <SafeAreaProvider >
      <NavigationContainer>
      {sesionActiva ? <AppNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};


export default App;
