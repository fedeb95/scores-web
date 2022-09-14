import {useState} from 'react';
import PDFViewer from './PDFViewer';
import ImageViewer from './ImageViewer';

const FileViewer = ({ file, setActiveFile }) => {

    const imageURL = URL.createObjectURL(file);
    return (
      <div>
          { file.type === "application/pdf"? 
              <PDFViewer pdfFile={file} setPdfFile={setActiveFile}/>
            :
              <ImageViewer image={file} setImageFile={setActiveFile}/>
          }
      </div>
    );
};

export default FileViewer;
