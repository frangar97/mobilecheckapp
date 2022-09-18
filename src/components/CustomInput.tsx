import React, { FC } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { colors } from '../constants';

type props = {
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
    secureTextEntry?: boolean
}

export const CustomInput: FC<props> = ({ value, setValue, placeholder, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5
    }
})