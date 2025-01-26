const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Tüm kaynaklara izin ver

const db = require('./config/db');

const PORT = process.env.PORT || 3000;
const anasayfaRoutes = require('./routes/anasayfaRoutes');
const siniflarRoutes = require('./routes/siniflarRoutes'); // Sınıflar route
const girisRoutes = require('./routes/girisRoutes');
const subelerRoutes = require('./routes/subelerRoutes');
const kurslarRoutes = require('./routes/kurslarRoutes');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form verileri için
app.use(express.static('public'));

// Route Bağlantıları
app.use('/api/anasayfa', anasayfaRoutes); // Ana sayfa rotaları
app.use('/api/siniflar', siniflarRoutes); // Sınıflar rotaları
app.use('/api/giris', girisRoutes); // Giriş rotaları


app.use('/api/subeler', subelerRoutes);
app.use('/api/kurslar', kurslarRoutes); // Kurslar rotaları

// Sunucu Başlatma
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`); // Backtick düzeltildi
});
