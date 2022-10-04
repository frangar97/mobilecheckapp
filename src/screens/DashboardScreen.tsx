import { Text, View, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from '../constants';
import { useCliente } from '../store/useCliente';
import { useUsuario } from '../store/useUsuario';

export const DashboardScreen = () => {
    const usuario = useUsuario(e => e.usuario);
    const clientes = useCliente(e => e.clientes);

    return (
        <ScrollView style={{ padding: 15 }}>
            <View>
                <Text style={{ color: "black", fontWeight: "bold", fontSize: 30 }}>Bienvenido</Text>
                <Text style={{ color: "black", fontSize: 18 }}>{usuario}</Text>
            </View>
            <View style={{ backgroundColor:colors.white,marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 5, borderColor: "#c1c1c1", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                    <Text style={{ color: "black", fontWeight: "bold" }}>Clientes asignados</Text>
                    <Text style={{ color: "black", fontSize: 25 }}>{clientes.length}</Text>
                </View>
                <Icon name='person-outline' color={colors.primary} size={35} />
            </View>
        </ScrollView>
    )
}