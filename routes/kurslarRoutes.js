const express = require('express');
const router = express.Router();
const db = require('../config/db'); 


router.get('/kurslar', async (req, res) => {
    const donem = req.query.donem;

    if (!donem) {
        return res.status(400).json({ error: 'Dönem belirtilmedi.' });
    }

    try {
        const query = `
            SELECT 
                kurs_id,
                ders_id,
                sube,
                CASE
                  WHERE CASE
    WHEN '${donem}' = '2024-guz' THEN kurs_id BETWEEN 1 AND 10
    WHEN '${donem}' = '2023-bahar' THEN kurs_id BETWEEN 11 AND 18
    WHEN '${donem}' = '2023-guz' THEN kurs_id BETWEEN 19 AND 23
END

                END AS donem
            FROM (
                SELECT 1 AS kurs_id, 1 AS ders_id, 'mat3' AS sube
                UNION ALL SELECT 2, 1, 'mat4'
                UNION ALL SELECT 3, 2, 'fizik2'
                UNION ALL SELECT 4, 2, 'fizik4'
                UNION ALL SELECT 5, 3, 'kimya2'
                UNION ALL SELECT 6, 4, 'biyo3'
                UNION ALL SELECT 7, 5, 'tarih3'
                UNION ALL SELECT 8, 5, 'tarih4'
                UNION ALL SELECT 9, 6, 'edebiyat2'
                UNION ALL SELECT 10, 6, 'edebiyat4'
                UNION ALL SELECT 11, 1, 'mat1'
                UNION ALL SELECT 12, 1, 'mat3'
                UNION ALL SELECT 13, 2, 'fizik2'
                UNION ALL SELECT 14, 3, 'kimya1'
                UNION ALL SELECT 15, 3, 'kimya3'
                UNION ALL SELECT 16, 4, 'biyo2'
                UNION ALL SELECT 17, 5, 'tarih1'
                UNION ALL SELECT 18, 6, 'edebiyat1'
                UNION ALL SELECT 19, 3, 'kimya1'
                UNION ALL SELECT 20, 4, 'biyo3'
                UNION ALL SELECT 21, 5, 'tarih2'
                UNION ALL SELECT 22, 6, 'edebiyat2'
                UNION ALL SELECT 23, 6, 'edebiyat3'
            ) AS temp
            WHERE CASE
                WHEN '${donem}' = '2024-Güz Dönemi' THEN kurs_id BETWEEN 1 AND 10
                WHEN '${donem}' = '2023-Bahar Dönemi' THEN kurs_id BETWEEN 11 AND 18
                WHEN '${donem}' = '2023-Güz Dönemi' THEN kurs_id BETWEEN 19 AND 23
            END
            ORDER BY kurs_id;
        `;

        const [rows] = await db.execute(query);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Belirtilen döneme ait kurs bulunamadı.' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
