import {useState} from 'react';
import PDFViewer from './PDFViewer';

const ImageViewer = ({ image, setImageFile }) => {

    const imageURL = URL.createObjectURL(image);
    return (
      <div className="overflow-scroll">
        <div className="flex flex-row grow px-4 my-2">
            <button 
            className={"flex mx-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"}
            onClick={() => setImageFile(null)}>X</button> 
          </div>
          <div  
            className={"overflow-clip flex flex-col grow px-6"}
            style={{ height: "calc(100vh - 10.5rem)" }}
            >
            <div  
            className={"overflow-scroll"}
            // style={{ height: "calc(100vh - 10.5rem)" }}
            >
              <img src={imageURL}></img>
            </div>
        </div>

      </div>
    );
};

export default ImageViewer;
