import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../Components/header';
import Footer from '../Components/footer';
import PdfComp from '../Components/pdfComp';
import { pdfjs } from 'react-pdf';
import CategoryCard from '../Components/pdfCard';
import { useNavigate } from 'react-router-dom';

// ✅ FIXED: Set PDF.js worker for production
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Policies = () => {
  const [categories, setCategories] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf] = useState(null);
  const [searchQueries, setSearchQueries] = useState({});
  const pdfViewerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and PDFs in parallel
        const [categoriesResponse, pdfsResponse] = await Promise.all([
          axios.get('https://intanet-b.onrender.com/api/categories'),
          axios.get('https://intanet-b.onrender.com/api/pdfs')
        ]);

        const filteredPdfs = pdfsResponse.data.filter(
          pdf => pdf.category === 'Policies' && pdf.pdfStatus === true
        );

        // Process categories with PDF counts
        const categoriesWithCounts = categoriesResponse.data.map(category => {
          const pdfCount = filteredPdfs.filter(
            pdf => pdf.subCategory === category.categoryName
          ).length;
          return { ...category, pdfCount };
        });

        // Sort categories by PDF count in ascending order
        const sortedCategories = categoriesWithCounts.sort((a, b) => b.pdfCount - a.pdfCount);

        setCategories(sortedCategories);
        setPdfs(filteredPdfs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handlePdfClick = (filePath) => {
    const encodedFilePath = encodeURIComponent(filePath);
    navigate(`/pdfView/${encodedFilePath}`);
  };

  const handleSearchChange = (e, categoryId) => {
    setSearchQueries((prevQueries) => ({
      ...prevQueries,
      [categoryId]: e.target.value,
    }));
  };

  const getSearchQueryForCategory = (categoryId) => {
    return searchQueries[categoryId] || '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div
        className="flex flex-1 flex-col sm:flex-row bg-cover bg-center"
        style={{ backgroundImage: "url('../assets/bg_img.svg')" }}
      >
        <main className="flex-1 p-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Policies</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <CategoryCard 
                key={category._id}
                category={category}
                searchQuery={getSearchQueryForCategory(category._id)}
                onSearchChange={handleSearchChange}
                pdfs={pdfs.filter(pdf => pdf.subCategory === category.categoryName)}
                formatDate={formatDate}
                handlePdfClick={handlePdfClick}
              />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Policies;
