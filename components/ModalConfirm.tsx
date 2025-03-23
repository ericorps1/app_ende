import { colors, platformTheme } from "@/theme/platformTheme";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ColorValue, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";

interface PropsConfirmModal {
    visible: boolean;
    title: string;
    message: any;
    buttonText: string;
    iconConfirmBtn?: string,
    styleButton?: any;
    colorTitle?: ColorValue;
    colorBody?: ColorValue;
    pressButton?: (() => void) | (() => Promise<void>);
    btnTxtCancel?: string;
    iconCancelBtn?: string;
    styleBtnCancel?: any;
    evtBtnCancel?: () => void
}
const ConfirmModal = ({
  visible,
  title,
  message,
  buttonText,
  iconConfirmBtn='',
  styleButton=[platformTheme.btn,platformTheme.btnSuccess,platformTheme.shadowBox,{marginTop: 10}],
  colorTitle=colors.darkBlue,
  colorBody=colors.darkSilver,
  pressButton=() => {return false},
  btnTxtCancel='',
  iconCancelBtn='',
  styleBtnCancel=[platformTheme.btn,platformTheme.btnDanger,platformTheme.shadowBox,{marginTop: 10}],
  evtBtnCancel=()=>{return false}
}:PropsConfirmModal) => {
  return (
    <Modal 
      isVisible={visible}
      onBackdropPress={() => evtBtnCancel()}
    >
      <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
        <Text style={[styles.title, {color: colorTitle}]}>{title}</Text>
        <Text style={[styles.body, {color: colorBody}]}>{message}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          { 
            btnTxtCancel!=='' && 
            <Button
              icon={iconCancelBtn}
              style={styleBtnCancel}
              textColor='white'
              onPress={() => evtBtnCancel()}
            >{btnTxtCancel}</Button>
          }
          <Button
            icon={iconConfirmBtn}
            style={styleButton}
            textColor='white'
            onPress={() => { 
              console.log("Confirmado");
              pressButton(); 
            }}
          >{buttonText}</Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  body: {
    fontSize: 15,
  }
});

export default ConfirmModal;
