import { FC, useEffect, useState } from "react";
import { Text, TouchableOpacity, FlatList, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppNavigationType } from "../types/navigation_types";
import { useUsuario } from "../store/useUsuario";
import axios from "axios";
import { Cliente } from "../types/cliente_types";
import { apiURL, colors } from "../constants";

type props = NativeStackScreenProps<AppNavigationType, "cliente_list">;

export const ClienteListScreen: FC<props> = ({ navigation }) => {
    const token = useUsuario(e => e.token);
    const { width } = useWindowDimensions();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clientesTemporal, setClientesTemporal] = useState<Cliente[]>([]);

    const obtenerClientes = async () => {
        try {
            const request = await axios.get<Cliente[]>(`${apiURL}/api/v1/movil/cliente`, { headers: { "Authorization": `Bearer ${token}` } });
            const data = request.data;
            setClientes(data);
            setClientesTemporal(data);
        } catch (err) {
            setClientes([]);
            setClientesTemporal([]);
        }
    }

    useEffect(() => {
        obtenerClientes();
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Clientes",
            headerShown: true,
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 30, height: 30, borderColor: "#cccc", borderWidth: 0.5, borderRadius: 4, justifyContent: "center", alignItems: "center" }}>
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

    return (
        <FlatList
            data={clientesTemporal}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (<TouchableOpacity style={{ width: width * 0.9, alignSelf: "center", borderWidth: 0.5, backgroundColor: colors.white, padding: 15, marginTop: 8, borderRadius: 3, borderColor: "#cccc" }}>
                <Text>{item.nombre}</Text>
            </TouchableOpacity>)}
        />
    )
}