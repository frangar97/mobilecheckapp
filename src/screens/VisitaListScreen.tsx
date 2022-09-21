import { useEffect, useState } from 'react';
import { FlatList, useWindowDimensions } from 'react-native'
import axios from 'axios';
import { apiURL } from '../constants';
import { useUsuario } from '../store/useUsuario'
import { Visita } from '../types/visita_types';
import { VisitaCard } from '../components';

export const VisitaListScreen = () => {
    const token = useUsuario(e => e.token);
    const { height, width } = useWindowDimensions();
    const [visitas, setVisitas] = useState<Visita[]>([]);

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
        <FlatList
            data={visitas}
            keyExtractor={e => e.id.toString()}
            renderItem={({ item }) => (<VisitaCard visita={item} height={height} width={width} />)}
        />
    )
}