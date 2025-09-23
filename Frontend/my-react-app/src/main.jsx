import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './Pages/login.jsx';
import Home from './Pages/home.jsx';
import Policies from './Pages/policies.jsx';
import PdfUpload from './Pages/pdfUpload.jsx';
import PdfView from './Pages/pdfView.jsx';
import RegistrationPage from './Pages/registrartionPage.jsx';
import Application from './Pages/applications.jsx';
import Tutorial from './Pages/tutorials.jsx';
import Circulars from './Pages/circulars.jsx';
import PdfUploadManager from './Pages/pdfUploadManager.jsx';
import HomeAdmin from './Pages/homeAdmin.jsx';
import HomeManager from './Pages/homeManager.jsx';
import Userlogs from './Pages/userLogs.jsx';
import Memos from './Pages/memos.jsx';

import ManagePdf from './Components/managePdf.jsx';
import ManagePhoneBook from './Pages/managePhoneBook.jsx';
import PhoneBook from './Pages/phoneBook.jsx';
import AdminReview from './Pages/adminReview.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/pdfView/:pdfPath" element={<PdfView />} />
          <Route path="/applications" element={<Application />} />
          <Route path="/tutorials" element={<Tutorial />} />
          <Route path="/circulars" element={<Circulars />} />
          <Route path="/phoneBook" element={<PhoneBook />} />
          <Route path="/memos" element={<Memos/>}/>






          {/* Protected Routes */}
          <Route path="/pdfUpload" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><PdfUpload /></ProtectedRoute>} />
          <Route path="/registration" element={<ProtectedRoute allowedRoles={['Admin']}><RegistrationPage /></ProtectedRoute>} />
          <Route path="/pdfuploadManager" element={<ProtectedRoute allowedRoles={['Manager']}><PdfUploadManager /></ProtectedRoute>} />
          <Route path="/homeAdmin" element={<ProtectedRoute allowedRoles={['Admin']}><HomeAdmin /></ProtectedRoute>} />
          <Route path="/homeManager" element={<ProtectedRoute allowedRoles={['Manager']}><HomeManager /></ProtectedRoute>} />
          <Route path="/userlogs" element={<ProtectedRoute allowedRoles={['Admin']}><Userlogs /></ProtectedRoute>} />
          <Route path="/managePdf" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManagePdf /></ProtectedRoute>} />
          <Route path="/managePhoneBook" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManagePhoneBook /></ProtectedRoute>} />
          <Route path="/adminReview" element={<ProtectedRoute allowedRoles={['Admin']}><AdminReview /></ProtectedRoute>} />

        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);