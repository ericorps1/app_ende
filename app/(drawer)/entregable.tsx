import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, useWindowDimensions, StyleSheet, Dimensions, Alert } from 'react-native';
import { BackButtonNavigation } from '@/components/BackButtonNavigation';
import { AuthContext } from '@/context/AuthContext';
import { FilePick, TypesMsgModalType } from '@/interfaces/appInterfaces';
import { colors, platformTheme } from '@/theme/platformTheme';
import { nombreGuionesMinus } from '@/hooks/useFormats';
import LoadingScreen from '@/screens/LoadingScreen';
import { Button } from 'react-native-paper';
import { useUploads } from '@/hooks/useUploads';
import { ModalMessages } from '@/components/ModalMessages';
import { baseUrlFiles } from '@/hooks/useGlobal';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { HtmlToJsx } from '@/components/HtmlToJsx';
import { ChatAlumno } from '@/components/ChatAlumno';
import endeApi from '@/api/estudianteAPI';
import ConfirmModal from '@/components/ModalConfirm';
import { useDownload } from '@/hooks/useDownloads';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

export default function Entregable() {
  const params:any = useLocalSearchParams();
  const {identificador,titulo,descripcion,identificador_copia,nom_blo,nom_mat} = JSON.parse(params.data_actividad);
  
  const initialStateObFile = { fileCopyUri: null, name: "", size: 0, type: "", uri: "" };
  const { data_alumno } = useContext( AuthContext );
  const [infoRespTarea, setInfoRespTarea] = useState<any>([]);
  const [obFile, setObFile] = useState<FilePick>(initialStateObFile);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [typeMsg, setTypeMsg] = useState<TypesMsgModalType>('success');
  const [titleEliminar, setTitleEliminar] = useState('');
  const [textEliminar, setTextEliminar] = useState('');
  const { fnDownloadFile, downloadProgress } = useDownload();
  const router = useRouter();

  // Codigo para que se ejecute cada vez que se entre a la pantalla
    useFocusEffect(
      useCallback(() => {
        getEntregableAlu();
      }, [])
    );
  //funcion para consultar si el alumno ya subio un entregable para esta actividad
  const getEntregableAlu = async () => {
    const {data} = await endeApi.get('/tarea', {params: {id_ent_cop: identificador_copia, id_alu_ram: data_alumno?.id_alu_ram}});
    setLoading(true);
    if(data.trans){
        setInfoRespTarea(data.data);
    }else{
        setInfoRespTarea([]);
    }
    setLoading(false);
  }
  const { width } = useWindowDimensions();

  const handleError = (err: unknown) => {
      console.log('error handleError', err);
      // if (DocumentPicker.isCancel(err)) {
      //     console.log('cancelled', err)
      //     // User cancelled the picker, exit any dialogs or menus and move on
      // } else {
      //     throw err
      // }
  }

  const loadFile = async () => {
    try {
      const result:any = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Permite cualquier tipo de archivo
        copyToCacheDirectory: true, // Copia el archivo a la caché del dispositivo
      });
      if (!result.canceled) {
        setObFile({
          ...obFile,
          uri: result.assets[0].uri,
          name: result.assets[0].name ?? 'file-name.jpg',
          type: result.assets[0].mimeType ?? 'image/jpeg',
        });
      }
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
    }
  }

  const getPhoto = async (type:'photo'|'img') => {
      if(type==='photo'){
        // 🟡 Pedir permisos antes de abrir la cámara
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "Se necesita acceso a la cámara para tomar fotos.");
          return;
        }
    
        // 🟢 Abrir la cámara
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          cameraType: ImagePicker.CameraType.back, // Cámara trasera
          quality: 0.5, // Calidad 50%
        });
    
        // ✅ Si no se cancela, guardar la imagen
        if (!result.canceled) {
          setObFile({
            ...obFile,
            uri: result.assets[0].uri,
            name: result.assets[0].fileName ?? 'file-name.jpg',
            type: result.assets[0].mimeType ?? 'image/jpeg',
          });
        }
      }else{
        // 🟡 Pedir permisos antes de abrir la galería
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "Se necesita acceso a la galería para seleccionar imágenes.");
          return;
        }

        // 🟢 Abrir la galería
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.5, // Reducir calidad para optimizar almacenamiento
        });

        // ✅ Si no se cancela, guardar la imagen seleccionada
        if (!result.canceled) {
          setObFile({
            ...obFile,
            uri: result.assets[0].uri,
            name: result.assets[0].fileName ?? 'file-name.jpg',
            type: result.assets[0].mimeType ?? 'image/jpeg',
          });
        }
      }
  }

  const uploadFile = async () => {
      const arrFileName = obFile.name.split('.');
      const fileExt = arrFileName[arrFileName.length-1];
      try { 
          if(obFile.name==="") return false;
          console.log(obFile);
          setLoading(true);
          const serverFileName = `${nombreGuionesMinus(data_alumno?.nom_gen+'-'+data_alumno?.nom_alu+'-'+titulo)}.${fileExt}`;
          console.log(serverFileName);
          const resp = 
            await useUploads(
              '/tarea/',
              {...obFile, fileName: serverFileName}, 
              {doc_tar: obFile.name, id_ent_cop: identificador_copia, id_alu_ram: data_alumno?.id_alu_ram}
            );
          setLoading(false);
          if(resp.trans===true){
              setTypeMsg('success');
              setAlertMsg('Actividad entregada exitosamente.');
              setObFile(initialStateObFile);
          }else{
              setTypeMsg('error');
              setAlertMsg('La actividad no se pudo entregar, por favor, vuelva a intentarlo. \n'+resp.msg);
          }
          setLoading(false);
      } catch (error:any) {
        setTypeMsg('error');
        setAlertMsg('Error inesperado, por favor, contacte a soporte si el problema persiste.');
        // if (error.response) {
        //   console.log('Error data:', error.response.data);
        //   console.log('Error status:', error.response.status);
        //   console.log('Error headers:', error.response.headers);
        // } else if (error.request) {
        //   console.log('Error request:', error.request);
        // } else {
        //   console.log('Error message:', error.message);
        // }
        console.log('uploadFile =>>>> ',error);
      }
      getEntregableAlu();
  }

  const downloadFileFunc = () => {
    console.log('download');
    fnDownloadFile(baseUrlFiles+infoRespTarea[0].doc_tar);
  }

  const pressDelete = () => {
      setTitleEliminar('¿ELIMINAR ENTREGABLE?');
      setTextEliminar('¿Seguro que desea eliminar el entregable?, esta acción es irrevertible.');
  }

  const eliminarTarea = async () => {
      setLoading(true);
      const {data} = await endeApi.delete('/tarea/'+infoRespTarea[0]?.id_tar);
      if(data.trans===true){
          setTypeMsg('success');
          setAlertMsg('Entrega eliminada exitosamente.');
          setTitleEliminar('');setTextEliminar('');
      }else{
          setTypeMsg('error');
          setAlertMsg('La entrega no se pudo eliminar, por favor, intentelo nuevamente.');
      }
      setLoading(false);
      getEntregableAlu();
  }

  loading && <LoadingScreen/>
  return (
    <SafeAreaView style={ styles.container }>
      <BackButtonNavigation onPressBack={() => router.back()} title={titulo}/>
      <ScrollView style={{height: Dimensions.get("window").height}}>
        <View style={ styles.bodyEntDetalle }>
          <View style={ styles.entPregunta }>
            <HtmlToJsx strHtml={`<b>DESCRIPCIÓN:</b>${descripcion}`}/>
            <View style={ styles.containerRespAct }>
              {
                infoRespTarea.length ?//si ya subio un archivo muestra la opcion descargar y eliminar
                <View style={styles.containerBtnDownload}>
                  <Text style={styles.txtInfoFileToDownload}>{infoRespTarea[0].doc_tar}</Text>
                  <View style={platformTheme.fila}>
                    <Button
                      disabled={loading}
                      loading={loading}
                      icon="arrow-down"
                      textColor='white'
                      onPress={()=>downloadFileFunc()}
                      style={ [platformTheme.btnDownload, {margin: 5}] }
                    >DESCARGAR</Button>
                    <Button
                      disabled={loading}
                      loading={loading}
                      icon="delete"
                      textColor='white'
                      onPress={pressDelete}
                      style={ [platformTheme.btnDownload, {flex: 1, margin: 5, backgroundColor: colors.error, borderRadius: 10}] }
                    >ELIMINAR</Button>
                  </View>
                </View>
                :
                  obFile.uri ?
                    <View>
                      <Text style={ styles.txtFileName }>{obFile.name}</Text>
                      <View style={{...platformTheme.fila, alignSelf: 'center'}}>
                        <Button
                          disabled={loading}
                          loading={loading}
                          icon="arrow-up"
                          textColor='white'
                          onPress={uploadFile}
                          style={ [platformTheme.btnSuccess, platformTheme.btn] }
                        >SUBIR ARCHIVO</Button>
                        <Button
                          disabled={loading}
                          loading={loading}
                          icon="cancel"
                          textColor='white'
                          onPress={()=>setObFile(initialStateObFile)}
                          style={ [platformTheme.btnDanger, platformTheme.btn] }
                        >CANCELAR</Button>
                      </View>
                    </View>
                  :
                    <View>
                      <View style={ { ...platformTheme.fila, alignSelf: 'center', marginBottom: 10 } }>
                        <Button 
                          loading={loading}
                          disabled={loading}
                          icon="camera"
                          textColor='white'
                          onPress={() => getPhoto('photo')}
                          style={ [platformTheme.btnInfo, platformTheme.btn, {flex: 1}] }
                        >CAMARA</Button>
                        <Button
                          loading={loading}
                          disabled={loading}
                          icon="image"
                          textColor='white'
                          onPress={() => getPhoto('img')}
                          style={ [platformTheme.btnDarkBlue, platformTheme.btn, {flex: 1}] }
                        >GALERIA</Button>
                      </View>
                      <Button
                        disabled={loading}
                        loading={loading}
                        icon="file"
                        textColor='white'
                        onPress={loadFile}
                        style={ [platformTheme.btnSuccess, platformTheme.btn] }
                      >SELECCIONAR ARCHIVO</Button>
                    </View>
              }
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{paddingLeft: 20}}>
        <ChatAlumno/>
      </View>
      <ModalMessages
        visible={alertMsg!==''}
        typeMsgModal={typeMsg}
        modalText={alertMsg}
        onDismiss={()=>setAlertMsg('')}
      />
      <ConfirmModal
        visible={titleEliminar!==''}
        title={titleEliminar}
        message={textEliminar}
        buttonText='Eliminar'
        btnTxtCancel='Cancelar'
        evtBtnCancel={()=>{setTitleEliminar('');setTextEliminar('');}}
        pressButton={eliminarTarea}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 20,
        marginTop: 10,
    },
    bodyEntDetalle: { 
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 50,
    },
    entPregunta: {
        backgroundColor: colors.softSilver,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginRight: 20,
        borderRadius: 10
    },
    containerRespAct: {
        backgroundColor: colors.softBlue,
        borderRadius: 10,
        padding: 10,
    },
    titleRepAct:{
        fontWeight: 'bold',
        fontSize: 20,
        color: colors.darkBlue,
    },
    txtFileName: {
        textAlign: 'center',
        padding: 10,
        fontSize: 18,
        color: colors.darkBlue,
    },
    textInfoFileUploaded: {
        color: colors.darkBlue,
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 10
    },
    txtInfoFileToDownload: {
        textAlign: 'center',
        fontSize: 18,
        color: colors.darkBlue,
        marginBottom: 10
    },
    containerBtnDownload: {
        marginBottom: 20,
        backgroundColor: colors.softBlue,
        padding: 10,
        borderRadius: 10,
    }
});