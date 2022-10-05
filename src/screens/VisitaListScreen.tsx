import { FC, useEffect } from 'react';
import { useWindowDimensions, Text, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VisitaCard } from '../components';
import { AppNavigationType } from '../types/navigation_types';
import { FlashList } from '@shopify/flash-list';
import { useVisita } from '../store';

type props = NativeStackScreenProps<AppNavigationType, "visita_list">

export const VisitaListScreen: FC<props> = ({ navigation }) => {
    const visitas = useVisita(e => e.visitas);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "Visitas",
            headerShown: true,
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("visita_cliente_list")} style={{ width: 30, height: 30, borderColor: "#cccc", borderWidth: 0.5, borderRadius: 4, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>+</Text>
                </TouchableOpacity>),
        })
    }, [navigation]);


    return (
        <FlashList
            data={visitas}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (<VisitaCard visita={item} height={height} width={width} />)}
            estimatedItemSize={visitas.length}
        />
    )
}