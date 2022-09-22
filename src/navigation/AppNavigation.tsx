import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ClienteDetailScreen, ClienteListScreen, MainMenuScreen, VisitaListScreen } from "../screens";
import { AppNavigationType } from "../types/navigation_types";

const Stack = createNativeStackNavigator<AppNavigationType>();

export const AppNavigation = () => {

    return (
        <Stack.Navigator initialRouteName={"mainmenu"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="mainmenu" component={MainMenuScreen} />
            <Stack.Screen name="visita_list" component={VisitaListScreen} />
            <Stack.Screen name="cliente_list" component={ClienteListScreen} />
            <Stack.Screen name="cliente_detail" component={ClienteDetailScreen} />
        </Stack.Navigator>
    )
}