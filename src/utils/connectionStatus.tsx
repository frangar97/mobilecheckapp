import React, {useEffect, useState} from "react";
import NetInfo, {NetInfoState, NetInfoSubscription} from "@react-native-community/netinfo";
import { View, Text } from 'react-native';
import colors from "../constants/colors";


export const OfflineScreen = () => {
    const [isOffline, setIsOffline] = useState(false);
    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state: NetInfoState) => {
          const offline = !(state.isConnected && state.isInternetReachable)
          console.log(offline)
          setIsOffline(offline)
        })
    
        return () => removeNetInfoSubscription()
      }, [])

    return  isOffline
}


export const Conexion: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isStable, setIsStable] = useState<boolean>(true);

  useEffect(() => {
      const unsubscribe: NetInfoSubscription = NetInfo.addEventListener(
          (state: NetInfoState) => {
              setIsConnected(state!.isConnected!);
              setIsStable(state.isInternetReachable === null ? false : state.isInternetReachable);
          }
      );

      return () => {
          unsubscribe();
      };
  }, []);

  return (
      <View>
          {isConnected == false &&
              <Text style={{ color: colors.black}}>Conexión a Internet: {isConnected ? 'Conectado' : 'Desconectado'}</Text>
          }

          {isStable == false &&
              <Text  style={{ color: colors.black}}>Estabilidad de la conexión: {isStable ? 'Estable' : 'Inestable'}</Text>
          }
      </View>
  );
};