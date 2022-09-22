import { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import openMap from "react-native-open-maps";
import { AppNavigationType } from '../types/navigation_types';
import { colors } from '../constants';

type props = NativeStackScreenProps<AppNavigationType, "cliente_detail">;

export const ClienteDetailScreen: FC<props> = ({ route, navigation }) => {
    const { cliente } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Cliente",
            headerShown: true,
        })
    }, [navigation]);

    const openAppMap = () => {
        openMap({
            latitude: cliente.latitud,
            longitude: cliente.longitud,
            zoom: 19,
            query: cliente.nombre,
        });
    };

    return (
        <>
            <View style={{ height: "25%", width: "100%", backgroundColor: colors.primary }}>
                <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 18, bottom: 15, left: 10, position: "absolute" }}>{cliente.nombre}</Text>
            </View>
            <View style={{ padding: 15 }}>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dirección</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{cliente.direccion == "" ? "No disponible" : cliente.direccion}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Telefono</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{cliente.telefono == "" ? "No disponible" : cliente.telefono}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Email</Text>
                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>{cliente.email == "" ? "No disponible" : cliente.email}</Text>
                </View>
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Ubicación</Text>
                    <MapView
                        onPress={openAppMap}
                        style={{ height: 130, width: "100%", }}
                        initialRegion={{ latitude: cliente.latitud, longitude: cliente.longitud, latitudeDelta: 0, longitudeDelta: 0 }}>
                        <Marker coordinate={{ latitude: cliente.latitud, longitude: cliente.longitud }} />
                    </MapView>
                </View>
            </View>
        </>
    )
}