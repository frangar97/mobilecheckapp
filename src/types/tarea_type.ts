export interface Tarea {
    id: number
    meta: string
    fecha: string
    completada: boolean
    clienteId: number
    cliente: string
    imagenRequerida: boolean
    tipoVisita: string
    requieremeta: boolean
    metaLinea: string
    metaSublinea: string
    requiereMetaLinea: boolean
    requiereMetaSubLinea: boolean
    latitudCliente: number
    longitudCliente: number
    necesitaaprobacion: boolean
}