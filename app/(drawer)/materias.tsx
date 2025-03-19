import React, {useEffect, useState} from 'react'
import { ActivityIndicator, View, Text, ScrollView, SafeAreaView } from 'react-native';
import useAppDispatch from '../hooks';
import endeApi from '@/api/estudianteAPI';
import { updateInfo } from '@/features/chatBloque/dataChatSlice';
import LoadingScreen from '@/screens/LoadingScreen';
import { TarjetaBloque } from '@/components/TarjetaBloque';
import { BloqueDataInfo } from '@/interfaces/appInterfaces';
import { ChatAlumno } from '@/components/ChatAlumno';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const Materias = () => {
    const params = useLocalSearchParams();
    const id_sub_hor = Number(params.id_sub_hor);
    const nom_mat = String(params.nom_mat);
    const dispatch = useAppDispatch();
    const [bloques, setBloques] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const getBloques = async () => {
        setIsLoading(true);
        const {data} = await endeApi.get('/bloque', {params: {id_sub_hor}})
        setBloques(data.data);
        setIsLoading(false);
    }

    useEffect(() => {
        getBloques();
        loadDataMiniChat(id_sub_hor,nom_mat);
    }, [id_sub_hor])

    const loadDataMiniChat = async(id_sub_hor:number,nom_mat:string) => {
        const {data} = await endeApi.get('/sub_hor/dataProfesorxSubHor/'+id_sub_hor);
        if(data.trans){
          const dataPro = data.data[0];
          dispatch(updateInfo(
            {
              id_emp: dataPro.id_emp,
              id_pro: dataPro.id_pro,
              nom_pro: dataPro.nom_emp+' '+dataPro.app_emp+' '+dataPro.apm_emp,
              fot_emp: dataPro.fot_emp,
              tipo: dataPro.tip_emp,
              id_sub_hor,
              materia: nom_mat
            }
          ));
        }
        return true;
    }

    return (
        (isLoading) 
        ? 
          <LoadingScreen/>
        :
          <SafeAreaView>
            <ScrollView style={{marginBottom: 70}}>
              {
                bloques.map((bloque:BloqueDataInfo)=>{
                  return (<TarjetaBloque key={bloque.id_blo} bloque_data={bloque} nom_mat={nom_mat}/>)
                })
              }
            </ScrollView>
            <View style={{paddingLeft: 20}}>
                <ChatAlumno/>
            </View>
          </SafeAreaView>
    )
}

export default Materias;