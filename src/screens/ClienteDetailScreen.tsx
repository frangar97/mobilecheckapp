import { FC, useEffect } from 'react';
import { Text, View, ScrollView, useWindowDimensions } from 'react-native';
// import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppNavigationType } from '../types/navigation_types';
import { colors } from '../constants';


type props = NativeStackScreenProps<AppNavigationType, "cliente_detail">;

export const ClienteDetailScreen: FC<props> = ({ route, navigation }) => {
    const { height } = useWindowDimensions();
    const { cliente } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Cliente",
            headerShown: true,
        })
    }, [navigation]);

    return (
        <ScrollView>
            <View style={{ height: height * 0.20, width: "100%", backgroundColor: colors.primary }}>
                <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 18, bottom: 15, left: 10, position: "absolute" }}>{cliente.nombre}</Text>
            </View>
            <View style={{ padding: 15 }}>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.black }}>Dirección</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.black }}>{cliente.direccion == "" ? "No disponible" : cliente.direccion}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.black }}>Telefono</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.black }}>{cliente.telefono == "" ? "No disponible" : cliente.telefono}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.black }}>Email</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: colors.black }}>{cliente.email == "" ? "No disponible" : cliente.email}</Text>
                </View>
                {/* <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color: colors.black }}>Ubicación</Text>
                    <View style={{ height: height*0.30, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 3 }}>
                        <MapView
                            style={{ width: "100%", height: "100%", borderRadius: 3 }}
                            initialRegion={{ latitude: cliente.latitud, longitude: cliente.longitud, latitudeDelta: 0, longitudeDelta: 0 }}>
                            <Marker coordinate={{ latitude: cliente.latitud, longitude: cliente.longitud }} />
                        </MapView>
                    </View>
                </View> */}
            </View>
        </ScrollView>
    )
}