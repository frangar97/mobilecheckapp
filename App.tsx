import { useEffect } from 'react';
import { SafeAreaView, LogBox } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from './src/navigation/AppNavigation';
import { useUsuario } from './src/store/useUsuario';
import { AuthNavigation } from './src/navigation/AuthNavigation';
import { enableLatestRenderer } from 'react-native-maps';
import { useCliente } from './src/store/useCliente';
import { useTipoVisita } from './src/store/useTipoVisita';
import SplashScreen from 'react-native-splash-screen';
LogBox.ignoreAllLogs();
enableLatestRenderer();

const App = () => {
  const { sesionActiva, _hasHydrated, token } = useUsuario();
  const obtenerClientes = useCliente(e => e.obtenerClientes);
  const obtenerTiposVisita = useTipoVisita(e => e.obtenerTiposVisita);

  useEffect(() => {
    if (_hasHydrated && sesionActiva) {
      obtenerTiposVisita(token);
      obtenerClientes(token);
      SplashScreen.hide();
    }

    if (_hasHydrated && !sesionActiva) {
      SplashScreen.hide();
    }
  }, [_hasHydrated, sesionActiva]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {sesionActiva ? <AppNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaView>
  );
};


export default App;
