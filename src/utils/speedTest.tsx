import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import axios from 'axios';

export const Velocidad = () => {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);

  const runSpeedTest = async () => {
    try {
      const response = await axios.get('https://www.speedtest.net/api/js/servers');
      const servers = response.data.servers;

     
        const server = servers[0]; // You can choose a server based on location, etc.

        const downloadStartTime = Date.now();
        await axios.get(`http://${server.host}:8080/download`, { responseType: 'arraybuffer' });
        const downloadEndTime = Date.now();

        const uploadStartTime = Date.now();
        await axios.post(`http://${server.host}:8080/upload`, new ArrayBuffer(1024 * 1024)); // Upload 1MB
        const uploadEndTime = Date.now();

        const downloadSpeedMbps = 1024 / ((downloadEndTime - downloadStartTime) / 1000);
        const uploadSpeedMbps = 1024 / ((uploadEndTime - uploadStartTime) / 1000);

        setDownloadSpeed(downloadSpeedMbps);
        setUploadSpeed(uploadSpeedMbps);
        
        Alert.alert("ccc", "aa.",
                [
                    { text: 'Ok', style: 'cancel' },
                    { text: downloadSpeedMbps.toString() + " "+  uploadSpeedMbps.toString() },
                ],
                { cancelable: true }
            );
      
    } catch (error) {
      console.error('Error running speed test:', error);
    }
  };

  return (
    <View>
      <Text>Download Speed: {downloadSpeed} Mbps</Text>
      <Text>Upload Speed: {uploadSpeed} Mbps</Text>
      <Button title="Run Speed Test" onPress={runSpeedTest} />
    </View>
  );
};






