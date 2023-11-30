import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { VersionApp, apiURL } from '../constants';
import { Cliente } from '../types/cliente_types';
import { format } from "date-fns";
import { Alert } from 'react-native';

interface ClienteState {
    clientes: Cliente[],
    obtenerClientes: (token: string) => void,
    guardarCliente: (cliente: Cliente) => Promise<void>
}

export const useCliente = create<ClienteState>()(
    persist(
        (set, get) => ({
            clientes: [],
            async obtenerClientes(token) {
                try {
                    const request = await axios.get<Cliente[]>(`${apiURL}/api/v1/movil/cliente`, { headers: { "Authorization": `Bearer ${token}`, "VersionApp" : VersionApp  }, params: { fecha: format(new Date(), "yyyy-MM-dd") } });
                    const clientes = request.data;
                    set({ clientes });
                } catch (err: unknown) {
                    // if (axios.isAxiosError(err)) {
                    //     const errorMessage = (err.response?.data as { message?: string })?.message;

                    //     if (errorMessage != undefined) {
                    //         Alert.alert(errorMessage + "  version actual " + VersionApp);
                    //     } else {
                    //         Alert.alert("Error al cargar los clientes");
                    //     }
                    // } else {
                    //     Alert.alert("Error al cargar los clientes");
                    // }
                }
            },
            async guardarCliente(cliente) {
                const clientes = get().clientes;
                set({ clientes: [...clientes, cliente] });
            },
        }),
        {
            name: 'cliente-storage',
            getStorage: () => AsyncStorage,
        }
    )
);