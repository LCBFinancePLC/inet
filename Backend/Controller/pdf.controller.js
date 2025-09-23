const fs = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const Pdf = require('../Model/pdf.model');
const { StatusCodes } = require('http-status-codes');
const { sendEmail } = require('../emailServer');

const unlinkAsync = promisify(fs.unlink);

// Function to handle PDF upload
const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded.' });
        }
        const { pdfName, pdfDescription, category, subCategory, notificationEmail } = req.body;
        const filePath = req.file.path;

        const newPdf = new Pdf({
            pdfName,
            pdfDescription,
            category,
            subCategory,
            filePath,
           approval: true,
           notificationEmail
        });

        const savedPdf = await newPdf.save();
        console.log('PDF saved successfully:', savedPdf);

         // Send email notification
         const emailSubject = 'New Document Uploaded to Intranet';
         const emailBody = `A new document "${savedPdf.pdfName}" has been uploaded to the intranet. This is for ${savedPdf.pdfDescription} in ${savedPdf.subCategory} of ${savedPdf.category}. Please refer to it.`;
         await sendEmail(emailSubject, emailBody);

        res.status(StatusCodes.CREATED).json({ message: 'File uploaded and data saved successfully.', pdf: savedPdf });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
    }
};

// Function to handle viewing a specific PDF file by PDF name
const viewPdfs = (req, res) => {
    const pdfName = req.params.pdfName;
    const pdfPath = join(__dirname, '../uploads', pdfName);

    if (fs.existsSync(pdfPath)) {
        res.sendFile(pdfPath);
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'PDF not found' });
    }
};

// Function to get all PDFs
const getAllPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find();
        res.status(StatusCodes.OK).json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
    }
};

// Function to get a PDF by ID
const getPdfById = async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'PDF not found.' });
        }
        res.status(StatusCodes.OK).json(pdf);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.', error: error.message });
    }
};

// Function to update a PDF
const updatePdf = async (req, res) => {
    const { id } = req.params;
    console.log('Attempting to update PDF with id:', id);
    console.log('Update data:', req.body);
    try {
        const pdf = await Pdf.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!pdf) {
            console.log('No PDF found with id:', id);
            return res.status(StatusCodes.NOT_FOUND).json({ message: `No PDF with id: ${id}` });
        }
        console.log('PDF updated successfully:', pdf);
        res.status(StatusCodes.OK).json(pdf);
    } catch (error) {
        console.error('Error updating PDF:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating PDF', error: error.message });
    }
};

// Function to delete a PDF
const deletePdf = async (req, res) => {
    const { id } = req.params;
    console.log('Attempting to delete PDF with id:', id);
    try {
        const pdf = await Pdf.findById(id);
        if (!pdf) {
            console.log('No PDF found with id:', id);
            return res.status(StatusCodes.NOT_FOUND).json({ message: `No PDF with id: ${id}` });
        }
        
        // Delete the file from the filesystem
        try {
            await unlinkAsync(pdf.filePath);
            console.log('File deleted successfully from filesystem');
        } catch (unlinkError) {
            console.error('Error deleting file from filesystem:', unlinkError);
            // Continue with deletion from database even if file deletion fails
        }

        // Remove the PDF document from the database
        await Pdf.findByIdAndDelete(id);
        
        console.log('PDF deleted successfully');
        res.status(StatusCodes.OK).json({ message: 'PDF deleted successfully' });
    } catch (error) {
        console.error('Error deleting PDF:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting PDF', error: error.message });
    }
};

module.exports = {
    uploadPdf,
    viewPdfs,
    getAllPdfs,
    getPdfById,
    updatePdf,
    deletePdf,
};