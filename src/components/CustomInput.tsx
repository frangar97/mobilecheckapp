import React, { FC } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { colors } from '../constants';

type props = {
    value: string,
    setValue: (value: string) => void,
    placeholder: string,
    secureTextEntry?: boolean
    editable?: boolean
}

export const CustomInput: FC<props> = ({ value, setValue, placeholder, secureTextEntry, editable }) => {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                editable={editable}
                style={styles.input}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginVertical: 5,
        flex: 1,
        justifyContent: "space-around",
        padding: 15,
    },
    input: {
        flex: 1
    },
})