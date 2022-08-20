import React, {ChangeEvent, ReactNode} from 'react';
import './InputImage.css';
import Resizer from "react-image-file-resizer";

export interface IInputImageProps {
  onUploadImage: (encodedImg: string) => void,
  children?: ReactNode,
  className?: string,
  disabled?: boolean
}

const InputImage: React.FunctionComponent<IInputImageProps> = ({onUploadImage, children, className, disabled=false}) => {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const file = e.target.files[0];
      const lengthThreshold = 102000;
      let qualityThreshold = 90;
      let encodedFile = await resizeFile(file, qualityThreshold);
      // Adjusts the size of the resulting image to fit the constraints of the DB.
      while((encodedFile as string).length > lengthThreshold && qualityThreshold >= 40) {
        qualityThreshold -= 10;
        encodedFile = await resizeFile(file, qualityThreshold);
      }

      // Saves the adjusted file.
      onUploadImage((encodedFile as string));
    }
  };

  /** Resizes the file and returns it as base64 string. */
  const resizeFile = (file: File, qualityThreshold: number) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        980,
        980,
        "JPEG",
        qualityThreshold,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  return (
    <label className='input-image'>
      { children }
      <input type="file"
             name="myFile"
             accept=".jpeg, .png, .jpg"
             onChange={(e) => handleFileUpload(e)}
             disabled={disabled}
      />
      <p className={className}>Select a file</p>
    </label>
  );
}

export default InputImage;