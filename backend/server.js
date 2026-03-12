const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const { generalLimiter } = require('./middleware/rateLimiter');

// .env dosyasındaki ortam değişkenlerini okumamızı sağlar
dotenv.config();

// Veri tabanına bağlanma fonksiyonunu çalıştırıyoruz
connectDB(); 

// Express uygulamamızı başlatıyoruz
const app = express();

app.use(cors()); 
app.use(express.json()); 

// Genel rate limiter — tüm istekler için dakikada 100 istek
app.use(generalLimiter);

// --- ROTALAR (API Uç Noktaları) ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// --- Test Rotası ---
app.get('/', (req, res) => {
  res.send('İTÜ Racing Backend API Başarıyla Çalışıyor! 🏎️');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda başarıyla çalışıyor...`);
});
