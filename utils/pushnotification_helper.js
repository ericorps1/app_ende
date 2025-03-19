// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     // console.log('Authorization status:', authStatus);
//     await GetFCMToken();
//   }
// }

// async function GetFCMToken(){
//     let fcmtoken = await AsyncStorage.getItem('fcmtoken');
//     // console.log(fcmtoken, 'old token');
//     if(!fcmtoken){
//         try {
//             fcmtoken= await messaging().getToken();
//             // console.log(fcmtoken,'Token generado desde firebase');
//             if(fcmtoken){
//                 await AsyncStorage.setItem('fcmtoken', fcmtoken);
//             }
//         } catch (error) {
//             console.log(error, 'Error tratando de capturar el token de notificaciones');    
//         }
//     }
// }

// export const NotificationListener = () => {
//     messaging()
//         .onNotificationOpenedApp(remoteMessage => {//evento cuando se oprime en la notificación recibida en el dispositivo
//             console.log(
//                 'Notification caused app to open from background state:',
//                 remoteMessage.notification,
//             );
//             // navigation.navigate(remoteMessage.data.type);
//         });
//     // Check whether an initial notification is available
//     messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//             if (remoteMessage) {
//                 console.log(
//                     'Notification caused app to open from quit state:',
//                     remoteMessage.notification,
//                 );
//                 // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//             }
//         });
//     messaging().onMessage(async remoteMessage => {//evento cuando la app esta en uso y se recibe una notificación
//         console.log("notificacion en segundo plano", remoteMessage);
//     });
// }