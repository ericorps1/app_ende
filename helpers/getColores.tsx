import { colors } from "@/theme/platformTheme";

export const getImageColors = async (uri: string) => {
    // const imagecolors = await ImageColors.getColors(uri, {})
    // let primary;
    // let secondary;
    // switch (imagecolors.platform) {
    //     case 'android':
    //         // android imagecolors properties
    //         primary = imagecolors.dominant;
    //         secondary = imagecolors.average;
    //         break
    //     case 'ios':
    //         // iOS imagecolors properties
    //         primary = imagecolors.primary;
    //         secondary = imagecolors.secondary;
    //         break
    //     default:
    //         // iOS imagecolors properties
    //         primary = '#000000';
    //         secondary = '#FFFFFF';
    //         break
    // }
    return [colors.softBlue,colors.primary]
}