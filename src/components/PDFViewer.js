import {useState, useLayoutEffect} from 'react';
import { Document,Page } from 'react-pdf/dist/esm/entry.webpack';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useLayoutEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowDimensions;
  }

const PDFViewer = ({ pdfFile, setPdfFile }) => {

    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [pdfScale, setPdfScale] = useState(1);


    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    const { height, width } = useWindowDimensions();

    return (
        <div className="overflow-clip">
            <div className="flex flex-row grow px-4 my-2">
                <button 
                className={"flex mx-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"}
                onClick={() => setPdfFile(null)}>X</button>
                <button 
                className={"flex mx-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"}
                onClick={() => setPageNumber(pageNumber > 1? pageNumber - 1 : 1)}>Previous</button>
                <button 
                className={"flex mx-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"}
                onClick={() => setPageNumber(pageNumber < numPages? pageNumber + 1 : numPages)}>Next</button>

                <p>{pageNumber} / {numPages}</p>
            </div>
            <div className="flex flex-row grow px-8">
                <p>&#128270; {Math.floor(pdfScale * 100)}%</p>
                <button 
                className={"flex px-2"}
                onClick={() => setPdfScale(pdfScale < 2? pdfScale + 0.1 : 2)}>&#10133;</button>
                <button 
                className={"flex px-2"}
                onClick={() => setPdfScale(pdfScale > 0.1? pdfScale - 0.1 : 0.1)}>&#10134;</button>
            </div>

            <div  
            className={"overflow-clip flex flex-col grow"}
            style={{ height: "calc(100vh - 10.5rem)" }}
            >
                <div className="overflow-auto">
                    <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page  
                            height={height - 10}
                            width={width-10}
                            scale={pdfScale} 
                            pageNumber={pageNumber} />
                    </Document>
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
