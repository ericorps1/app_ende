import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { ActividadData, BloqueDataInfo, RecursoTeoricoData, tiposActividades } from '@/interfaces/appInterfaces';
import { colors } from '@/theme/platformTheme';
import { RecursoTeorico } from '@/components/RecursoTeorico';
import LoadingScreen from '@/screens/LoadingScreen';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { BackButtonNavigation } from '@/components/BackButtonNavigation';
import { baseUrlFiles } from '@/hooks/useGlobal';
import { AuthContext } from '@/context/AuthContext';
import { Actividad } from '@/components/Actividad';
import PaperMessages from '@/components/PaperMessages';
import { HtmlToJsx } from '@/components/HtmlToJsx';
import { ChatAlumno } from '@/components/ChatAlumno';
import { Touchable } from '@/components/Touchable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import endeApi from '@/api/estudianteAPI';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BloqueDetalle () {
  const bloque_data = useLocalSearchParams();
  const { data_alumno } = useContext( AuthContext );
  const {id_blo, nom_blo, des_blo, id_sub_hor, nom_mat} = bloque_data;
  const [recursosTeoricos, setRecursosTeoricos] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true)
  const [viewAlertVencida, setViewAlertVencida] = useState(false)
  const [conBlo, setConBlo] = useState('')
  const router = useRouter();
  
  useEffect( () => {
    getDataView();
    return () => {
      setRecursosTeoricos([])
      setActividades([])
      setLoading(false)
      setViewAlertVencida(false)
    }
  },[id_blo, nom_blo, des_blo, id_sub_hor, nom_mat])

  const getDataView = async () => {
      setLoading(true)
      await getRecursosTeoricos();
      await getActividades();
      await getConBlo();
      setLoading(false)
  }

  const getRecursosTeoricos = async () => {
      const {data} = await endeApi.get('/recursos_teoricos/'+id_blo);
      setRecursosTeoricos(data.data);
  }

  const getActividades = async () => {
    const {data} = await endeApi.get('/actividades/',{ params:{ id_sub_hor, id_blo, id_alu_ram: data_alumno?.id_alu_ram } });
    setActividades(data.data);
  }

  const getConBlo = async () => {
    const {data} = await endeApi.get('/bloque/'+id_blo,{ params:{ cols: 'con_blo' } });
    if(data.trans){
      setConBlo(data.data.length>0 ? data.data[0].con_blo : '');
    }
  }

  const viewDetailRecTeorico = (htmlText:string,url_vid:string|null,title:string,arc_arc:string|null) => {
      if(url_vid!==null && url_vid!==''){//si tiene una url de video
        const params = {
          htmlText: JSON.stringify({ html: htmlText }),
          title,
          url: url_vid.replace("watch?v=", "embed/"),
          downloadFile: 'false',
          viewMiniChat: 'true',
        };
        const queryString = new URLSearchParams(params).toString();
        router.push(`/web-view-full-screen?${queryString}`);
          // navigation.navigate('WebViewFullScreen', {htmlText: {html: htmlText}, title, url: url_vid.replace('watch?v=','embed/'), downloadFile:false, viewMiniChat: true});
      }else if (arc_arc!==null && arc_arc!==''){
        const params = {
          htmlText: JSON.stringify({ html: htmlText }),
          title,
          url: baseUrlFiles+arc_arc.replace("watch?v=", "embed/"),
          downloadFile: 'true',
          viewMiniChat: 'true',
        };
        const queryString = new URLSearchParams(params).toString();
        router.push(`/web-view-full-screen?${queryString}`);
      }else{
        const params = {
          htmlText: JSON.stringify({ html: htmlText }),
          title,
          url: 'null',
          downloadFile: 'false',
          viewMiniChat: 'true',
        };
        const queryString = new URLSearchParams(params).toString();
        router.push(`/web-view-full-screen?${queryString}`);
      }
  }

  const viewDetailActividad = (actividad:ActividadData) => {
    const { tipo } = actividad;
    switch (tipo) {
      case 'Foro': 
        router.push({ pathname: "/foro", params: { ...{ data_actividad: JSON.stringify(actividad) } }});
        break;
      case 'Examen':
        router.push({ pathname: "/examen", params: { ...{ data_actividad: JSON.stringify(actividad) } }});
        break;
      case 'Entregable':
        router.push({ pathname: "/entregable", params: { ...{ data_actividad: JSON.stringify(actividad) } }});
        break;
    }
  }

  if(loading) return (<LoadingScreen text={`Cargando ${nom_blo}`}/>)
  if(viewAlertVencida) return (
    <PaperMessages
      dismissable
      title='Actividad vencida :('
      visible={viewAlertVencida}
      message='No realizaste esta actividad en tiempo y forma, comunícate con tu profesor...'
      buttonText='Aceptar'
      onDismiss = {() => setViewAlertVencida(false)}
      pressButton = {() => setViewAlertVencida(false)}
    />
  )
  const onPressVideoConference = () => {
    console.log('Videoconferencia')
    // navigation.navigate('JitsiMeetScreen', {id_sub_hor, title: 'Videoconferencia - '+nom_blo+' - '+des_blo})
  }

  return (
    <SafeAreaView style={ styles.container }>
      <BackButtonNavigation
        onPressBack={() => router.push({ pathname: "/materias", params: { ...{id_sub_hor,nom_mat} } })}
        title={nom_blo+' - '+des_blo}
      />
      <ScrollView  style={{marginBottom: 50}}>
        <View style={styles.containerVideoConference}>
          <Touchable 
            onPress={onPressVideoConference}
            styleContainer={{
              ...styles.floatingIcon,
              backgroundColor: colors.primary
            }}
          >
            <Icon name="videocam-outline" size={30} color="#fff" />
          </Touchable>
        </View>
        <View style={ styles.bodyBloDetalle }>
          {
            conBlo!=='' && 
            <View>
              <HtmlToJsx strHtml={conBlo}/>
            </View>
          }
          <View style={styles.bodyBloDetalle}>
          {
            recursosTeoricos.length>0 ? 
              recursosTeoricos.map((recurso:RecursoTeoricoData)=>{
                let icon = '';
                let iconColor = '';
                switch(recurso.tipo){
                  case 'Video' : icon = 'youtube'; iconColor = 'red';
                    break;
                  case 'Wiki' : icon = 'wordpress'; iconColor = colors.green;
                    break;
                  case 'Archivo' : icon = 'file-word'; iconColor = colors.info;
                    break;
                  default : icon = 'youtube'; iconColor = 'red';
                }
                return <RecursoTeorico 
                          key={recurso.identificador} 
                          icon={icon} 
                          iconColor={iconColor} 
                          text={recurso.titulo} 
                          onPress={() => viewDetailRecTeorico(recurso.descripcion,recurso.url_vid, recurso.titulo, recurso.arc_arc)}
                        />
              })
            :
              <Text style={styles.textNoRecTeo}>El bloque no contiene recursos teoricos.</Text>
          }
          </View>
        </View>
        <View style={styles.contActividades}>
          <Text style={styles.titleActividades}>Actividades</Text>
          {
            actividades.length>0
            ?
              actividades.map((actividad:ActividadData)=>{
                return <Actividad 
                          key={actividad.identificador} 
                          actividad={actividad} 
                          onPress={
                            () => viewDetailActividad(actividad)
                          }
                        />
              })
            :
              <Text style={styles.textNoRecTeo}>El bloque no contiene actividades.</Text>
          }
        </View>
      </ScrollView>
      <ChatAlumno/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      flex: 1,
      marginLeft: 10,
    },
    containerVideoConference: {
      padding: 20,
      position: 'relative', 
    },
    floatingIcon: {
      position: 'absolute',
      top: -15,
      right: -15,
      borderRadius: 25,
      padding: 10,
      elevation: 10,  // Sombra en Android
      shadowColor: '#000',  // Sombra en iOS
      shadowOpacity: 0.3,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    bodyBloDetalle: { 
      flex: 1,
      justifyContent: 'flex-start',
      marginBottom: 20,
      marginLeft: 1,
    },
    title: {
      fontSize: 30,
      color: colors.darkBlue
    },
    subTitle: {
      color: colors.silver,
      fontSize: 15
    },
    textNoRecTeo: {
        color: colors.error,
        padding: 10,
        textAlign: 'center',
        fontWeight: '600'
    },
    contActividades: {
        marginBottom: 30,
        marginLeft: 1,
    },
    titleActividades: {
        color: colors.darkBlue,
        fontSize: 30,
        fontWeight: 'bold',
    }
});
