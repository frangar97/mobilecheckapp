import { FC, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/MaterialIcons";
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";
import { AppNavigationType } from '../types/navigation_types';
import { useTarea } from '../store';
import { colors } from '../constants';

type props = NativeStackScreenProps<AppNavigationType, "tarea_list">

export const TareaListScreen: FC<props> = ({ navigation }) => {
    const tareas = useTarea(e => e.tareas);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Tareas del dia",
            headerShown: true,
        })
    }, [navigation]);

    if (tareas.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Icon name='mood' color={colors.primary} size={35} />
                <Text>No tiene tareas para el dia de hoy.</Text>
            </View>
        )
    }


    return (
        <FlashList
            data={tareas}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity style={style.cardContainer}>
                    <View>
                        <Text style={{ color: "black", fontWeight: "bold" }}>{item.cliente}</Text>
                        <Text style={{ color: "black" }}>{format(new Date(item.fecha), "hh:mm a")}</Text>
                    </View>
                    <Icon name={item.completada ? "check-circle-outline" : "alarm"} color={item.completada ? "green" : "orange"} size={30} />
                </TouchableOpacity>)}
            estimatedItemSize={tareas.length}
        />
    )
}

const style = StyleSheet.create({
    cardContainer: {
        width: "95%",
        alignSelf: "center",
        backgroundColor: colors.white,
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: "#c1c1c1",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});