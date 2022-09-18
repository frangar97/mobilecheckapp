import { ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from './src/navigation/AppNavigation';
import { useUsuario } from './src/store/useUsuario';
import { AuthNavigation } from './src/navigation/AuthNavigation';


const App = () => {
  const { sesionActiva, _hasHydrated } = useUsuario();

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
