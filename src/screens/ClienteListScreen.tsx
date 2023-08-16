import { FC, useEffect, useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AppNavigationType } from "../types/navigation_types";
import { Cliente } from "../types/cliente_types";
import { colors } from "../constants";
import { useCliente } from "../store";

type props = NativeStackScreenProps<AppNavigationType, "cliente_list">;

export const ClienteListScreen: FC<props> = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const clientes = useCliente(e => e.clientes);
    const [clientesTemporal, setClientesTemporal] = useState<Cliente[]>(clientes);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Clientes",
            headerShown: true,
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("cliente_create")} style={{ width: 30, height: 30, borderColor: "#cccc", borderWidth: 0.5, borderRadius: 4, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>+</Text>
                </TouchableOpacity>),
            headerSearchBarOptions: {
                placeholder: "Buscar cliente",
                onChangeText: (event) => {
                    const text = event.nativeEvent.text;
                    if (text) {
                        const newData = clientes.filter(e => {
                            const itemData = e.nombre ? e.nombre.toUpperCase() : "".toUpperCase();
                            const textData = text.toUpperCase();
                            return itemData.indexOf(textData) > -1;
                        });
                        setClientesTemporal(newData);
                    } else {
                        setClientesTemporal(clientes);
                    }
                }
            }
        })
    }, [navigation]);

    if (clientes.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Icon name='mood-bad' color={colors.primary} size={35} />
                <Text style={{color: colors.black}} >No tiene clientes asignados.</Text>
            </View>
        )
    }

    return (
        <FlashList
            data={clientesTemporal}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { navigation.navigate("cliente_detail", { cliente: item }) }} style={{ width: width * 0.9, alignSelf: "center", borderWidth: 0.5, backgroundColor: colors.white, padding: 15, marginTop: 8, borderRadius: 3, borderColor: "#cccc" }}>
                    <Text style={{color: colors.black}}>{item.nombre}</Text>
                </TouchableOpacity>)}
            estimatedItemSize={clientes.length}
        />
    )
}