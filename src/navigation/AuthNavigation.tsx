import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen } from "../screens";

const Stack = createNativeStackNavigator();

export const AuthNavigation = () => {
    return (
        <Stack.Navigator initialRouteName={"login"} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    )
}