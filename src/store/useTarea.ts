import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiURL, VersionApp } from "../constants";
import { Tarea } from "../types/tarea_type";
import { Alert } from "react-native";

interface TareaState {
  tareas: Tarea[];
  obtenerTareas: (token: string) => Promise<void>;
  guardarTarea: (tarea: Tarea) => Promise<void>;
}

export const useTarea = create(
  persist<TareaState>(
    (set, get) => ({
      tareas: [],

      obtenerTareas: async (token: string) => {
        try {
          const response = await axios.get<Tarea[]>(
            `${apiURL}/api/v1/movil/tarea`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                VersionApp,
              },
              params: { fecha: format(new Date(), "yyyy-MM-dd") },
            }
          );
          set({ tareas: response.data });
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const errorMessage = (err.response?.data as { message?: string })?.message;
            Alert.alert(
              errorMessage
                ? `${errorMessage}. Versión actual: ${VersionApp}`
                : "Error al cargar las tareas."
            );
          } else {
            Alert.alert("Ocurrió un error inesperado al cargar las tareas.");
          }
        }
      },

      guardarTarea: async (tarea: Tarea) => {
        try {
          const tareas = get().tareas;
          const updatedTareas = [tarea, ...tareas];
          set({ tareas: updatedTareas });

          // Guardar en AsyncStorage también
          await AsyncStorage.setItem("tarea-storage", JSON.stringify(updatedTareas));
        } catch (err) {
          Alert.alert("Error al guardar la tarea.");
        }
      },
    }),
    {
      name: "tarea-storage",
      storage: {
        getItem: async (key) => {
          const item = await AsyncStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    }
  )
);
