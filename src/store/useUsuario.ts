import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UsuarioState {
    token: string,
    usuario: string,
    sesionActiva: boolean,
    _hasHydrated: boolean,
    guardarUsuario: (usuario: string, token: string) => void,
    cerrarSesion: () => void,
    setHasHydrated: (hidratado: boolean) => void
}

export const useUsuario = create<UsuarioState>()(
    persist(
        (set) => ({
            usuario: "",
            token: "",
            sesionActiva: false,
            _hasHydrated: false,
            guardarUsuario: (usuario: string, token: string) => set({ usuario, token, sesionActiva: true }),
            cerrarSesion: () => set({ usuario: "", token: "", sesionActiva: false }),
            setHasHydrated: (hidratado: boolean) => set({ _hasHydrated: hidratado })
        }),
        {
            name: 'usuario-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);