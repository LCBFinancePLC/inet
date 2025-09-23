import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const CategoryCard = ({ category, pdfs, formatDate, handlePdfClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAndSortedPdfs = pdfs
    .filter(pdf => pdf.subCategory === category.categoryName && pdf.approval === true)
    .filter(pdf => 
      pdf.pdfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.pdfDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 mb-4 bg-gray-200 col-span-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold border-b-2 border-blue-500 pb-2 text-gray-700">
          {category.categoryName}
        </h2>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search PDFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pr-10 text-sm border border-blue-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-blue-300"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
            🔍
          </span>
        </div>
      </div>
      <div className="h-64 overflow-y-auto">
        <ul className="list-none p-0">
          {filteredAndSortedPdfs.map((pdf) => (
            <li key={pdf._id} className="mb-2 flex items-center">
              {pdf.approval === true ? (
                <a 
                  onClick={() => handlePdfClick(pdf.filePath)} 
                  className="text-blue-500 hover:underline cursor-pointer w-4/4 truncate" //adjust here to decrese length of pdf name
                  title={pdf.pdfName}
                >
                  {pdf.pdfName}
                </a>
              ) : (
                <span className="text-gray-400 w-1/4 truncate" title={pdf.pdfName}>
                  {pdf.pdfName} (Pending Approval)
                </span>
              )}
              {/* <div className="w-1/2 px-2">
                <span 
                  className="text-gray-600 truncate block" 
                  title={pdf.pdfDescription}
                >
                  {pdf.pdfDescription}
                </span>
              </div> */}
              <span className="text-gray-600 ml-auto">
                {formatDate(pdf.date)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
  }).isRequired,
  pdfs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      subCategory: PropTypes.string.isRequired,
      pdfName: PropTypes.string.isRequired,
     // pdfDescription: PropTypes.string,
      filePath: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      approval: PropTypes.bool.isRequired,
    })
  ).isRequired,
  formatDate: PropTypes.func.isRequired,
  handlePdfClick: PropTypes.func.isRequired,
};

export default CategoryCard;