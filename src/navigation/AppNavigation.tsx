import { createStackNavigator } from "@react-navigation/stack"
import { MainMenuScreen, VisitaListScreen } from "../screens";
import { AppNavigationType } from "../types/navigationTypes";

const Stack = createStackNavigator<AppNavigationType>();

export const AppNavigation = () => {

    return (
        <Stack.Navigator initialRouteName={"mainmenu"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="mainmenu" component={MainMenuScreen} />
            <Stack.Screen name="visita_list" component={VisitaListScreen} />
        </Stack.Navigator>
    )
}