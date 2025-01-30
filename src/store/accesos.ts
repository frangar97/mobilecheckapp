import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VersionApp, apiURL } from '../constants';
import { Alert } from 'react-native';
import { Accesos } from '../types/accesos';

interface AccesosWebState {
  accesos: Accesos[];
  obtenerAccesos: (token: string) => Promise<void>;
  guardarAccesos: (acceso: Accesos) => Promise<void>;
}

// Crear el store usando la API de zustand moderna
export const useAccesosWeb = create(
  persist<AccesosWebState>(
    (set, get) => ({
      accesos: [],

      obtenerAccesos: async (token: string) => {
        try {
          const response = await axios.get<Accesos[]>(
            `${apiURL}/api/v1/movil/acceso/obtenerAccesosWebPorMovil`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                VersionApp,
              },
            }
          );

          set({ accesos: response.data });
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const errorMessage = (err.response?.data as { message?: string })?.message;
            Alert.alert(
              errorMessage
                ? `${errorMessage}. Versión actual: ${VersionApp}`
                : 'Error al cargar accesos.'
            );
          } else {
            Alert.alert('Ocurrió un error inesperado al cargar accesos.');
          }
        }
      },

      guardarAccesos: async (acceso: Accesos) => {
        try {
          const accesos = get().accesos;
          const updatedAccesos = [...accesos, acceso];
          set({ accesos: updatedAccesos });

          // Guardar también en AsyncStorage
          await AsyncStorage.setItem('acceso-storage', JSON.stringify(updatedAccesos));
        } catch (err) {
          Alert.alert('Error al guardar el acceso.');
        }
      },
    }),
    {
      name: 'acceso-storage', // Nombre del almacenamiento persistente
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
