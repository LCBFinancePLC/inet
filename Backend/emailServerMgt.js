const nodemailer = require('nodemailer');
const axios = require('axios');

// SMTP Server Configuration
const SMTP_CONFIG = {
  host: "mail.lcbfinance.net",
  port: 25,
  user: 'inet@lcbfinance.net',
  password: 'Password@123'
};

// API Configuration
const API_CONFIG = {
  baseUrl: 'http://10.10.1.80:5000/api',
  endpoints: {
    pdfs: '/pdfs'
  }
};


// Add this at the top of the file, with other constants
const EMAIL_RECIPIENTS = {
  ALL_USERS: 'upendra.n@lcbfinance.net'  // Replace with your actual distribution list email
};

// Create Nodemailer Transporter with detailed logging
const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: false,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.password
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// Verify SMTP connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP Connection Error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    return false;
  }
};

// Function to get notification email from API
const getNotificationEmail = async (pdfId) => {
  try {
    const response = await axios.get(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.pdfs}`);
    const pdfDoc = response.data.find(doc => doc._id === pdfId || doc.pdfName === pdfId);
    
    if (!pdfDoc) {
      throw new Error(`PDF document not found with ID/Name: ${pdfId}`);
    }

    // Extract email from the format "name@lcbfinance.net (Manager)"
    const emailMatch = pdfDoc.notificationEmail.match(/([a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]+)/);
    if (!emailMatch) {
      throw new Error(`Invalid email format in notification email: ${pdfDoc.notificationEmail}`);
    }

    return {
      email: emailMatch[1],
      documentDetails: pdfDoc
    };
  } catch (error) {
    console.error('Error fetching notification email:', error);
    throw new Error(`Failed to fetch notification email: ${error.message}`);
  }
};

const sendEmailMgt = async (action, documentInfo) => {
  try {
    // Verify connection before sending
    const isConnected = await verifyConnection();
    if (!isConnected) {
      throw new Error('Failed to establish SMTP connection');
    }

    // Validate input parameters
    if (!documentInfo || !documentInfo.pdfName || !documentInfo.category || !documentInfo.subCategory) {
      throw new Error('Invalid document information provided');
    }

    let emailContent;
    if (action === 'approve') {
      emailContent = {
        from: SMTP_CONFIG.user,
        to: EMAIL_RECIPIENTS.ALL_USERS,
        subject: `New Document Approved: ${documentInfo.pdfName}`,
        html: `
          <h2>New Document Available</h2>
          <p>A new document has been approved and is now available for viewing.</p>
          <p><strong>Document Details:</strong></p>
          <ul>
            <li>Name: ${documentInfo.pdfName}</li>
            <li>Category: ${documentInfo.category}</li>
            <li>Department: ${documentInfo.subCategory}</li>
            <li>Approval Date: ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>You can access this document through the document management system.</p>
        `
      };
    } else if (action === 'reject') {
      try {
        // Get notification email and document details from the API
        const { email, documentDetails } = await getNotificationEmail(documentInfo._id || documentInfo.pdfName);
        
        emailContent = {
          from: SMTP_CONFIG.user,
          to: email,
          subject: `Document Rejected: ${documentDetails.pdfName}`,
          html: `
            <h2>Document Rejection Notice</h2>
            <p>A document from your department has been rejected.</p>
            <p><strong>Document Details:</strong></p>
            <ul>
              <li>Name: ${documentDetails.pdfName}</li>
              <li>Category: ${documentDetails.category}</li>
              <li>Department: ${documentDetails.subCategory}</li>
              <li>File Description: ${documentDetails.pdfDescription}</li>
              <li>Rejection Date: ${new Date().toLocaleDateString()}</li>
            </ul>
            <p>Please review the document and make necessary adjustments before resubmitting.</p>
          `
        };
      } catch (error) {
        console.error('Error processing rejection email:', error);
        throw new Error(`Failed to process rejection email: ${error.message}`);
      }
    } else {
      throw new Error('Invalid action specified');
    }

    console.log('Attempting to send email with content:', {
      to: emailContent.to,
      subject: emailContent.subject,
      action
    });

    const info = await transporter.sendMail(emailContent);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response
    });

    return info;

  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    };
    console.error('Detailed error in sendEmailMgt:', errorDetails);
    throw error;
  }
};

module.exports = {
  sendEmailMgt,
  verifyConnection
};