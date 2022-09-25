import { FC, useEffect, useState } from 'react';
import { Alert, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from "react-native-maps";
import { openSettings } from 'react-native-permissions';
import { ScrollView } from 'react-native-gesture-handler';
import { AppNavigationType } from '../types/navigation_types';
import Geolocation from '@react-native-community/geolocation';
import { askLocationPermission, checkLocationPermission } from '../utils/location';


type props = NativeStackScreenProps<AppNavigationType, "cliente_create">;

export const ClienteCreateScreen: FC<props> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    const { height } = useWindowDimensions();

    const obtenerUbicacionActual = async () => {
        let permiso = await checkLocationPermission();

        if (permiso === "blocked") {
            openSettings();
        }

        if (permiso === "denied") {
            permiso = await askLocationPermission();
        }

        if (permiso === "denied" || permiso === "blocked") {
            Alert.alert("Ubicación", "Por favor otorge permisos de ubicación para poder usar esta función.",
                [{ text: "Ok", onPress: () => { navigation.goBack(); } }]);
        }

        Geolocation.getCurrentPosition(
            (position) => {
                setLatitud(position.coords.latitude);
                setLongitud(position.coords.longitude);
                setLoading(false);
            },
            (err) => {
                if (err.PERMISSION_DENIED === 1) {
                    Alert.alert("Ubicación", "Por favor active la ubicación del dispositivo para poder usar esta función.",
                        [{ text: "Ok", onPress: () => { navigation.goBack(); } }]);
                }
            },
            { enableHighAccuracy: true }
        )
    }

    useEffect(() => {
        obtenerUbicacionActual();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Crear Cliente",
            headerShown: true,
        });
    }, [navigation]);

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator />
                <Text>Obteniendo ubicación</Text>
            </View>
        )
    }

    return (
        <ScrollView style={{ padding: 15 }}>
            <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Ubicación</Text>
                <View style={{ height: height * 0.30, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 3 }}>
                    <MapView
                        style={{ width: "100%", height: "100%", borderRadius: 3 }}
                        initialRegion={{ latitude: latitud, longitude: longitud, latitudeDelta: 0, longitudeDelta: 0 }}>
                        <Marker coordinate={{ latitude: latitud, longitude: longitud }} />
                    </MapView>
                </View>
            </View>
        </ScrollView>
    )
}