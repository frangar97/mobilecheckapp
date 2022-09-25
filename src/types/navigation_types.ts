import { Cliente } from "./cliente_types"

export type AppNavigationType = {
    mainmenu: undefined,
    cliente_list: undefined,
    cliente_detail: { cliente: Cliente },
    cliente_create: undefined,
    visita_list: undefined,
}