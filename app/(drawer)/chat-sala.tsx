import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { BackButtonNavigation } from '@/components/BackButtonNavigation';
import { MensajesChatAlumno } from '@/components/MensajesChatAlumno';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface ChatSalaProps {
  id_sal: number;
  des_sal: string;
}

export default function ChatSala() {
  const params:any = useLocalSearchParams();
  const {id_sal, des_sal}:ChatSalaProps = params;
  const router = useRouter();
  return (
    <View style={styles.container}>
      <BackButtonNavigation 
        onPressBack={() => router.back()}
        title={des_sal}
      />
      <MensajesChatAlumno 
        key={id_sal}
        id_sal={id_sal}
        welcomeMsg={<></>}
        id_pro={44}
        heightChatHistory={600}
        placeHolderInputTxt='Envía un mensaje...'
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    }
});