import { Image } from "react-native";

/**
 * Geets the size of an image using Image.getSize
 * promisified.
 * 
 * @param uri - image uri
 * @returns width and height of the image
 */
const getImageSize = function (uri: string) : Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        Image.getSize(uri, (width, height) => {
            resolve({width, height});
        }, reject);
  });
}

export {
    getImageSize
}