import { useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { openSettings } from "react-native-permissions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MenuItem } from "../components";
import { useUsuario, useCliente, useTipoVisita, useVisita, useTarea } from '../store';
import { colors, icons, images } from "../constants";
import { askLocationPermission, checkLocationPermission } from "../utils/location";

export const MainMenuScreen = () => {
    const cerrarSesion = useUsuario(e => e.cerrarSesion);
    const token = useUsuario(e => e.token);
    const obtenerClientes = useCliente(e => e.obtenerClientes);
    const obtenerTiposVisita = useTipoVisita(e => e.obtenerTiposVisita);
    const obtenerVisitas = useVisita(e => e.obtenerVisitas);
    const obtenerTareas = useTarea(e => e.obtenerTareas);

    const verificarPermisos = async () => {
        let permiso = await checkLocationPermission();

        if (permiso === "blocked") {
            openSettings();
        }

        if (permiso === "denied") {
            await askLocationPermission();
        }
    }

    const verificarCerrarSesion = () => {
        Alert.alert("Cerrar sesión", "¿Esta seguro de cerrar sesión?",
            [{ text: "Si", onPress: () => { cerrarSesion() } }, { text: "No" }])
    }

    const verificarActualizacionDatos = () => {
        Alert.alert("Actualización", "¿Esta seguro de actualizar información del dispositivo?",
            [{
                text: "Si", onPress: () => {
                    obtenerClientes(token);
                    obtenerTiposVisita(token);
                    obtenerVisitas(token);
                    obtenerTareas(token);
                }
            }, { text: "No" }])
    }

    useEffect(() => {
        verificarPermisos();
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ width: "95%", marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignSelf: "center" }}>
                <TouchableOpacity onPress={verificarCerrarSesion}>
                    <Icon name='logout' color={colors.primary} size={35} />
                </TouchableOpacity>
                <TouchableOpacity onPress={verificarActualizacionDatos}>
                    <Icon name='autorenew' color={colors.primary} size={35} />
                </TouchableOpacity>
            </View>
            <View style={styles.headerContainer}>
                <Image source={images.logo} style={styles.welcomeImage} />
            </View>
            <View style={styles.menuContainer}>
                <View style={[styles.rowMenu, { marginBottom: 80 }]}>
                    <MenuItem helperText="Dashboard" icon={icons.dashboard} route="dashboard" />
                    <MenuItem helperText="Clientes" icon={icons.clients} route="cliente_list" />
                </View>
                <View style={styles.rowMenu}>
                    <MenuItem helperText="Visitas" icon={icons.visit} route="visita_list" />
                    <MenuItem helperText="Tareas" icon={icons.task} route="tarea_list" />
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1
    },
    headerContainer: {
        flex: 1 / 2,
        alignItems: "center",
    },
    menuContainer: {
        backgroundColor: colors.primary,
        flex: 1,
        justifyContent: "center",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    welcomeImage: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
        //marginTop: 20
    },
    rowMenu: {
        flexDirection: "row",
        justifyContent: "space-around",
    }
})