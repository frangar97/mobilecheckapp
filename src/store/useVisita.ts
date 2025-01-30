import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VersionApp, apiURL } from "../constants";
import { Visita } from "../types/visita_types";
import { Alert } from "react-native";

interface VisitaState {
  visitas: Visita[];
  obtenerVisitas: (token: string) => Promise<void>;
  guardarVisita: (visita: Visita) => Promise<void>;
}

export const useVisita = create<VisitaState>()(
  persist(
    (set, get) => ({
      visitas: [],

      obtenerVisitas: async (token: string) => {
        try {
          const request = await axios.get<Visita[]>(`${apiURL}/api/v1/movil/visita`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "VersionApp": VersionApp,
            },
            params: { fecha: format(new Date(), "yyyy-MM-dd") },
          });
          set({ visitas: request.data });
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const errorMessage = (err.response?.data as { message?: string })?.message;
            Alert.alert(
              errorMessage
                ? `${errorMessage}. Versión actual: ${VersionApp}`
                : "Error al cargar las visitas."
            );
          } else {
            Alert.alert("Ocurrió un error inesperado al cargar las visitas.");
          }
        }
      },

      guardarVisita: async (visita: Visita) => {
        try {
          const visitas = get().visitas;
          const updatedVisitas = [visita, ...visitas];
          set({ visitas: updatedVisitas });

          // Guardar en AsyncStorage también
          await AsyncStorage.setItem("visita-storage", JSON.stringify(updatedVisitas));
        } catch (err) {
          Alert.alert("Error al guardar la visita.");
        }
      },
    }),
    {
      name: "visita-storage",
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
