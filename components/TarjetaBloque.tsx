import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { TarjetaBloqueINT } from '../interfaces/appInterfaces';
import { useRouter } from 'expo-router';

// const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

export const TarjetaBloque = ({bloque_data,nom_mat}:TarjetaBloqueINT) => {
  
  const {id_blo, nom_blo,des_blo,img_blo} = bloque_data;
  const router = useRouter();
  const pressTarjetaBloque = () => {
    router.push({ pathname: "/bloque-detalle", params: {...bloque_data, nom_mat} });
  }

  return (
    <Card 
      style={ styles.card }
      elevation={5}
      onLongPress={()=>console.log('card longpress '+id_blo)}
      onPress={pressTarjetaBloque}
    >
      <Card.Title 
        title={nom_blo}
        subtitle={des_blo} 
        titleStyle={styles.titleStyle}
      />
      <View style={styles.cardCover}>
        <Image
          source={{ uri: 'https://plataforma.ahjende.com/fondos_clase/'+img_blo }}
          style={styles.image}
          accessibilityIgnoresInvertColors
        />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
    card: {
      flex: 1,
      marginHorizontal: 10,
      marginVertical: 5,
      backgroundColor: 'white',
    },
    cardCover: {
      height: 195,
      overflow: 'hidden',
      borderRadius: 10,
      margin: 5,
    },
    image: {
      flex: 1,
      height: undefined,
      width: undefined,
      padding: 0,
      justifyContent: 'flex-end',
    },
    titleStyle: {
      fontSize: 24,
      fontWeight: 'bold'
    }
});