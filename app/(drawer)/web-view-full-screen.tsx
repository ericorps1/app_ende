import React, { useState } from 'react'
import WebView from 'react-native-webview';
import { View, StyleSheet, useWindowDimensions, Text, ScrollView, TouchableOpacity, Touchable } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { HTMLSource } from 'react-native-render-html';
import { colors } from '@/theme/platformTheme';
import { BackButtonNavigation } from '@/components/BackButtonNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatAlumno } from '@/components/ChatAlumno';
import { useDownload } from '@/hooks/useDownloads';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface WebViewFSParamsInterface {
  url: string;
  title: string;
  htmlText: string;
  downloadFile: string;
  viewMiniChat: boolean;
}

export default function WebViewFullScreen() {
  const params:any = useLocalSearchParams();
  const {url, title, htmlText, downloadFile, viewMiniChat}:WebViewFSParamsInterface = params;
  const { width } = useWindowDimensions();
  const [download, setDownload] = useState(false)
  const router = useRouter();
  const { fnDownloadFile, downloadProgress } = useDownload();
  return (
    <SafeAreaView style={ styles.container }>
      <BackButtonNavigation onPressBack={() => router.back()} title={title}/>
      <ScrollView style={{marginBottom: 50}}>
        <View style={ styles.bodyWevViewFS }>
          <View style={styles.bodyContentElements}>
            <RenderHtml
              contentWidth={width}
              source={JSON.parse(htmlText)}
            />
          </View>
          { url!=='null' && downloadFile==='false' && //si viene una url y no es un archivo de descarga se monta la previsualizacion
            <View style={styles.bodyContentElements}>
              <WebView
                  visible={true}
                  source={{uri: url.trim()}}
                  style={{width: '100%',height: 400}}
              />
            </View>
          }
          { url!=='null' && downloadFile==='true' && //Si es una url y es un archivo de descarga se monta el botón de descarga
            <View style={styles.bodyContentElements}>
              <TouchableOpacity
                style={ styles.btnDownload }
                onPress={()=>fnDownloadFile(url)}
              >
                <Text style={ styles.btnDownloadText }>{downloadProgress && downloadProgress!==100 ? `DESCARGANDO...(${parseInt(downloadProgress.toString())}%)` : 'DESCARGAR'}</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </ScrollView>
      { viewMiniChat && <ChatAlumno/> }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: 20
    },
    bodyWevViewFS: { 
      flex: 1,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 30,
      color: colors.darkBlue
    },
    bodyContentElements: {
        paddingRight: 20,
        paddingVertical: 20,
    },
    btnDownload: {
        backgroundColor: colors.darkBlue,
        padding: 5,
        borderRadius: 10,
    },
    btnDownloadText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18
    }
})