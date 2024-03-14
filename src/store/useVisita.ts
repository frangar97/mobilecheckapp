import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiURL } from "../constants";
import { Visita } from "../types/visita_types";

interface VisitaState {
    visitas: Visita[],
    obtenerVisitas: (token: string) => void,
    guardarVisita: (visita: Visita) => Promise<void>
}

export const useVisita = create<VisitaState>()(
    persist(
        (set, get) => ({
            visitas: [],
            async obtenerVisitas(token) {
                try {
                    const request = await axios.get<Visita[]>(`${apiURL}/api/v1/movil/visita`, { headers: { "Authorization": `Bearer ${token}` }, params: { fecha: format(new Date(), "yyyy-MM-dd") } });
                    const visitas = request.data;
                    set({ visitas });
                } catch (err) {

                }
            },
            async guardarVisita(visita: Visita) {
                const visitas = get().visitas;
                set({ visitas: [visita, ...visitas] });
            }
        }),
        {
            name: 'visita-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);