import endeApi from '@/api/estudianteAPI'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { AuthContext } from '@/context/AuthContext'
import { FormatNameAvatar } from '@/hooks/useFormats'
import { colors, platformTheme, statusColors } from '@/theme/platformTheme'
import { Feather, FontAwesome, FontAwesome6, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { router, usePathname } from 'expo-router'
import Drawer from 'expo-router/drawer'
import { useContext, useEffect, useState } from 'react'
import { Image, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'

const CustomDrawerContent = (props:any) => {
  const { logOut, data_alumno } = useContext( AuthContext );
  const pathname = usePathname();
  const [materiasAlumno, setMateriasAlumno] = useState([])
  const getMateriasAlumno = async () => {
    const {data} = await endeApi.get('/alu_hor',{ params: { id_alu_ram: data_alumno?.id_alu_ram } });
    if(data.trans===true){
      setMateriasAlumno(data.data);
    }
  }

  useEffect(() => {
      getMateriasAlumno();
  }, [])
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity 
        style={ platformTheme.avatarContent }
        onPress={() => router.push('/(drawer)/(tabs)/profile')}
      >
        { (data_alumno?.fot_alu) 
          ? (
            <Image 
                source={{ uri: 'https://plataforma.ahjende.com/uploads/'+data_alumno?.fot_alu}}
                style={ platformTheme.avatar }
            />
          )
          : (
            <Avatar.Text style={ platformTheme.avatar } label={FormatNameAvatar(data_alumno?.nom_alu)} />
          )
        }
        <Text style={ platformTheme.avatarName }> { data_alumno?.nom_alu } </Text>
      </TouchableOpacity>
      <DrawerItem
        icon={({color, size}) => (
          <IconSymbol size={28} name="house.fill" color={colors.darkSilver} />
        )}
        label={"Inicio"}
        labelStyle={[styles.labelDrawer, pathname === '/' ? styles.activeLabelDrawer : {}]}
        style={[styles.drawer, pathname === '/' ? styles.activeDrawer : {}]}
        onPress={() => router.push('/(drawer)/(tabs)')}
      />
      <DrawerItem
        icon={({color, size}) => (
          <FontAwesome6 name="hand-holding-dollar" size={24} color={colors.darkSilver} />
        )}
        label={"Pagos"}
        labelStyle={[styles.labelDrawer, pathname === '/pagos' ? styles.activeLabelDrawer : {}]}
        style={[styles.drawer, pathname === '/pagos' ? styles.activeDrawer : {}]}
        onPress={() => router.push('/(drawer)/pagos')}
      />
      {
        (materiasAlumno.length>0) && (
          materiasAlumno.map(({nom_mat,nom_gru,id_sub_hor}) => {
            return (
              <DrawerItem
                key={id_sub_hor}
                icon={({color, size}) => (
                  <FontAwesome name="book" size={24} color={colors.darkSilver} />
                )}
                label={nom_mat+'/'+nom_gru}
                // labelStyle={[styles.labelDrawerMat, pathname === '/materias' ? styles.activeLabelDrawer : {}]}
                labelStyle={styles.labelDrawerMat}
                // style={[styles.drawer, pathname === '/materias' ? styles.activeDrawer : {}]}
                style={styles.drawer}
                onPress={()=> router.push({ pathname: "/materias", params: { ...{id_sub_hor,nom_mat} } })}
              />
            )
          })
        )
      }
      <DrawerItem
        icon={({color, size}) => (
          <SimpleLineIcons name="logout" size={24} color={colors.darkSilver} />
        )}
        label={"Cerrar sesión"}
        labelStyle={styles.labelDrawer}
        style={styles.drawer}
        onPress={logOut}
      />
    </DrawerContentScrollView>
  )
}

export const Layout = () => {
  return (
    <Drawer drawerContent={(props)=><CustomDrawerContent {...props}/>} screenOptions={{title: ''}} />
  )
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: colors.white
  },
  labelDrawer: {
    fontSize: 18
  },
  labelDrawerMat: {
    fontSize: 14
  },
  activeLabelDrawer: {
    color: colors.white
  },
  activeDrawer: {
    backgroundColor: colors.primary
  }
})

export default Layout;
