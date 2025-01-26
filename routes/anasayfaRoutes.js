const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/ortalama-verileri', async (req, res) => {
    try {
        const query = `
            SELECT 
                CASE
                    WHEN sinif_id IN (1, 2, 3) THEN '9. Sınıf'
                    WHEN sinif_id IN (4, 5, 6) THEN '10. Sınıf'
                    WHEN sinif_id IN (7, 8, 9) THEN '11. Sınıf'
                    WHEN sinif_id IN (10, 11, 12) THEN '12. Sınıf'
                END AS sinif_grubu,
                (AVG(vize) * 0.5 + AVG(final) * 0.5) AS toplam_ortalama
            FROM sinav_sonuclari
            WHERE sinif_id BETWEEN 1 AND 12
            GROUP BY sinif_grubu;
        `;

        const [results] = await db.promise().query(query); 
        console.log('API Sorgu Sonuçları:', results);
        res.json(results);
    } catch (err) {
        console.error('Hata:', err.message); 
        res.status(500).send('Sunucu hatası');
    }
});



module.exports = router;
