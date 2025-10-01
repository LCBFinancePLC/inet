import { useState, useEffect, useRef } from 'react';

const PdfComp = ({ pdfFile, pdfName }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const canvasRef = useRef(null);

  // ✅ FIXED: Load PDF.js from CDN
  useEffect(() => {
    const loadPdfJs = () => {
      // Check if PDF.js is already loaded (from CDN)
      if (window.pdfjsLib) {
        setPdfjsLib(window.pdfjsLib);
        return;
      }

      // Load PDF.js from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // PDF.js loads itself into window['pdfjs-dist'] or window.pdfjsLib
        const pdfjs = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfjsLib(pdfjs);
      };
      document.head.appendChild(script);
    };

    loadPdfJs();
  }, []);

  useEffect(() => {
    if (!pdfjsLib || !pdfFile) return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfFile);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        
        // Render current page
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfjsLib, pdfFile, pageNumber]);

  // Loading state
  if (!pdfjsLib) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    );
  }

  return (
    <div className="pdf-container p-4">
      <h3 className="text-xl font-bold mb-4 text-center">{pdfName}</h3>
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-300 shadow-lg"></canvas>
      </div>
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button 
          disabled={pageNumber <= 1} 
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {pageNumber} of {numPages || 0}
        </span>
        <button 
          disabled={pageNumber >= (numPages || 0)} 
          onClick={() => setPageNumber(pageNumber + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfComp;
