const net = require('net');
const nodemailer = require('nodemailer');

// SMTP Server Info
const host = "mail.lcbfinance.net";
const port = 25;

// Email categories and recipients
const emailCategories = {
  ADMIN: 'admin',
};

const emailRecipients = {
  [emailCategories.ADMIN]: ['ramila.b@lcbfinance.net'], // Add admin email(s) here
};

// Function to check connectivity (similar to telnet)
const checkSMTPConnection = async () => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    console.log('Attempting to connect to SMTP server...');

    client.setTimeout(5000); // 5 seconds timeout

    client.connect(port, host, () => {
      console.log('Connected to SMTP server');
      client.write('HELO lcbfinance.net\r\n');
    });

    client.on('data', (data) => {
      console.log('Received: ' + data.toString());
      if (data.toString().includes('220')) {
        console.log('SMTP server is ready');
        client.write('QUIT\r\n'); // Send QUIT command
        resolve();
      } else {
        console.log('SMTP server not responding correctly');
        reject(new Error('Invalid SMTP response'));
      }
    });

    client.on('timeout', () => {
      console.error('Connection timed out');
      client.destroy();
      reject(new Error('Connection timed out'));
    });

    client.on('error', (err) => {
      console.error('Connection error: ' + err.message);
      reject(err);
    });

    client.on('close', () => {
      console.log('Connection closed');
    });
  });
};

// Create a Nodemailer transporter using SMTP
let transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false, 
  auth: {
    user: 'inet@lcbfinance.net',
    pass: 'Password@123'
  },
  tls: {
    rejectUnauthorized: true
  },
  debug: true,
  logger: true
});

// Function to send email
const sendEmail = async (subject, body, category = emailCategories.ADMIN) => {
  try {
    console.log('Attempting to send email...');

    // Check SMTP connection first (Telnet-like)
    await checkSMTPConnection();

    // Get recipients based on category
    const recipients = emailRecipients[category];
    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients found for the specified category');
    }

    const info = await transporter.sendMail({
      from: 'inet@lcbfinance.net',
      to: recipients.join(', '),
      subject: subject,
      text: body,
      html: `<p>${body}</p>`,
    });

    console.log('Email sent successfully:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Verify Nodemailer transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

module.exports = { sendEmail, emailCategories };
