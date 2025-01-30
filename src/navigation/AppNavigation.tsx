import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AppNavigationType } from "../types/navigation_types";
import { DashboardScreen } from "../screens/DashboardScreen";
import { MainMenuScreen } from "../screens/MainMenuScreen";
import { ClienteCreateScreen, ClienteDetailScreen, ClienteListScreen, TareaCompleteScreen, TareaListScreen, VisitaClienteListScreen,  VisitaListScreen } from "../screens";

const Stack = createNativeStackNavigator<AppNavigationType>();

export const AppNavigation = () => {

    return (
        <Stack.Navigator initialRouteName={"mainmenu"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" component={DashboardScreen} />
           <Stack.Screen name="mainmenu" component={MainMenuScreen} />
           {/* <Stack.Screen name="visita_list" component={VisitaListScreen} />
            <Stack.Screen name="visita_cliente_list" component={VisitaClienteListScreen} />
           
            <Stack.Screen name="cliente_list" component={ClienteListScreen} />
            <Stack.Screen name="cliente_detail" component={ClienteDetailScreen} />
            <Stack.Screen name="cliente_create" component={ClienteCreateScreen} /> */}
            <Stack.Screen name="tarea_list" component={TareaListScreen} />
            <Stack.Screen name="tarea_complete" component={TareaCompleteScreen} />
             {/* <Stack.Screen name="visita_create" component={VisitaCreateScreen} /> */}
        </Stack.Navigator>
    )
}