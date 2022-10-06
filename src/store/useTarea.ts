import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format } from "date-fns";
import create from "zustand";
import { persist } from "zustand/middleware";
import { apiURL } from "../constants";
import { Tarea } from "../types/tarea_type";

interface TareaState {
    tareas: Tarea[],
    obtenerTareas: (token: string) => void,
    guardarTarea: (tarea: Tarea) => Promise<void>
}

export const useTarea = create<TareaState>()(
    persist(
        (set, get) => ({
            tareas: [],
            async obtenerTareas(token) {
                try {
                    const request = await axios.get<Tarea[]>(`${apiURL}/api/v1/movil/tarea`, { headers: { "Authorization": `Bearer ${token}` }, params: { fecha: format(new Date(), "yyyy-MM-dd") } });
                    const tareas = request.data;
                    set({ tareas });
                } catch (err) {

                }
            },
            async guardarTarea(tarea: Tarea) {
                const tareas = get().tareas;
                set({ tareas: [tarea, ...tareas] });
            }
        }),
        {
            name: 'tarea-storage',
            getStorage: () => AsyncStorage,
        }
    )
);