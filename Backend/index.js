const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoute = require('./Routes/uploadPdf.routes');
const categoryRoutes = require('./Routes/category.routes');
const userRoutes = require('./Routes/user.routes');
const authRoutes = require('./Routes/auth.routers');
const phonebookRoutes = require('./Routes/phoneBook.router');

const path = require('path');
const {sendEmail} = require('./emailServer');
const {sendEmailMgt} = require('./emailServerMgt');
require('dotenv').config();


const app = express(); // You missed this line in your provided code

app.use(cors({
  origin: 'http://10.10.1.80:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Use express.json() instead of body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (consider using an environment variable for the connection string)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  console.log('Request body:', req.body); // Add this line to log request bodies
  next();
});

// Routes
app.use('/api', uploadRoute);
app.use('/api', categoryRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', phonebookRoutes);


// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Add this route to your main server file
app.post('/api/sendemail', async (req, res) => {
  const { subject, body } = req.body;
  try {
    const info = await sendEmail(subject, body);
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});


app.post('/api/sendemailMgt', async (req, res) => {
  const { action, documentInfo } = req.body;
  try {
    if (!action || !documentInfo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    const info = await sendEmailMgt(action, documentInfo);
    res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      message: `Email sent successfully for ${action} action`
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message 
    });
  }
});


const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});