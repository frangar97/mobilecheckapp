import { Cliente } from "./cliente_types"

export type AppNavigationType = {
    dashboard: undefined,
    mainmenu: undefined,
    cliente_list: undefined,
    cliente_detail: { cliente: Cliente },
    cliente_create: undefined,
    visita_list: undefined,
    visita_cliente_list: undefined,
    visita_create: { clienteId: number },
    tarea_list: undefined,
    tarea_complete: { clienteId: number, tareaId: number, imagenRequerida: boolean, tipoVisita: string, meta: string, requiereMeta: boolean, metaLinea: string, metaSublinea: string, requiereMetaLinea: boolean, requiereMetaSubLinea: boolean, latitudCliente: number, longitudCliente: number }
}