import { FC } from "react"
import { Pressable, StyleSheet, Text } from "react-native"
import { colors } from "../constants"

type props = {
    text: string
    onPress: () => void
}

export const CustomButton: FC<props> = ({ onPress, text }) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        width: "100%",
        padding: 15,
        marginVertical: 5,
        alignItems: "center",
        borderRadius: 5
    },
    text: {
        fontWeight: "bold",
        color: colors.white
    }
})