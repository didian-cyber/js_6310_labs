import express from 'express';
import { config } from 'dotenv';
import './index.js'; 

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BeautyBooker Bot is running!',
    endpoints: ['/health', '/bookings']
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'BeautyBooker Bot'
  });
});

app.listen(PORT, () => {
  process.stdout.write(`🚀 Server running on port ${PORT}\n`);
});