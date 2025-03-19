import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Text, View, TextInput, Platform, KeyboardAvoidingView, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Background } from '@/components/Background';
import { WhiteLogo } from '@/components/WhiteLogo';
import { loginStyles } from '@/theme/loginTheme';
import { useForm } from '@/hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { colors } from '@/theme/platformTheme';
import { AlertMessage } from '@/components/AlertMessage';

const LoginScreen = () => {
    
    const { signIn, errorMessage, removeError } = useContext( AuthContext );
    const { email, password, onChange } = useForm({
       email: '',
       password: '' 
    });

    const [loading, setLoading] = useState(false);
    const [componentMsg, setComponentMsg] = useState(<></>);
    
    useEffect(() => {
        if( errorMessage !== '' )
          setComponentMsg(AlertMessage('Error en los datos', errorMessage, 'error', () => {removeError();setComponentMsg(<></>)}));

    }, [ errorMessage ])


    const onLogin = async () => {
        const emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!emailRegExp.test(email)){
            setComponentMsg(AlertMessage('Correo electrónico', 'Ingrese un correo electrónico válido.', 'error', () => {setComponentMsg(<></>)}));
            return;
        }else if(password.trim().length<3){
            setComponentMsg(AlertMessage('Contraseña', 'La contraseña debe contener al menos 4 caracteres.', 'error', () => {setComponentMsg(<></>)}));
            return;
        }
        Keyboard.dismiss();
        setLoading(true);
        await signIn({ correo: email, password });
        setLoading(false);
    }

    return (
        <>
            {/* Background */}
            <Background/>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={ (Platform.OS === 'ios') ? 'padding': 'height' }
            >

                <View style={ loginStyles.formContainer }>                
                    {/* Keyboard avoid view */}
                    <WhiteLogo />
                    <Text style={ loginStyles.label }>Escuela de negocios y desarrollo empresarial</Text>
                    <Text style={ loginStyles.title }>Plataforma ENDE</Text>

                    

                    <Text style={ loginStyles.label }>Correo electrónico:</Text>
                    <TextInput 
                        placeholder="Ingrese su correo:"
                        placeholderTextColor={colors.silver}
                        keyboardType="email-address"
                        underlineColorAndroid='white'
                        style={[ 
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) ? loginStyles.inputFieldIOS : loginStyles.inputFieldANDROID
                        ]}
                        selectionColor={colors.darkSilver}
                        onChangeText={ (value) => onChange(value, 'email') }
                        value={ email }
                        onSubmitEditing={ onLogin }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />


                    <Text style={ loginStyles.label }>Contraseña:</Text>
                    <TextInput 
                        placeholder="*********"
                        placeholderTextColor={colors.silver}
                        underlineColorAndroid="white"
                        secureTextEntry
                        style={[ 
                            loginStyles.inputField,
                            ( Platform.OS === 'ios' ) ? loginStyles.inputFieldIOS : loginStyles.inputFieldANDROID
                        ]}
                        selectionColor={colors.darkSilver}
                        onChangeText={ (value) => onChange(value, 'password') }
                        value={ password }
                        onSubmitEditing={ onLogin }
                        autoCapitalize="none"
                        autoCorrect={ false }
                    />


                    {/* Boton login */}
                    <View style={ loginStyles.buttonContainer }>
                        <TouchableOpacity
                            activeOpacity={ 0.2 }
                            style={{ ...loginStyles.button, flexDirection: 'row' }}
                            onPress={ onLogin }
                            disabled={ loading }
                        >
                            {(loading) && <ActivityIndicator size={20} color="white"/>}
                            <Text 
                                style={ {...loginStyles.buttonText} }
                            >
                                {(loading) ? 'Iniciando...' : 'Iniciar sesión'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    
                </View>
                
            </KeyboardAvoidingView>
            {componentMsg}
        </>
    )
}

export default LoginScreen;