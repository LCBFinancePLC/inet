import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Components/header';
import Footer from '../Components/footer';

const ResponsivePhonebookTable = () => {
  const [entries, setEntries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designations, setDesignations] = useState([]);

  // Predefined branches list
  const branches = [
    'Agunukolapelessa', 'Akuressa', 'Deiyandara', 'Embilipitiya', 'Galle', 
    'Gampaha', 'Head Office', 'Karandeniya', 'Karapitiya', 'Kegalle', 
    'Kohuwala', 'Kuliyapitiya', 'Matara', 'Maharagama', 'Negombo', 
    'Pelawaththa', 'Rathgama', 'Tangalle', 'Tissamaharama', 'Walasmulla'
  ];

  // Predefined designations list
  const presetDesignations = [
    'Board of Directors',  
    'Chief Executive Officer (CEO)',  
    'Chief Financial Officer (CFO)',  
    'Chief Operations Officer (COO)',  
    'Chief Marketing Officer (CMO)', 
    'Secretary',
    'Deputy General Manager (DGM)', 
    'Department Heads',  
    'Branch Managers',  
    'Regional Managers', 
    'Senior Executive',
    'Junior Executive', 
    'Loan Officers',  
    'Customer Service Representatives',  
    'Data Analysts',  
    'Accountants',  
    'Field Officers',  
    'Community Mobilizers',  
    'Administrative Assistants',  
    'Interns/Trainees'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch both entries and categories in parallel
        const [entriesResponse, categoriesResponse] = await Promise.all([
          axios.get('http://10.10.1.80:5000/api/entries'),
          axios.get('http://10.10.1.80:5000/api/categories')
        ]);
        
        const activeEntries = entriesResponse.data.filter(entry => entry.status === true);
        setEntries(activeEntries);
        setDepartments(categoriesResponse.data);
        
        // Extract unique designations from entries and combine with preset designations
        const entryDesignations = [...new Set(activeEntries.map(entry => entry.designation))];
        const allDesignations = [...new Set([...presetDesignations, ...entryDesignations])];
        setDesignations(allDesignations);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEntries = entries
    .filter((entry) =>
      Object.values(entry).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((entry) => (filterDepartment ? entry.department === filterDepartment : true))
    .filter((entry) => (filterBranch ? entry.branch === filterBranch : true))
    .filter((entry) => (filterDesignation ? entry.designation === filterDesignation : true));

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading phonebook data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-3xl font-bold text-center text-white">📞 Company Phonebook</h1>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search phonebook..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Department Filter */}
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.categoryName}>
                    {dept.categoryName}
                  </option>
                ))}
              </select>

              {/* Branch Filter */}
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Branches</option>
                {branches.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>

              {/* Designation Filter */}
              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Designations</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {['Name', 'Designation', 'Department', 'Branch', 'Extension', 'Mobile', 'Email'].map((header) => (
                      <th
                        key={header}
                        onClick={() => requestSort(header.toLowerCase())}
                        className="p-3 text-left font-bold cursor-pointer"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          {sortConfig.key === header.toLowerCase() && (
                            <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry, index) => (
                    <tr key={entry.id || entry._id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="p-3">{entry.name}</td>
                      <td className="p-3">{entry.designation}</td>
                      <td className="p-3">{entry.department}</td>
                      <td className="p-3">{entry.branch}</td>
                      <td className="p-3">{entry.extensionCode}</td>
                      <td className="p-3">{entry.mobile}</td>
                      <td className="p-3">{entry.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedEntries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl font-semibold mb-2 text-gray-800">😕 No results found</p>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResponsivePhonebookTable;