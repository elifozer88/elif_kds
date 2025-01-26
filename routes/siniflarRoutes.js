const express = require('express');
const router = express.Router();
const db = require('../config/db'); 


router.get('/get-ortalama', async (req, res) => {
    const donem = req.query.donem; // Dönem parametresi

    // Eğer dönem parametresi gönderilmemişse hata döndür
    if (!donem) {
        return res.status(400).json({ error: 'Dönem parametresi gerekli.' });
    }

    // Dönemlere göre tablo adlarını haritalama
    const tabloMap = {
        '2023-guz': '2023_birinci_donem',
        '2023-bahar': '2023_ikinci_donem',
        '2024-guz': 'sinav_sonuclari',
    };

    const tabloAdi = tabloMap[donem]; // Döneme karşılık gelen tablo adı
    if (!tabloAdi) {
        return res.status(400).json({ error: 'Geçersiz dönem parametresi.' });
    }

    // SQL sorgusu
    const query = `
        SELECT  
            CASE 
                WHEN sinif_id IN (1, 2, 3) THEN '9. Sınıf'
                WHEN sinif_id IN (4, 5, 6) THEN '10. Sınıf'
                WHEN sinif_id IN (7, 8, 9) THEN '11. Sınıf'
                WHEN sinif_id IN (10, 11, 12) THEN '12. Sınıf'
            END AS sinif_grubu,
            ders_id,
            ROUND(AVG(vize * 0.5 + final * 0.5), 2) AS ders_ortalama
        FROM ${tabloAdi} 
        WHERE sinif_id BETWEEN 1 AND 12
        GROUP BY sinif_grubu, ders_id
        ORDER BY FIELD(sinif_grubu, '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'), ders_id;
    `;

    try {
        console.log('Çalıştırılan SQL sorgusu:', query); // Sorguyu logla
        const [results] = await db.promise().query(query); // Sorguyu çalıştır

        console.log('Sorgu sonucu:', results); // Sonuçları logla
        if (!results || results.length === 0) {
            return res.status(200).json({ message: 'Kayıt bulunamadı.', data: [] });
        }

        res.json(results); // Sonuçları döndür
    } catch (err) {
        console.error('Veritabanı hatası:', err.message); // Hata mesajını logla
        res.status(500).json({ error: 'Veritabanı hatası oluştu.' });
    }
});

module.exports = router;
