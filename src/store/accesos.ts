import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { apiURL } from '../constants';
import { format } from "date-fns";
import { Accesos } from '../types/accesos';

interface AccesosWebState {
    accesos: Accesos[],
    obtenerAccesos: (token: string) => void,
    guardarAccesos: (acceso: Accesos) => Promise<void>
}

export const useAccesosWeb = create<AccesosWebState>()(
    persist(
        (set, get) => ({
            accesos: [],
            async obtenerAccesos(token) {
                try {
                    const request = await axios.get<Accesos[]>(`${apiURL}/api/v1/movil/acceso/obtenerAccesosWebPorMovil`, { headers: { "Authorization": `Bearer ${token}` } });
                    const accesos = request.data;
                    set({ accesos });
                } catch (err) {

                }
            },
            async guardarAccesos(acceso) {
                const accesos = get().accesos;
                set({ accesos: [...accesos, acceso] });
            },
        }),
        {
            name: 'acceso-storage',
            getStorage: () => AsyncStorage,
        }
    )
);