import { createStackNavigator } from "@react-navigation/stack"
import { LoginScreen } from "../screens";

const Stack = createStackNavigator();

export const AuthNavigation = () => {
    return (
        <Stack.Navigator initialRouteName={"login"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    )
}