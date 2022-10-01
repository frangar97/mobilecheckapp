import React, { FC } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppNavigationType } from "../types/navigation_types"
import { colors } from "../constants"

type Props = {
    icon: any
    helperText: string,
    route: keyof AppNavigationType
}

export const MenuItem: FC<Props> = ({ icon, helperText, route }) => {
    const navigate = useNavigation<NativeStackNavigationProp<AppNavigationType>>();

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigate.navigate(route)}>
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
        color: colors.white,
        marginTop: 5
    }
});