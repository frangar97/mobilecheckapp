import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format } from "date-fns";
import create from "zustand";
import { persist } from "zustand/middleware";
import { VersionApp, apiURL } from "../constants";
import { Visita } from "../types/visita_types";
import { Alert } from "react-native";

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
                    const request = await axios.get<Visita[]>(`${apiURL}/api/v1/movil/visita`, { headers: { "Authorization": `Bearer ${token}`, "VersionApp" : VersionApp  }, params: { fecha: format(new Date(), "yyyy-MM-dd") } });
                    const visitas = request.data;
                    set({ visitas });
                } catch (err: unknown) {
                    // if (axios.isAxiosError(err)) {
                    //     const errorMessage = (err.response?.data as { message?: string })?.message;

                    //     if (errorMessage != undefined) {
                    //         Alert.alert(errorMessage + "  version actual " + VersionApp);
                    //     } else {
                    //         Alert.alert("Error al las visitas");
                    //     }
                    // } else {
                    //     Alert.alert("Error al las visitas");
                    // }
                }
            },
            async guardarVisita(visita: Visita) {
                const visitas = get().visitas;
                set({ visitas: [visita, ...visitas] });
            }
        }),
        {
            name: 'visita-storage',
            getStorage: () => AsyncStorage,
        }
    )
);