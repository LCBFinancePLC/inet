import { useState, useEffect, useRef } from 'react';

const PdfComp = ({ pdfFile, pdfName }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const canvasRef = useRef(null);

  // ✅ FIXED: Dynamically import PDF.js to avoid build issues
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // Dynamic import for production build compatibility
        const pdfjsModule = await import('pdfjs-dist/build/pdf');
        const pdfjs = pdfjsModule.default;
        
        // ✅ FIXED: Use CDN for worker in production
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        
        setPdfjsLib(pdfjs);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
      }
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
        
        // Render first page
        const page = await pdf.getPage(1);
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
  }, [pdfjsLib, pdfFile]);

  // ✅ FIXED: Add loading state
  if (!pdfjsLib) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    );
  }

  return (
    <div className="pdf-container p-4">
      <h3 className="text-xl font-bold mb-4">{pdfName}</h3>
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-300"></canvas>
      </div>
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button 
          disabled={pageNumber <= 1} 
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-lg">
          Page {pageNumber} of {numPages || 0}
        </span>
        <button 
          disabled={pageNumber >= (numPages || 0)} 
          onClick={() => setPageNumber(pageNumber + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfComp;
