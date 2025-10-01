import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf'; // ✅ CORRECT IMPORT
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry?url'; // ✅ WORKER IMPORT

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfComp = ({ pdfFile, pdfName }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfFile);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        
        // Render first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfFile]);

  return (
    <div className="pdf-container">
      <h3>{pdfName}</h3>
      <canvas ref={canvasRef}></canvas>
      <div>
        <button disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
          Previous
        </button>
        <span>Page {pageNumber} of {numPages}</span>
        <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfComp;
