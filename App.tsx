import { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from './src/navigation/AppNavigation';
import { useUsuario } from './src/store/useUsuario';
import { AuthNavigation } from './src/navigation/AuthNavigation';
import { enableLatestRenderer } from 'react-native-maps';
import { useCliente } from './src/store/useCliente';
enableLatestRenderer();

const App = () => {
  const { sesionActiva, _hasHydrated, token } = useUsuario();
  const obtenerClientes = useCliente(e => e.obtenerClientes);

  useEffect(() => {
    if (_hasHydrated && sesionActiva) {
      obtenerClientes(token);
    }
  }, [_hasHydrated, sesionActiva]);

  if (!_hasHydrated) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Verificando sesión</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {sesionActiva ? <AppNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaView>
  );
};


export default App;
