import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiURL } from "../constants";
import { TipoVisita } from "../types/tipo_visita_types";

interface TipoVisitaState {
    tiposVisita: TipoVisita[],
    obtenerTiposVisita: (token: string) => void,
}

export const useTipoVisita = create<TipoVisitaState>()(
    persist(
        (set) => ({
            tiposVisita: [],
            async obtenerTiposVisita(token) {
                try {
                    const request = await axios.get<TipoVisita[]>(`${apiURL}/api/v1/movil/tipovisita`, { headers: { "Authorization": `Bearer ${token}` } });
                    const tiposVisita = request.data;
                    set({ tiposVisita });
                } catch (err) {

                }
            },

        }),
        {
            name: 'tipoVisita-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);