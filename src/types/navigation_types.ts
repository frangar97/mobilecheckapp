import { Cliente } from "./cliente_types"

export type AppNavigationType = {
    mainmenu: undefined,
    cliente_list: undefined,
    cliente_detail: { cliente: Cliente }
    visita_list: undefined,
}