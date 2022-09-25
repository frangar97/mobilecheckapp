import { check, request, PermissionStatus, PERMISSIONS } from "react-native-permissions";

export const checkLocationPermission = async (): Promise<PermissionStatus> => {
    return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
}

export const askLocationPermission = async (): Promise<PermissionStatus> => {
    return await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
}