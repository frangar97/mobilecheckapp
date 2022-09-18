import { Text, View } from "react-native"
import { useUsuario } from "../store/useUsuario"

export const MainMenuScreen = () => {
    const cerrarSesion = useUsuario(e => e.cerrarSesion);

    return (
        <View style={{ flex: 1, backgroundColor: "steelblue", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }} onPress={cerrarSesion}>Menu Principal</Text>
        </View>
    )
}