import axios from "axios";
import { useState } from "react";
import { Alert, Image, StyleSheet, useWindowDimensions, View } from "react-native"
import { CustomButton, CustomInput } from "../components";
import { apiURL, images } from "../constants";
import { useVisita, useUsuario, useCliente, useTipoVisita, useTarea } from "../store";

export const LoginScreen = () => {
    const guardarUsuario = useUsuario(e => e.guardarUsuario);
    const obtenerClientes = useCliente(e => e.obtenerClientes);
    const obtenerTiposVisita = useTipoVisita(e => e.obtenerTiposVisita);
    const obtenerVisitas = useVisita(e => e.obtenerVisitas);
    const obtenerTareas = useTarea(e => e.obtenerTareas);
    const { height } = useWindowDimensions();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");

    const iniciarSesion = async () => {
        try {
            if (usuario === "" || password === "") {
                Alert.alert("Inicio Sesión", "Por favor llene todos los campos para poder iniciar sesión.");
                return;
            }

            const request = await axios.post<{ usuario: string, token: string }>(`${apiURL}/api/v1/movil/login`, { usuario, password });
            const data = request.data;
            obtenerTiposVisita(data.token);
            obtenerClientes(data.token);
            obtenerVisitas(data.token);
            obtenerTareas(data.token);
            guardarUsuario(data.usuario, data.token);
        } catch (err:any) {
            Alert.alert("Inicio Sesión", "Ocurrio un error y no se pudo iniciar sesión.");
        }
    }

    return (
        <View style={styles.root}>
            <Image source={images.logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
            <CustomInput placeholder="usuario" value={usuario} setValue={setUsuario} />
            <CustomInput placeholder="password" value={password} setValue={setPassword} secureTextEntry />
            <CustomButton text="Iniciar Sesión" onPress={iniciarSesion} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: "70%",
        maxWidth: 300,
        maxHeight: 300,
    }
});