import React from 'react'
import RenderHtml, { CustomBlockRenderer } from 'react-native-render-html';
import { Image, Platform, Text, useWindowDimensions, View } from 'react-native';
import { cleanHtmlRenderHtml } from '../hooks/useFormats';
import { WebView } from "react-native-webview";

interface PropsHtmlToJsx {
    strHtml: string;
    styles?: string;
}

export const HtmlToJsx = ({strHtml,styles='margin: 10px; padding-bottom: 10px'}:PropsHtmlToJsx) => {
  const { width } = useWindowDimensions();
  const widthRender = Platform.OS !== 'ios' ? width-100 : width;

  // (TypeScript) Notice the type for intellisense
  const TableRenderer: CustomBlockRenderer = function TableRenderer({ TDefaultRenderer, ...props }) {
      // console.log(props.sharedProps);
      return <TDefaultRenderer {...props} style={ { ...props.style, maxWidth: width-80, borderColor: 'black' } }/>;
  }
  const TrRenderer: CustomBlockRenderer = function TrRenderer({ TDefaultRenderer, ...props }) {
      // console.log(props.sharedProps);
      return <TDefaultRenderer {...props} style={ { ...props.style, height: 'auto', borderWidth: 1 } }/>;
  }
  const TdRenderer: CustomBlockRenderer = function TdRenderer({ TDefaultRenderer, ...props }) {
      return <TDefaultRenderer {...props} style={ { ...props.style, height: 'auto', borderWidth: 1 } }/>;
  }
  // const CustomImg = (props:any) => {
  //   console.log('image props =>> ', props.src);
  //   return <Image {...props} source={{ uri: props.src }} style={{ ...props.style, width: props.width, height: props.height }} />
  // };
  // const renderersProps = {
  //   img: {
  //     enableExperimentalPercentWidth: true, // Asegura el ancho
  //     enableExperimentalResponsiveInlineStyles: true, // Permite estilos inline
  //     baseUrl: "", // Ayuda a resolver rutas relativas
  //   },
  // };
  const CustomImg = (props:any) => {
    console.log("Image full props =>>", props);
  
    // Extraemos `src` correctamente desde tnode
    const imageUri = props?.tnode?.attributes?.src || "";
  
    if (!imageUri) {
      console.log("⚠️ No src found, skipping image");
      return null;
    }
  
    return (
      <Image
        source={{ uri: imageUri }}
        style={{
          width: "100%", // Que ocupe el 100% del ancho del contenedor
          height: undefined, // Para mantener la proporción
          aspectRatio: 1, // Ajusta el aspect ratio si es necesario
          resizeMode: "contain", // Evita distorsión
        }}
      />
    );
  };
  

  const CustomRenderer = ({ text = "Texto predeterminado", ...props }) => {
    return <Text {...props} style={{ fontWeight: "bold" }}>{text}</Text>;
  };

  const renderers = { td: TdRenderer, tr: TrRenderer, table: TableRenderer, img: CustomImg, text: CustomRenderer,}
  const cleanHTML = cleanHtmlRenderHtml(strHtml);
  return (
    <RenderHtml
      contentWidth={width-10}
      source={{html: `<div style="width: ${width};${styles}">${cleanHTML}</div>`}}
      enableExperimentalMarginCollapsing={true}
      // renderersProps={renderersProps}
      renderers={renderers}
      tagsStyles={
        {
          p: {
            maxWidth: widthRender,
          },
          strong: {
            maxWidth: widthRender,
            margin: 0,
          },
        }
      }
    />
  )
}
