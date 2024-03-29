import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { apiURL } from '../constants';
import { Cliente } from '../types/cliente_types';

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
                    const request = await axios.get<Cliente[]>(`${apiURL}/api/v1/movil/cliente`, { headers: { "Authorization": `Bearer ${token}` } });
                    const clientes = request.data;
                    set({ clientes });
                } catch (err) {

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