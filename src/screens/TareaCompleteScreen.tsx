import { FC, useEffect, useState } from "react";
import { Alert, Text, View, ActivityIndicator, useWindowDimensions, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SelectDropdown from 'react-native-select-dropdown'
import { openSettings } from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";
import { ImagePickerResponse, launchCamera } from "react-native-image-picker";
import { AppNavigationType } from "../types/navigation_types";
import { askLocationPermission, checkLocationPermission } from "../utils/location";
import { apiURL, colors } from "../constants";
import { CustomButton, CustomInput } from "../components";
import axios from "axios";
import { format } from "date-fns";
import { Visita } from "../types/visita_types";
import { useVisita, useTipoVisita, useUsuario, useTarea } from "../store";
import { LoadingModal } from "../utils/Loading";
import { Linking } from 'react-native';
import { Conexion, OfflineScreen } from "../utils/connectionStatus";

type props = NativeStackScreenProps<AppNavigationType, "tarea_complete">;

export const TareaCompleteScreen: FC<props> = ({ navigation, route }) => {
    const clienteId = route.params.clienteId;
    const tareaId = route.params.tareaId;
    const imagenRequerida = route.params.imagenRequerida;
    const tiposVisita = route.params.tipoVisita;
    const metaCumplir = route.params.meta;
    const requiereMeta = route.params.requiereMeta;
    const metaLineaCumplir = route.params.metaLinea;
    const requiereMetaLinea = route.params.requiereMetaLinea;
    const metaSubLineaCumplir = route.params.metaSublinea;
    const requiereMetaSubLinea = route.params.requiereMetaSubLinea;
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    const [comentario, setComentario] = useState("");
    const [meta, setMeta] = useState("");
    const [metaLinea, setMetaLinea] = useState("");
    const [metaSubLinea, setMetaSubLinea] = useState("");
    const [tempUri, setTempUri] = useState<string>();
    const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();
    const [tipoVisitaId, setTipoVisitaId] = useState<number>();
    const { height } = useWindowDimensions();
    const token = useUsuario(e => e.token);
    const obtenerVisitas = useVisita(e => e.obtenerVisitas);
    const obtenerTareas = useTarea(e => e.obtenerTareas);
    const [isLoading, setIsLoading] = useState(false);
    const offline = OfflineScreen()

    const simulateAsyncTask = () => {
        setIsLoading(true);
        // Simulate an asynchronous task, e.g., fetching data from an API
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

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
                    Alert.alert("Ubicación", "Ocurrio un error .",
                        [{ text: "Ok", onPress: () => { navigation.goBack(); } }]);
                }
            },
            { enableHighAccuracy: true }
        )

        if (longitud === 0 || latitud === 0) {
            setLoading(false);
        }
    }

    const tomarFotografia = () => {
        launchCamera({
            mediaType: "photo",
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.assets) return;

            setTempUri(resp.assets[0].uri);
            setImageResponse(resp);
        });
    }

    const crearVisita = async () => {
        try {
            setGuardando(true)
            if (offline) {
                setGuardando(false)
                Alert.alert("Tarea", "No tienes acceso a internet",
                    [
                        { text: 'Ok', style: 'cancel' }
                    ],
                    { cancelable: false }
                );
                return;
            }

            if (requiereMeta && meta === "") {
                setGuardando(false)
                Alert.alert("Visita", "La meta es obligatorios.");
                return;
            }

            let requiereimagen = false;

            if (imagenRequerida === false && longitud === 0) {
                requiereimagen = true
            } else {
                requiereimagen = imagenRequerida;
            }

            if (requiereimagen && imageResponse === undefined) {
                setGuardando(false)
                Alert.alert("Visita", "La fotografia es obligatoria para la tarea.");
                return;
            }

            let formData = new FormData();

            if (requiereimagen) {
                const fileToUpload = {
                    uri: imageResponse!.assets![0].uri,
                    type: imageResponse!.assets![0].type,
                    name: imageResponse!.assets![0].fileName
                }

                formData.append("imagen", fileToUpload);
            }


            let long = longitud;
            let lat = latitud;
            let com = comentario;

            if (longitud === 0 || latitud === 0) {
                long = 20.215832973903805;
                lat = -55.61826399407612;
                com = "Sin Ubicacion Asesor -" + com;
            }

            formData.append("imagenRequerida", imagenRequerida);
            formData.append("comentario", com);
            formData.append("fecha", format(new Date(), "yyyy-MM-dd H:m"));
            formData.append("latitud", lat);
            formData.append("longitud", long);
            formData.append("meta", meta);
            formData.append("clienteId", clienteId);
            formData.append("tareaId", tareaId);
            formData.append("metaLinea", metaLinea);
            formData.append("metaSubLinea", metaSubLinea);

            await axios.post<Visita>(`${apiURL}/api/v1/movil/tarea/completar`, formData, { headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }, timeout: 60000, });
            await obtenerVisitas(token);
            await obtenerTareas(token);
            setGuardando(false)
            navigation.pop(1);
            Alert.alert("Tarea", "Tarea completada con exito.");
        } catch (err: any) {
            setGuardando(false)
            if (axios.isCancel(err)) {
                console.log('Request cancelled:', err.message);
                Alert.alert("Tarea", "Procedo de completado de tarea cancelado.",
                    [
                        { text: 'Ok', style: 'cancel' },
                    ],
                    { cancelable: false }
                );
            } else if (err.code === 'ECONNABORTED') {
                console.log('Request timed out:', err.message);
                Alert.alert("Tarea", "Verifique su cobertura de internet, tiempo agotado para completar la tarea.",
                    [
                        { text: 'Ok', style: 'cancel' },
                        { text: 'Completar desde el navegador', onPress: () => handleOpenBrowser() },
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Error:', err.message);
                Alert.alert("Tarea", "ocurrio un error y no se pudo registrar la tarea, verifique su cobertura de internet.",
                    [
                        { text: 'Ok', style: 'cancel' },
                        { text: 'Completar desde el navegador', onPress: () => handleOpenBrowser() },
                    ],
                    { cancelable: false }
                );
            }

        }
    }

    const handleOpenBrowser = () => {
        const url = 'http://18.219.36.66/';

        Linking.openURL(url)
            .catch((err) => console.error('Error al abrir la URL:', err));
    };

    useEffect(() => {
        obtenerUbicacionActual();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Completar tarea",
            headerShown: true,
        })
    }, [navigation]);

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Obteniendo ubicación</Text>
            </View>
        )
    }

    if (guardando) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Guardando tarea</Text>
            </View>
        )
    }

    return (
        <ScrollView style={{ padding: 15 }}>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Tipo Visita: </Text>
                <Text style={{ fontSize: 16, marginBottom: 5, color: colors.black }}>{tiposVisita}</Text>
            </View>

            {requiereMeta &&
                <><View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Meta:</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: colors.black }}>{metaCumplir}</Text>


                </View><View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Cantidad de Meta</Text>
                        <CustomInput placeholder="Cantidad de Meta" value={meta} setValue={setMeta} />
                    </View></>
            }

            {requiereMetaLinea &&
                <><View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Meta Linea:</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: colors.black }}>{metaLineaCumplir}</Text>


                </View><View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Cantidad de Meta Linea</Text>
                        <CustomInput placeholder="Cantidad de Meta" value={metaLinea} setValue={setMetaLinea} />
                    </View></>
            }
            {requiereMetaSubLinea &&
                <><View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Meta SubLinea:</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5, color: colors.black }}>{metaSubLineaCumplir}</Text>


                </View><View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Cantidad de Meta SubLinea</Text>
                        <CustomInput placeholder="Cantidad de Meta" value={metaSubLinea} setValue={setMetaSubLinea} />
                    </View></>
            }

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Comentario(*)</Text>
                <CustomInput placeholder="Comentario" value={comentario} setValue={setComentario} />
            </View>

            {(imagenRequerida || longitud === 0) &&
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, color: colors.black }}>Fotografia</Text>
                    <View style={{ height: height * 0.20, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 3 }}>
                        {(tempUri === "" || tempUri === undefined)
                            ? (<TouchableOpacity onPress={() => tomarFotografia()} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Icon name="camera-alt" size={35} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: "bold" }}>Tomar fotografia</Text>
                            </TouchableOpacity>)
                            : (
                                <TouchableOpacity onPress={() => tomarFotografia()} >
                                    <ImageBackground source={{ uri: tempUri }} style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} resizeMode="cover">
                                        <Icon name="camera-alt" size={35} color={colors.white} />
                                        <Text style={{ color: colors.white, fontWeight: "bold" }}>Editar fotografia</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            }

            <View style={{ marginBottom: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, color: colors.black }}>Ubicación</Text>
                <View style={{ height: height * 0.25, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 3 }}>
                    <MapView
                        style={{ width: "100%", height: "100%", borderRadius: 3 }}
                        initialRegion={{ latitude: latitud, longitude: longitud, latitudeDelta: 0, longitudeDelta: 0 }}>
                        <Marker coordinate={{ latitude: latitud, longitude: longitud }} />
                    </MapView>
                </View>
            </View>
            <LoadingModal visible={isLoading} />
            <View style={{ marginBottom: 20 }}>
                <Conexion />
                {/* {longitud != 0 && */}
                <CustomButton text="Completar Tarea" onPress={crearVisita} />
                {/* } */}

                {longitud == 0 &&
                    <>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, color: colors.black }}>No se logro obtener la ubicación, verifique que el GPS este activo o:</Text>
                        <CustomButton text="Completar desde el navegador" onPress={handleOpenBrowser} />
                    </>
                }


            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    dropdown1BtnStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dropdown1BtnTxtStyle: {

        textAlign: 'left'
    },
    dropdown1DropdownStyle: {
        backgroundColor: '#EFEFEF'
    },
    dropdown1RowStyle: {
        backgroundColor: '#EFEFEF',
        borderBottomColor: '#C5C5C5'
    },
    dropdown1RowTxtStyle: {

        textAlign: 'left'
    }
})