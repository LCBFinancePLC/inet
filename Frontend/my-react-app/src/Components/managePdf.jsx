import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PDFManagement = ({ isOpen, onClose }) => {
  const [pdfs, setPdfs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPdf, setEditingPdf] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = ['Circulars', 'Policies', 'Tutorials', 'Applications'];

  useEffect(() => {
    if (isOpen) {
      fetchPdfs();
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get('http://10.10.1.80:5000/api/pdfs');
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://10.10.1.80:5000/api/categories');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleEdit = (pdf) => {
    setEditingPdf({ ...pdf });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://10.10.1.80:5000/api/pdfs/${editingPdf._id}`, editingPdf);
      if (response.status === 200) {
        setSuccessMessage('Details updated successfully!');
        setEditingPdf(null);
        fetchPdfs();
      }
    } catch (error) {
      setErrorMessage('Failed to update. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://10.10.1.80:5000/api/pdfs/${id}`);
      if (response.status === 200) {
        setSuccessMessage('PDF deleted successfully!');
        fetchPdfs();
      }
    } catch (error) {
      setErrorMessage('Failed to delete. Please try again.');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus; // Toggle the current status

      // Send the PUT request to the backend to update pdfStatus
      await axios.put(`http://10.10.1.80:5000/api/pdfs/${id}`, {
        pdfStatus: newStatus, // Use pdfStatus instead of pdfstatus
      });

      setSuccessMessage(`PDF status updated to ${newStatus ? 'Active' : 'Inactive'}`);
      // After successful update, fetch the updated list of PDFs to reflect the change
      fetchPdfs();
    } catch (error) {
      console.error('Error updating PDF status:', error);
      setErrorMessage('Failed to update status. Please try again.');
    }
  };


  const filteredPdfs = pdfs.filter(pdf =>
    pdf.pdfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-7xl w-full max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">PDF Management</h2>
        <input
          type="text"
          placeholder="Search by PDF Name, Category, or Department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">PDF Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Added Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPdfs.map((pdf) => (
              <tr key={pdf._id}>
                <td className="border p-2">
                  {editingPdf && editingPdf._id === pdf._id ? (
                    <input
                      value={editingPdf.pdfName}
                      onChange={(e) => setEditingPdf({ ...editingPdf, pdfName: e.target.value })}
                      className="border p-1 w-full"
                    />
                  ) : (
                    pdf.pdfName
                  )}
                </td>
                <td className="border p-2">
                  {editingPdf && editingPdf._id === pdf._id ? (
                    <input
                      value={editingPdf.pdfDescription}
                      onChange={(e) => setEditingPdf({ ...editingPdf, pdfDescription: e.target.value })}
                      className="border p-1 w-full"
                    />
                  ) : (
                    pdf.pdfDescription
                  )}
                </td>
                <td className="border p-2">
                  {editingPdf && editingPdf._id === pdf._id ? (
                    <select
                      value={editingPdf.category}
                      onChange={(e) => setEditingPdf({ ...editingPdf, category: e.target.value })}
                      className="border p-1 w-full"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  ) : (
                    pdf.category
                  )}
                </td>
                <td className="border p-2">
                  {editingPdf && editingPdf._id === pdf._id ? (
                    <select
                      value={editingPdf.subCategory}
                      onChange={(e) => setEditingPdf({ ...editingPdf, subCategory: e.target.value })}
                      className="border p-1 w-full"
                    >
                      {departments.map((subCategory) => (
                        <option key={subCategory._id} value={subCategory.categoryName}>
                          {subCategory.categoryName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    pdf.subCategory
                  )}
                </td>




                <td className="border p-2">
                  {new Date(pdf.date).toLocaleDateString()}
                </td>






                <td className="border p-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={pdf.pdfStatus} // Reflect the current status from the database
                      onChange={() => handleToggleStatus(pdf._id, pdf.pdfStatus)} // Toggle status on click
                    />
                    <div
                      className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}
                    ></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {pdf.pdfStatus ? 'Active' : 'Inactive'} {/* Display status based on pdf.pdfstatus */}
                    </span>
                  </label>
                </td>





                <td className="border p-2">
                  {editingPdf && editingPdf._id === pdf._id ? (
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(pdf)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(pdf._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PDFManagement;