import { check, request, PermissionStatus, PERMISSIONS } from "react-native-permissions";

export const checkLocationPermission = async (): Promise<PermissionStatus> => {
    return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
}

export const askLocationPermission = async (): Promise<PermissionStatus> => {
    return await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
}

export const CalcularDistancia = (lat1: any, lon1:any, lat2:any, lon2:any) => {
    
    if (lat1 === 0 || lon1 === 0 || lat2 === 0 || lon2 === 0) {
        return "Distancia no disponible";
    }

    var R = 6378.137;//Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    var s = (1000 * parseFloat(d.toFixed(3))).toString();

    return s;//Retorna valor en metros
}


const rad = (x:any) => {
    return x * Math.PI / 180;
}


const financial = (x:string) => {
    return Number.parseFloat(x).toFixed(2);
  }