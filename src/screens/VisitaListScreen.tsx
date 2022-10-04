import { FC, useEffect, useState } from 'react';
import { useWindowDimensions, Text, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { apiURL } from '../constants';
import { useUsuario } from '../store/useUsuario'
import { Visita } from '../types/visita_types';
import { VisitaCard } from '../components';
import { AppNavigationType } from '../types/navigation_types';
import { FlashList } from '@shopify/flash-list';

type props = NativeStackScreenProps<AppNavigationType, "visita_list">

export const VisitaListScreen: FC<props> = ({ navigation }) => {
    const token = useUsuario(e => e.token);
    const { height, width } = useWindowDimensions();
    const [visitas, setVisitas] = useState<Visita[]>([]);

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

    const obtenerVisitasUsuario = async () => {
        try {
            const request = await axios.get<Visita[]>(`${apiURL}/api/v1/movil/visita`, { headers: { "Authorization": `Bearer ${token}` } });
            const data = request.data;
            setVisitas(data);
        } catch (err) {
            setVisitas([]);
        }
    }

    useEffect(() => {
        obtenerVisitasUsuario();
    }, []);

    return (
        <FlashList
            data={visitas}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (<VisitaCard visita={item} height={height} width={width} />)}
            estimatedItemSize={visitas.length}
        />
    )
}