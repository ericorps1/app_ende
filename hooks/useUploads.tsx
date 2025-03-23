import endeApi from '@/api/estudianteAPI';
import { Platform } from 'react-native';

const useUploads = async (endPoint:string, objImg:any, postData:any=false) => {
    if(!objImg) return false;
    if(!objImg.uri) return false;
    const fileToUpload = {
      uri: objImg.uri, //Your Image File Path
      type: objImg.type, 
      name: objImg.fileName
    };
    const formData = new FormData();
    formData.append("file", {
      uri: fileToUpload.uri,
      type: fileToUpload.type,
      name: fileToUpload.name,
    }as any);

    // 🟢 Agregar datos adicionales si existen
    if (postData) {
      Object.keys(postData).forEach((key) => {
        formData.append(key, postData[key]);
      });
    }

    // 🟢 Configuración de Headers
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data", // Axios maneja esto, pero lo dejamos
      },
    };

    try {
        console.log("Endpoint:", endPoint);
        console.log("FormData:", formData);
        const { data } = await endeApi.post(endPoint, formData, config);
        return data;
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return false;
    }

    
    // console.log('fileToUpload', fileToUpload);
    // const formData = new FormData();
    // const blob = await fetch(fileToUpload.uri).then(res => res.blob());
    // formData.append('file', blob, fileToUpload.name);
    // if(postData){//si existen parametros para enviar vía post, se debe de enviar un objeto de tipo {property1: value1, property2: value2}
    //     for (const property in postData) {
    //         formData.append(property, postData[property]);
    //       }
    // }
    // const config = {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //   }
    // };
    // console.log('endpoint', endPoint);
    // console.log('formData', formData);
    // console.log('config', config);
    // const {data} = await endeApi.post(endPoint, formData, config);
    // return data;
}


export {
    useUploads
}