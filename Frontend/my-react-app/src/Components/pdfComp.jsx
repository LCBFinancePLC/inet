
// PdfComp.js
import { useState, useEffect, useRef } from "react";
import { Document, Page } from "react-pdf";
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react'; 

function PdfComp({ pdfFile, pdfName }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const currentRef = pdfContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("contextmenu", handleContextMenu);
      }
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleZoomIn = () => {
    setScale(scale + 0.2);
  };

  const handleZoomOut = () => {
    if (scale > 0.6) setScale(scale - 0.2);
  };

  const handlePageInput = (e) => {
    const value = e.target.value;
    const page = parseInt(value, 10);

    if (value === "") {
      setPageNumber("");
    } else if (!isNaN(page) && page > 0 && page <= numPages) {
      setPageNumber(page);
    }
  };

  const handlePageInputBlur = () => {
    if (pageNumber === "" || pageNumber < 1) {
      setPageNumber(1);
    } else if (pageNumber > numPages) {
      setPageNumber(numPages);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };


  const backBtn = () => {
    window.history.back();
  };



  return (
    <div className="h-screen flex flex-col items-center bg-gray-50 text-gray-700">
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10 py-4 px-6">
        <h2 className="text-lg font-semibold mb-2">{pdfName}</h2>

        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={handleZoomIn} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Zoom In
          </button>
          <button 
            onClick={handleZoomOut} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Zoom Out
          </button>
          <div className="flex items-center space-x-2">
            <p>Page</p>
            <input
              type="text"
              value={pageNumber}
              onChange={handlePageInput}
              onBlur={handlePageInputBlur}
              className="border border-gray-300 rounded px-2 py-1 w-16 text-center bg-blue-200"
            />
            <p>of {numPages}</p>
          </div>
          <button 
            onClick={goToPreviousPage} 
            disabled={pageNumber <= 1} 
            className={`px-4 py-2 rounded ${pageNumber <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition'}`}
          >
            Previous
          </button>
          <button 
            onClick={goToNextPage} 
            disabled={pageNumber >= numPages} 
            className={`px-4 py-2 rounded ${pageNumber >= numPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition'}`}
          >
            Next
          </button>

          <button 
  onClick={backBtn} 
  className="fixed top-4 right-4 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
>
  <ArrowLeft size={24} />
</button>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-scroll mt-24 w-full max-w-4xl px-6 py-8"
        ref={pdfContainerRef}
      >
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="shadow-lg rounded-lg"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}

PdfComp.propTypes = {
  pdfFile: PropTypes.string.isRequired,
  pdfName: PropTypes.string.isRequired,
};

export default PdfComp;