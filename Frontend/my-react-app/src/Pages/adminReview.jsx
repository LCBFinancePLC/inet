import Header from '../Components/headerAdmin';
import Footer from '../Components/footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EMAIL_CATEGORIES = {
  ALL_USERS: 'all_users',
  MANAGER_CREDIT: 'Credit',
  MANAGER_FINANCE: 'Finance',
  MANAGER_IT_DEPARTMENT: 'IT Department',
  MANAGER_HUMAN_RESOURCES: 'Human Resources',
  MANAGER_LEGAL: 'Legal',
  MANAGER_OPERATIONS: 'Operations',
};

const API_BASE_URL = 'http://10.10.1.80:5000/api';

// Add this at the top of the file, with other constants
const EMAIL_RECIPIENTS = {
  ALL_USERS: 'upendra.n@lcbfinance.net'  // Replace with your actual distribution list email
};


// Remove unused email categories since we're now using notification emails from the API
const AdminDocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [processingDocId, setProcessingDocId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pdfs`);
      const unapprovedDocs = response.data.filter(doc => !doc.approval);
      setDocuments(unapprovedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setMessage({ 
        type: 'error', 
        content: 'Failed to fetch documents: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  const sendEmailNotification = async (action, documentInfo) => {
    try {
      // Validate required document information
      if (!documentInfo || !documentInfo._id) {
        throw new Error('Invalid document information');
      }

      // Updated email data structure to match the new backend expectations
      const emailData = {
        action,
        documentInfo: {
          _id: documentInfo._id,
          pdfName: documentInfo.pdfName,
          category: documentInfo.category,
          subCategory: documentInfo.subCategory,
          pdfDescription: documentInfo.pdfDescription,

        },
        
      };

      const response = await axios.post(`${API_BASE_URL}/sendemailMgt`, emailData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // Increased timeout to 10 seconds
      });

      if (response.data && response.data.success) {
        console.log(`Email sent successfully for ${action} action`);
        return true;
      } else {
        throw new Error(response.data?.message || 'Email sending failed');
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw new Error(error.response?.data?.message || error.message || 'Email sending failed');
    }
  };

  const handleAction = async (id, action) => {
    setIsLoading(true);
    setProcessingDocId(id);
    try {
      // Step 1: Get document information
      const docResponse = await axios.get(`${API_BASE_URL}/pdfs/${id}`);
      if (!docResponse.data) {
        throw new Error('Document not found');
      }
      const doc = docResponse.data;

      if (action === 'approve') {
        // First try to send email notification
        try {
          await sendEmailNotification('approve', doc);
        } catch (emailError) {
          console.warn('Approval email failed:', emailError);
          // Continue with approval even if email fails
        }

        // Update document approval status
        const updateResponse = await axios.put(`${API_BASE_URL}/pdfs/${id}`, {
          approval: true
        });

        if (updateResponse.status === 200) {
          setMessage({
            type: 'success',
            content: 'Document approved successfully'
          });
        }
      } else if (action === 'reject') {
        // For rejection, first send email notification
        try {
          await sendEmailNotification('reject', doc);
          
          // Only proceed with deletion if email was sent successfully
          const deleteResponse = await axios.delete(`${API_BASE_URL}/pdfs/${id}`);
          if (deleteResponse.status === 200) {
            setMessage({
              type: 'success',
              content: 'Document rejected and notification sent successfully'
            });
          }
        } catch (emailError) {
          throw new Error(`Failed to send rejection notification: ${emailError.message}`);
        }
      }

      // Refresh document list
      await fetchDocuments();
    } catch (error) {
      console.error(`Error performing ${action} on document:`, error);
      
      setMessage({
        type: 'error',
        content: `Failed to ${action} document: ${error.message}`
      });
    } finally {
      setIsLoading(false);
      setProcessingDocId(null);
    }
  };

  // Rest of the component remains the same...
  const viewPdf = async (pdfLink) => {
    const baseUrl = 'http://10.10.1.80:5000/';
    window.open(`${baseUrl}${pdfLink}`, '_blank');
  };

  const formatDescription = (description) => {
    const words = description.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > 20) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const getMessageClass = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header className="fixed top-0 left-0 right-0 z-10" />
      <main className="flex-grow mt-16 mb-16 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Document Review</h1>
          {message.content && (
            <div className={`p-4 mb-4 rounded ${getMessageClass(message.type)}`}>
              {message.content}
            </div>
          )}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Document Name</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Document Type</th>
                  <th className="py-3 px-6 text-left">Department</th>
                  <th className="py-3 px-6 text-left">Upload Date</th>
                  <th className="py-3 px-6 text-center">View PDF</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-lg">
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{doc.pdfName}</td>
                    <td className="py-3 px-6 text-left">
                      <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <span className="inline-block">
                          {formatDescription(doc.pdfDescription)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{doc.category}</td>
                    <td className="py-3 px-6 text-left">{doc.subCategory}</td>
                    <td className="py-3 px-6 text-left">{new Date(doc.date).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => viewPdf(doc.filePath)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                        disabled={isLoading && processingDocId === doc._id}
                      >
                        View
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleAction(doc._id, 'approve')}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-50"
                          disabled={isLoading && processingDocId === doc._id}
                        >
                          {isLoading && processingDocId === doc._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(doc._id, 'reject')}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-50"
                          disabled={isLoading && processingDocId === doc._id}
                        >
                          {isLoading && processingDocId === doc._id ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer className="fixed bottom-0 left-0 right-0 z-10" />
    </div>
  );
};

export default AdminDocumentReview;