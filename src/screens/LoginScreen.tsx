import axios from "axios";
import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import { CustomButton, CustomInput } from "../components";
import { apiURL, colors, images } from "../constants";
import { useVisita, useUsuario, useCliente, useTipoVisita, useTarea, useAccesosWeb } from "../store";
import { OfflineScreen } from "../utils/connectionStatus";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';

export const LoginScreen = () => {
    const guardarUsuario = useUsuario(e => e.guardarUsuario);
    const obtenerClientes = useCliente(e => e.obtenerClientes);
    //const obtenerTiposVisita = useTipoVisita(e => e.obtenerTiposVisita);
    const obtenerVisitas = useVisita(e => e.obtenerVisitas);
    const obtenerTareas = useTarea(e => e.obtenerTareas);
    const obtenerAccesosWeb = useAccesosWeb(e => e.obtenerAccesos);
    const { height } = useWindowDimensions();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const Offline = OfflineScreen()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const iniciarSesion = async () => {
        try {
            if (usuario === "" || password === "") {
                Alert.alert("Inicio Sesión", "Por favor llene todos los campos para poder iniciar sesión.");
                return;
            }

            const request = await axios.post<{ usuario: string, token: string }>(`${apiURL}/api/v1/movil/login`, { usuario, password });
            const data = request.data;
            //obtenerTiposVisita(data.token);
            obtenerClientes(data.token);
            obtenerVisitas(data.token);
            obtenerTareas(data.token);
            obtenerAccesosWeb(data.token);
            guardarUsuario(data.usuario, data.token);
        } catch (err) {
            Alert.alert("Inicio Sesión", "Ocurrio un error y no se pudo iniciar sesión.");
        }
    }

    const customProps: KeyboardAwareScrollViewProps = {
        extraHeight: 50,
        // ... other props
      };

    return (
        <KeyboardAwareScrollView  {...customProps} >
        <View style={styles.root}>
            <Image source={images.logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
            {Offline ? <Text>Sin Acceso a internet</Text> : <Text>Conectado</Text>}
            <CustomInput placeholder="usuario" value={usuario} setValue={setUsuario} />
          {/* <CustomInput placeholder="password" value={password} setValue={setPassword} secureTextEntry /> */}

            <View style={styles.container}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={styles.input}
                />
                    <Pressable style={styles.iconContainer} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={25} />
                    </Pressable>

            </View>
            <CustomButton text="Iniciar Sesión" onPress={iniciarSesion} />
        </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
    },
    logo: {
        width: "70%",
        maxWidth: 300,
        maxHeight: 300,
    },
    container: {
        backgroundColor: colors.white,
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,        
        marginBottom: 10,
        paddingHorizontal: 10,
        marginVertical: 5
      },
      input: {
        flex: 1,
      },
      iconContainer: {
        padding: 10,
      }
});