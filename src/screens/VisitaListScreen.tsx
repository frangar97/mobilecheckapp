import { FC, useEffect } from 'react';
import { useWindowDimensions, Text, TouchableOpacity, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/MaterialIcons";
import { VisitaCard } from '../components';
import { AppNavigationType } from '../types/navigation_types';
import { FlashList } from '@shopify/flash-list';
import { useVisita } from '../store';
import { colors } from '../constants';

type props = NativeStackScreenProps<AppNavigationType, "visita_list">

export const VisitaListScreen: FC<props> = ({ navigation }) => {
    const visitas = useVisita(e => e.visitas);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Visitas",
            headerShown: true,
            // headerRight: () => (
            //     <TouchableOpacity onPress={() => navigation.navigate("visita_cliente_list")} style={{ width: 30, height: 30, borderColor: "#cccc", borderWidth: 0.5, borderRadius: 4, justifyContent: "center", alignItems: "center" }}>
            //         <Text style={{ fontSize: 20 }}>+</Text>
            //     </TouchableOpacity>),
        })
    }, [navigation]);

    if (visitas.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Icon name='mood-bad' color={colors.primary} size={35} />
                <Text>Aún no se han registrado visitas para el dia de hoy.</Text>
            </View>
        )
    }


    return (
        <FlashList
            data={visitas}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (<VisitaCard visita={item} height={height} width={width} />)}
            estimatedItemSize={visitas.length}
        />
    )
}