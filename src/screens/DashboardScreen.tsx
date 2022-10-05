import { Text, View, ScrollView, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from '../constants';
import { useCliente } from '../store/useCliente';
import { useUsuario } from '../store/useUsuario';
import { useVisita } from '../store/useVisita';

export const DashboardScreen = () => {
    const usuario = useUsuario(e => e.usuario);
    const clientes = useCliente(e => e.clientes);
    const visitas = useVisita(e => e.visitas);

    return (
        <ScrollView style={{ padding: 15 }}>
            <View>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 30 }}>Bienvenido</Text>
                <Text style={{ color: "black", fontSize: 18 }}>{usuario}</Text>
            </View>
            <View style={style.cardContainer}>
                <View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Clientes asignados</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>{clientes.length}</Text>
                </View>
                <Icon name='person-outline' color={colors.primary} size={35} />
            </View>
            <View style={style.cardContainer}>
                <View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Visitas del dia</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>{visitas.length}</Text>
                </View>
                <Icon name='add-business' color={colors.primary} size={35} />
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.white,
        marginTop: 20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: "#c1c1c1",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});