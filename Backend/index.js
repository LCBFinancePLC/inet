const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const uploadRoute = require('./Routes/uploadPdf.routes');
const categoryRoutes = require('./Routes/category.routes');
const userRoutes = require('./Routes/user.routes');
const authRoutes = require('./Routes/auth.routers');       // 👈 check spelling
const phonebookRoutes = require('./Routes/phoneBook.router'); // 👈 check spelling
const { sendEmail } = require('./emailServer');
const { sendEmailMgt } = require('./emailServerMgt');

const app = express();

/* ---------- CORS ---------- */
const defaultAllowed = [
  'http://localhost',
  'http://127.0.0.1',
  'http://localhost:5173'
];
const extraAllowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowed = new Set([...defaultAllowed, ...extraAllowed]);

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowed.has(origin)),
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- DB ---------- */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/* ---------- Logs ---------- */
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* ---------- API Routes ---------- */
app.use('/api', uploadRoute);
app.use('/api', categoryRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', phonebookRoutes);

/* ---------- Email endpoints ---------- */
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
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }
    const info = await sendEmailMgt(action, documentInfo);
    res.status(200).json({ success: true, messageId: info.messageId, message: `Email sent successfully for ${action} action` });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

/* ---------- Static uploads ---------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ---------- Serve frontend (direct from ../Frontend/my-react-app/dist) ---------- */
const FE_BUILD_DIR = path.join(__dirname, '../Frontend/my-react-app/dist');
app.use(express.static(FE_BUILD_DIR));

/* ---------- SPA fallback ---------- */
app.get(/^\/(?!api|uploads).*/, (_req, res) => {
  res.sendFile(path.join(FE_BUILD_DIR, 'index.html'));
});

/* ---------- Health ---------- */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

/* ---------- Error handler ---------- */
app.use((err, _req, res, _next) => {
  console.error('❌ Server error:', err);
  res.status(500).send('Something broke!');
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
