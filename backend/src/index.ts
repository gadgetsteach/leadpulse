import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, getProfile } from './controllers/auth.controller';
import { createForm, getForms, getFormById, updateForm, deleteForm, getPublicFormBySlug } from './controllers/form.controller';
import { submitLead, getLeads, getLeadDetails, updateLeadStatus, getAnalytics } from './controllers/lead.controller';
import { authenticateJWT } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/profile', authenticateJWT, getProfile);

// Form routes (Private)
app.post('/api/forms', authenticateJWT, createForm);
app.get('/api/forms', authenticateJWT, getForms);
app.get('/api/forms/:id', authenticateJWT, getFormById);
app.put('/api/forms/:id', authenticateJWT, updateForm);
app.delete('/api/forms/:id', authenticateJWT, deleteForm);

// Form routes (Public)
app.get('/api/public/forms/:slug', getPublicFormBySlug);
app.post('/api/public/leads', submitLead);

// Lead routes (Private)
app.get('/api/leads', authenticateJWT, getLeads);
app.get('/api/leads/:id', authenticateJWT, getLeadDetails);
app.put('/api/leads/:id/status', authenticateJWT, updateLeadStatus);
app.get('/api/analytics', authenticateJWT, getAnalytics);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
