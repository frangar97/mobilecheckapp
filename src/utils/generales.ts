import { useAccesosWeb } from "../store/accesos";
import { Accesos } from "../types/accesos";


export const verificarPantallas = (pantalla: string): boolean => {
    debugger
    const accesosWeb = useAccesosWeb(e => e.accesos);
    const cc = pantalla;
    if (accesosWeb) {       
        return accesosWeb.some(a => a.pantalla == pantalla);
    } else {        
        return false
    }
}