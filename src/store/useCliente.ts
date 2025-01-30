import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VersionApp, apiURL } from '../constants';
import { Cliente } from '../types/cliente_types';
import { format } from 'date-fns';
import { Alert } from 'react-native';

interface ClienteState {
  clientes: Cliente[];
  obtenerClientes: (token: string) => Promise<void>;
  guardarCliente: (cliente: Cliente) => Promise<void>;
}

export const useCliente = create(
  persist<ClienteState>(
    (set, get) => ({
      clientes: [],

      obtenerClientes: async (token: string) => {
        try {
          const response = await axios.get<Cliente[]>(
            `${apiURL}/api/v1/movil/cliente`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                VersionApp,
              },
              params: { fecha: format(new Date(), 'yyyy-MM-dd') },
            }
          );

          set({ clientes: response.data });
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const errorMessage = (err.response?.data as { message?: string })?.message;
            Alert.alert(
              errorMessage
                ? `${errorMessage}. Versión actual: ${VersionApp}`
                : 'Error al cargar los clientes.'
            );
          } else {
            Alert.alert('Ocurrió un error inesperado al cargar los clientes.');
          }
        }
      },

      guardarCliente: async (cliente: Cliente) => {
        try {
          const clientes = get().clientes;
          const updatedClientes = [...clientes, cliente];
          set({ clientes: updatedClientes });

          // Guardar en AsyncStorage también
          await AsyncStorage.setItem('cliente-storage', JSON.stringify(updatedClientes));
        } catch (err) {
          Alert.alert('Error al guardar el cliente.');
        }
      },
    }),
    {
      name: 'cliente-storage',
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
