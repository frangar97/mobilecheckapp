import { FC, useEffect, useState } from 'react';
import { Alert, Text, View, useWindowDimensions, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { openSettings } from 'react-native-permissions';
import { AppNavigationType } from '../types/navigation_types';
import { askLocationPermission, checkLocationPermission } from '../utils/location';
import { CustomButton, CustomInput } from "../components";
import { useUsuario } from '../store/useUsuario';
import { apiURL, colors } from '../constants';
import { Cliente } from '../types/cliente_types';
import { useCliente } from '../store/useCliente';


type props = NativeStackScreenProps<AppNavigationType, "cliente_create">;

export const ClienteCreateScreen: FC<props> = ({ navigation }) => {
    const token = useUsuario(e => e.token);
    const guardarCliente = useCliente(e => e.guardarCliente);
    const [loading, setLoading] = useState(true);
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [direccion, setDireccion] = useState("");
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
                [{ text: "Ok", onPress: () => { openSettings(); } }]);
            return;
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

    const crearCliente = async () => {
        try {
            const request = await axios.post<Cliente>(`${apiURL}/api/v1/movil/cliente`, { nombre, direccion, telefono, email, latitud, longitud }, { headers: { "Authorization": `Bearer ${token}` } });
            const data = request.data;
            await guardarCliente(data);
            Alert.alert("Cliente", "El cliente ha sido creado con exito.");
            navigation.goBack();
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Ha ocurrido un error y no se pudo crear el cliente.");
        }
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
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Obteniendo ubicación</Text>
            </View>
        )
    }

    return (
        <ScrollView style={{ padding: 15 }}>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nombre</Text>
                <CustomInput placeholder="Nombre" value={nombre} setValue={setNombre} />
            </View>
            <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Telefono</Text>
                <CustomInput placeholder="Telefono" value={telefono} setValue={setTelefono} />
            </View>
            <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Email</Text>
                <CustomInput placeholder="Email" value={email} setValue={setEmail} />
            </View>
            <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Dirección</Text>
                <CustomInput placeholder="Dirección" value={direccion} setValue={setDireccion} />
            </View>
            <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>Ubicación</Text>
                <View style={{ height: height * 0.25, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 3 }}>
                    <MapView
                        style={{ width: "100%", height: "100%", borderRadius: 3 }}
                        initialRegion={{ latitude: latitud, longitude: longitud, latitudeDelta: 0, longitudeDelta: 0 }}>
                        <Marker coordinate={{ latitude: latitud, longitude: longitud }} />
                    </MapView>
                </View>
            </View>
            <View style={{ marginBottom: 10 }}>
                <CustomButton text="Guardar Cliente" onPress={crearCliente} />
            </View>
        </ScrollView>
    )
}