import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../Components/header';
import Footer from '../Components/footer';
import CategoryCard from '../Components/pdfCard';

const Tutorials = () => {
  const [categories, setCategories] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [searchQueries, setSearchQueries] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://10.10.1.80:5000/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPdfs = async () => {
      try {
        const response = await axios.get(`http://10.10.1.80:5000/api/pdfs`);
        const filteredPdfs = response.data.filter(pdf => pdf.category === 'Tutorials' && pdf.pdfStatus === true);
        setPdfs(filteredPdfs);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };


    fetchCategories();
    fetchPdfs();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and PDFs in parallel
        const [categoriesResponse, pdfsResponse] = await Promise.all([
          axios.get('http://10.10.1.80:5000/api/categories'),
          axios.get('http://10.10.1.80:5000/api/pdfs')
        ]);
  
        const filteredPdfs = pdfsResponse.data.filter(
          pdf => pdf.category === 'Tutorials' && pdf.pdfStatus === true
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
    const fullPath = `http://10.10.1.80:5000/${filePath}`;
    window.open(fullPath, '_blank');
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Tutorials</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
  <CategoryCard 
    key={category._id}          // Changed from category.id to category._id
    category={category}
    searchQuery={getSearchQueryForCategory(category._id)}
    onSearchChange={handleSearchChange}
    pdfs={pdfs.filter(pdf => pdf.subCategory === category.categoryName)}  // Filter PDFs per category
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

export default Tutorials;