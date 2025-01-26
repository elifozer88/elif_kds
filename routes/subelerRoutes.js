const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/api/get-veriler', async (req, res) => {
    try {
        const { sinif_grubu, donem } = req.query;

        console.log('Gelen Parametreler:', { sinif_grubu, donem });

        const donemMapping = {
            '2024-guz': 'sinav_sonuclari',
            '2023-bahar': '2023_ikinci_donem',
            '2023-guz': '2023_birinci_donem',
        };

        const tabloAdi = donemMapping[donem];
        if (!tabloAdi) {
            console.error('Geçersiz dönem:', donem);
            return res.status(400).json({ error: 'Geçersiz dönem' });
        }

        const query = `
            SELECT 
                CASE
                    WHEN sinif_id = 1 THEN '9-A'
                    WHEN sinif_id = 2 THEN '9-B'
                    WHEN sinif_id = 3 THEN '9-C'
                    WHEN sinif_id = 4 THEN '10-A'
                    WHEN sinif_id = 5 THEN '10-B'
                    WHEN sinif_id = 6 THEN '10-C'
                    WHEN sinif_id = 7 THEN '11-A'
                    WHEN sinif_id = 8 THEN '11-B'
                    WHEN sinif_id = 9 THEN '11-C'
                    WHEN sinif_id = 10 THEN '12-A'
                    WHEN sinif_id = 11 THEN '12-B'
                    WHEN sinif_id = 12 THEN '12-C'
                END AS sinif_grubu
,
                ders_id,
                (AVG(vize) * 0.5 + AVG(final) * 0.5) AS toplam_ortalama
            FROM ${tabloAdi}
            WHERE 
                sinif_id BETWEEN 
                    CASE 
                        WHEN '${sinif_grubu}' = '9' THEN 1
                        WHEN '${sinif_grubu}' = '10' THEN 4
                        WHEN '${sinif_grubu}' = '11' THEN 7
                        WHEN '${sinif_grubu}' = '12' THEN 10
                    END
                    AND 
                    CASE 
                        WHEN '${sinif_grubu}' = '9' THEN 3
                        WHEN '${sinif_grubu}' = '10' THEN 6
                        WHEN '${sinif_grubu}' = '11' THEN 9
                        WHEN '${sinif_grubu}' = '12' THEN 12
                    END
            GROUP BY sinif_adi, ders_id
            ORDER BY sinif_adi, ders_id;
        `;

        console.log('Çalıştırılan Sorgu:', query);

        const [rows] = await db.execute(query);
        console.log('Sorgu Sonuçları:', rows);

        if (rows.length === 0) {
            console.warn('Veritabanından sonuç döndürülmedi. Parametreleri kontrol edin:', { sinif_grubu, donem });
        }

        // Veriyi bar grafiği için düzenleme
        const chartData = rows.reduce((acc, row) => {
            if (!acc[row.sinif_adi]) {
                acc[row.sinif_adi] = [];
            }
            acc[row.sinif_adi].push({ ders_id: row.ders_id, ortalama: row.toplam_ortalama });
            return acc;
        }, {});

        res.json({
            siniflar: Object.keys(chartData),
            veriler: chartData
        });
    } catch (error) {
        console.error('Sunucu hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
