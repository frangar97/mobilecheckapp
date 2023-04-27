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

type props = NativeStackScreenProps<AppNavigationType, "tarea_complete">;

export const TareaCompleteScreen: FC<props> = ({ navigation, route }) => {
    const clienteId = route.params.clienteId;
    const tareaId = route.params.tareaId;
    const imagenRequerida = route.params.imagenRequerida;
    const tiposVisita = route.params.tipoVisita;
    const metaCumplir = route.params.meta;
    const requiereMeta = route.params.requiereMeta;
    const [loading, setLoading] = useState(true);
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);
    const [comentario, setComentario] = useState("");
    const [meta, setMeta] = useState("");
    const [tempUri, setTempUri] = useState<string>();
    const [imageResponse, setImageResponse] = useState<ImagePickerResponse>();
    const [tipoVisitaId, setTipoVisitaId] = useState<number>();
    const { height } = useWindowDimensions();
    const token = useUsuario(e => e.token);
    const obtenerVisitas = useVisita(e => e.obtenerVisitas);
    const obtenerTareas = useTarea(e => e.obtenerTareas);

    console.log(imagenRequerida)

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
             if ( requiereMeta  && meta === "") {
                 Alert.alert("Visita", "La meta es obligatorios.");
                 return;
             }

            if (imagenRequerida && imageResponse === undefined) {
                Alert.alert("Visita", "La fotografia es obligatoria para la tarea.");
                return;
            }

            let formData = new FormData();

            if (imagenRequerida) {
                const fileToUpload = {
                    uri: imageResponse!.assets![0].uri,
                    type: imageResponse!.assets![0].type,
                    name: imageResponse!.assets![0].fileName
                }

                formData.append("imagen", fileToUpload);
            }

            formData.append("imagenRequerida", imagenRequerida);
            formData.append("comentario", comentario);
            formData.append("fecha", format(new Date(), "yyyy-MM-dd h:m"));
            formData.append("latitud", latitud);
            formData.append("longitud", longitud);
            formData.append("meta", meta);
            formData.append("clienteId", clienteId);
            formData.append("tareaId", tareaId);

            await axios.post<Visita>(`${apiURL}/api/v1/movil/tarea/completar`, formData, { headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
            await obtenerVisitas(token);
            await obtenerTareas(token);
            navigation.pop(1);
            Alert.alert("Tarea", "Tarea completada con exito.");
        } catch (err: any) {
            console.log(err)
            Alert.alert("Tarea", "ocurrio un error y no se pudo registrar la tarea.");
        }
    }

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

    return (
        <ScrollView style={{ padding: 15 }}>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", }}>Tipo Visita: </Text>
                <Text style={{ fontSize: 16, marginBottom: 5 }}>{tiposVisita}</Text>
            </View>

            {requiereMeta &&
                <><View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>Meta:</Text>
                    <Text style={{ fontSize: 16, marginBottom: 5 }}>{metaCumplir}</Text>


                </View><View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Cantidad de Meta</Text>
                        <CustomInput placeholder="Cantidad de Meta" value={meta} setValue={setMeta} />
                    </View></>
            }

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Comentario</Text>
                <CustomInput placeholder="Comentario" value={comentario} setValue={setComentario} />
            </View>

            {imagenRequerida &&
                <View style={{ marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>Fotografia</Text>
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
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>Ubicación</Text>
                <View style={{ height: height * 0.25, width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 3 }}>
                    <MapView
                        style={{ width: "100%", height: "100%", borderRadius: 3 }}
                        initialRegion={{ latitude: latitud, longitude: longitud, latitudeDelta: 0, longitudeDelta: 0 }}>
                        <Marker coordinate={{ latitude: latitud, longitude: longitud }} />
                    </MapView>
                </View>
            </View>
            <View style={{ marginBottom: 20 }}>
                <CustomButton text="Completar Tarea" onPress={crearVisita} />
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