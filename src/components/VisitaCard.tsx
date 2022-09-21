import { FC } from "react";
import { ImageBackground, Text, View, StyleSheet } from 'react-native'
import { colors } from "../constants";
import { Visita } from "../types/visita_types";

type props = {
    visita: Visita,
    height: number,
    width: number
}

export const VisitaCard: FC<props> = ({ visita, height, width }) => {

    return (
        <ImageBackground source={{ uri: visita.imagen }} imageStyle={{ borderRadius: 6 }} style={{ height: height * 0.4, width: width * 0.9, alignSelf: "center", marginTop: 10 }} resizeMode="cover">
            <View style={styles.container}>
                <Text style={{ color: colors.white, fontWeight: "bold" }}>{visita.comentario}</Text>
                <View style={[styles.visitContainer, { borderLeftColor: visita.color, }]}>
                    <Text style={styles.visitTypeTxt}>{visita.tipoVisita}</Text>
                    <Text style={styles.visitClientTxt}>{visita.cliente}</Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: 'rgba(0,0,0,0.55)',
        padding: 10,
        borderRadius: 6
    },
    visitContainer: {
        width: "100%",
        height: 50,
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        borderLeftWidth: 5
    },
    visitTypeTxt: {
        fontSize: 15,
        color: colors.white,
        fontWeight: "bold",
        marginLeft: 7
    },
    visitClientTxt: {
        fontSize: 18,
        color: colors.white,
        fontWeight: "bold",
        marginLeft: 7
    }
});