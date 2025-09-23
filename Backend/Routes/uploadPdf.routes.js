const express = require('express');
const multer = require('multer');
const Pdf = require('../Model/pdf.model'); // Assuming you have a Pdf model defined
const { viewPdfs, getAllPdfs, getPdfById, updatePdf, deletePdf } = require('../Controller/pdf.controller'); // Import the controller functions
const path = require('path');
const { send } = require('process');
const { sendEmail } = require('../emailServer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/pdfupload', upload.single('file'), async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('File:', req.file);
  console.log('Body:', req.body);
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { pdfName, pdfDescription, category, subCategory, notificationEmail } = req.body;
    const filePath = req.file.path;

    const newPdf = new Pdf({
      pdfName,
      pdfDescription,
      category,
      subCategory,
      filePath,
      notificationEmail
    });

    await newPdf.save();

    res.status(201).send('File uploaded and data saved successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal server error.');
  }
});

router.post('/sendemail', async (req, res) => {
  const { subject, body, to } = req.body;

  try {
    const info = await sendEmail(subject, body, to);
    res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});


router.get('/pdfs', getAllPdfs);
router.get('/pdfs/:id', getPdfById);
router.put('/pdfs/:id', updatePdf)
router.delete('/pdfs/:id', deletePdf);

module.exports = router;