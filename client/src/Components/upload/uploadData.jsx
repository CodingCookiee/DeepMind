import { IKContext, IKUpload } from 'imagekitio-react';
import PropTypes from 'prop-types'
import ThemeContext from '../../ThemeContext';
import { useContext, useRef } from 'react';

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY; 

const authenticator = async () => {
  try {
      const response = await fetch('http://localhost:8000/api/upload');
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
  } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImg }) => {
    const { theme } = useContext(ThemeContext);

    const ikUploadRef = useRef(null)

  const onError = err => {
      console.log("Error", err);
  };
    
  const onSuccess = res => {
      console.log("Success", res);
      setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };
    
  const onUploadProgress = progress => {
      console.log("Progress", progress);
  };
    
  // Modified onUploadStart to use the event parameter correctly
  const onUploadStart = (evt) => {
      console.log("Start", evt);
      setImg((prev) => ({ ...prev, isLoading: true }));
  };

  return (
      <IKContext
          urlEndpoint={urlEndpoint}
          publicKey={publicKey}
          authenticator={authenticator}
      >
          <IKUpload
              fileName="test-upload.png"
              onError={onError}
              onSuccess={onSuccess}
              useUniqueFileName={true}
              onUploadProgress={onUploadProgress}
              onUploadStart={onUploadStart}
              style={{display: 'none'}}
              ref={ikUploadRef}
          />
           <label
          className="border-none rounded-3xl p-1 flex 
          items-center justify-center cursor-pointer"
          onClick={()=> ikUploadRef.current.click()}
        >
          <img
            src={theme === "light" ? "/attach-dark.png" : "/attach-light.png"}
            alt=""
            className="w-6 h-6"
          />
        </label>

      </IKContext>
  );
};

Upload.propTypes = {
  setImg: PropTypes.func.isRequired
};

export default Upload;