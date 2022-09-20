import { View, StyleSheet, Image } from "react-native";
import { MenuItem } from "../components";
import { colors, icons } from "../constants";

export const MainMenuScreen = () => {

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={icons.visit} style={styles.welcomeImage} />
            </View>
            <View style={styles.menuContainer}>
                <View style={[styles.rowMenu, { marginBottom: 80 }]}>
                    <MenuItem helperText="Dashboard" icon={icons.dashboard} route="visita_list" />
                    <MenuItem helperText="Clientes" icon={icons.clients} route="visita_list" />
                </View>
                <View style={styles.rowMenu}>
                    <MenuItem helperText="Visitas" icon={icons.visit} route="visita_list" />
                    <MenuItem helperText="Tareas" icon={icons.task} route="visita_list" />
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        flex: 1
    },
    headerContainer: {
        flex: 1 / 2,
        alignItems: "center",
    },
    menuContainer: {
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    welcomeImage: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
        marginTop: 20
    },
    rowMenu: {
        flexDirection: "row",
        justifyContent: "space-around",
    }
})