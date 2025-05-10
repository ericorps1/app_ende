import { useState } from "react";
import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  mp4: 'video/mp4',
  txt: 'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  json: 'application/json',
  zip: 'application/zip',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  gif: 'image/gif',
};


export const useDownload = () => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);

  // Callback para mostrar el progreso
  const getDownloadCallback = (progressData: FileSystem.DownloadProgressData) => {
    const progress = (progressData.totalBytesWritten / progressData.totalBytesExpectedToWrite) * 100;
    setDownloadProgress(parseFloat(progress.toFixed(2)));
  };

  const getMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return MIME_TYPES[extension || ''] || 'application/octet-stream';
  };

  // Función para descargar el archivo
  const fnDownloadFile = async (fileUrl: string) => {
    try {
      const fileName = fileUrl.split('/').pop() ?? "unknownfile";
      // 🔹 Detectar el tipo MIME según la extensión
      const mimeType = getMimeType(fileName);
      // Descargar el archivo
      // Pedir permisos en Android
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso requerido", "Necesitas dar permisos para descargar archivos.");
          return;
        }
        const tempUri = FileSystem.cacheDirectory + fileName;
        const downloadResumable = FileSystem.createDownloadResumable(fileUrl, tempUri);
        const { uri }:any = await downloadResumable.downloadAsync();
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
        if (!permissions.granted) {
          Alert.alert('Permiso denegado', 'No puedes guardar archivos sin permiso.');
          return;
        }

        // 🔹 Crear el archivo en la ubicación seleccionada
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri, // URI de la carpeta de destino
          fileName,
          mimeType
        );

        // 🔹 Escribir el contenido en el archivo
        const fileData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.writeAsStringAsync(fileUri, fileData, { encoding: FileSystem.EncodingType.Base64 });

        Alert.alert('Descarga completa', `Archivo descargado exitosamente.`);
      }else{

        const fileUri = FileSystem.documentDirectory + fileName;
        // Iniciar la descarga
        const downloadResumable = FileSystem.createDownloadResumable(
          fileUrl,
          fileUri,
          {},
          getDownloadCallback
        );

        const { uri }:any = await downloadResumable.downloadAsync();
        setFileUri(uri);
        openFile();
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      Alert.alert("Error", "No se pudo descargar el archivo.");
    }
  };

  // Función para abrir el archivo
  const openFile = async () => {
    if (fileUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("No se puede abrir", "Este dispositivo no admite la apertura de archivos.");
    }
  };

  return { fnDownloadFile, openFile, downloadProgress, fileUri };
};
