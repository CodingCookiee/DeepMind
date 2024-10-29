import { IKContext, IKUpload } from 'imagekitio-react';
import PropTypes from 'prop-types'

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
          />
      </IKContext>
  );
};

Upload.propTypes = {
  setImg: PropTypes.func.isRequired
};

export default Upload;