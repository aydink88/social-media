import Files from 'react-files';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import cogoToast from './cogo-toast';
import { changeImage } from '../stores/settings';
import { useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';

export default function ProfilePictureModal({ isVisible, toggle }) {
  const [file, setFile] = useState(null);
  const cropper = useRef();

  const onFileSelected = (File) => {
    setFile(File[0]);
  };

  const onFileError = (error) => {
    console.log(error);
    cogoToast.info(`Whoops, there was a problem with the image 🙈.`, {
      position: 'bottom-right',
    });
  };

  const uploadPicture = () => {
    const crop = cropper.current.cropper.getData();
    changeImage(file, crop).then(toggle);
  };

  return (
    <Modal show={isVisible} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Change Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-4" style={{ maxWidth: '400px' }}>
          {!file && (
            <Files
              className="dropzone mt-2"
              dropActiveClassName="dropzone--active"
              accepts={['image/png', 'image/jpg', 'image/jpeg']}
              onChange={onFileSelected}
              onError={onFileError}
              maxFileSize={10000000}
              minFileSize={0}
              clickable
            >
              <div className="d-flex flex-column h-100 justify-content-center">
                <h2 className="text-center">
                  <i className="far fa-file-image"></i>
                </h2>
                <p className="text-center mb-0">Drag and drop your image here or...</p>
                <p className="text-center mb-0 btn-link cursor-pointer">
                  Upload one from your device
                </p>
              </div>
            </Files>
          )}
          {file && (
            <Cropper
              ref={cropper}
              src={file.preview.url}
              style={{ height: 500, width: '100%' }}
              // Cropper.js options
              dragMode="move"
              zoomable={false}
              aspectRatio={1}
              viewMode={2}
              responsive={true}
              guides={false}
            />
          )}
        </div>
        <div className="float-right mt-2">
          <button className="btn btn-brand-secondary text-white mt-2" onClick={toggle}>
            Cancel
          </button>
          <button
            className="btn btn-brand text-white ml-1 mt-2"
            onClick={uploadPicture}
            disabled={!file}
          >
            Upload
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
