import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect }  from 'react'
import { colors, platformTheme } from '@/theme/platformTheme';
import { Pagos } from '@/interfaces/appInterfaces';
import { FormatAmount, formatDate } from '@/hooks/useFormats';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButtonNavigation } from '@/components/BackButtonNavigation';
import { FilaInfoPagoDetalle } from '@/components/FilaInfoPagoDetalle';
import { router, useLocalSearchParams, useNavigation } from "expo-router";

type DataPago = {
  con_pag: string;
  est_pag: string;
  fac_pag: string;
  fec_pag: string;
  fin_pag: string;
  id_alu_ram10: string;
  id_pag: string;
  ini_pag: string;
  mon_ori_pag: string;
  mon_pag: string;
  pag_pag: string;
  res_pag: string;
  tip_pag: string;
}
export default function PagoDetalle() {
    const data_pagos:DataPago = useLocalSearchParams();
    const { est_pag, mon_ori_pag, mon_pag, tip_pag, fec_pag, con_pag } = data_pagos;
    const navigation = useNavigation();
    useEffect(() => {
      if (data_pagos.con_pag) {
        navigation.setOptions({ title: data_pagos.con_pag }); // ✅ Cambiar título dinámicamente
      }
    }, [data_pagos]);
    
  return (
    <View style={ {
      ...styles.container,
    }}>
      <BackButtonNavigation onPressBack={() => router.push("/pagos")} title={''}/>
      <Text style={styles.title}>Detalle del pago</Text>
      <View style={ styles.bodyPagDetalle }>
        <FilaInfoPagoDetalle 
          texto='Monto:'
          valor={<FormatAmount amount={(est_pag==='Pagado') ? mon_ori_pag : mon_pag }/>}
          colorValor={(est_pag==='Pagado') ? colors.silver : colors.error}
          tamanoValor={25}
        />
        <FilaInfoPagoDetalle texto='Estado:' valor={est_pag}/>
        <FilaInfoPagoDetalle texto='Tipo de pago:'valor={tip_pag} flex={12}/>
        <FilaInfoPagoDetalle texto='Fecha:'valor={formatDate(fec_pag)}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 10,
      // backgroundColor: 'red',
      flex: 1,
      paddingLeft: 20,
      marginTop: 0,
    },
    bodyPagDetalle: {
      marginLeft: 10,
      marginRight: 20,
      marginTop: 5,
      padding: 10,
    },
    title: {
      fontSize: 30,
      color: colors.darkBlue
    }
});