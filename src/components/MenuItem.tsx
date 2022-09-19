import React, { FC } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type Props = {
    icon: any
    helperText: string,
}

export const MenuItem: FC<Props> = ({ icon, helperText }) => {

    return (
        <TouchableOpacity style={styles.container} onPress={() => console.log("menu")}>
            <View style={styles.gradientContainer}>
                <Image source={icon} style={styles.iconImage} />
                <Text style={styles.helperText}>{helperText}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 130,
        height: 130,
        borderRadius: 10
    },
    gradientContainer: {
        width: "100%",
        height: 130,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc"
    },
    iconImage: {
        width: 80,
        height: 80,
        resizeMode: "contain"
    },
    helperText: {
        textAlign: "center",
        fontWeight: "bold",
        color: 'black',
        marginTop: 5
    }
});