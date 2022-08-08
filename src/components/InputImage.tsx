import React, {ChangeEvent, ReactNode} from 'react';
import './InputImage.css';

export interface IInputImageProps {
  onUploadImage: (encodedImg: string) => void,
  children?: ReactNode
}

const InputImage: React.FunctionComponent<IInputImageProps> = ({onUploadImage, children}) => {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const file = e.target.files[0];
      const encodedFile = await encodeBase64(file);
      onUploadImage((encodedFile as string));
    }
  };

  const encodeBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  return (
    <label className='input-image'>
      { children }
      <input type="file"
             name="myFile"
             accept=".jpeg, .png, .jpg"
             onChange={(e) => handleFileUpload(e)}
      />
      <p>Select a file</p>
    </label>
  );
}

export default InputImage;