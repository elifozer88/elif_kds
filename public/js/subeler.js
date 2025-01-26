document.addEventListener('DOMContentLoaded', () => {
    const sinifSecimi = document.getElementById('sinifSecimi'); 
    const donemSecimi = document.getElementById('donemSecimi'); 
    const chartsContainer = document.getElementById('chartsContainer'); 

    const dersIsimleri = {
        10: 'İngilizce', // İngilizce en başta
        1: 'Matematik',
        2: 'Fizik',
        3: 'Kimya',
        4: 'Biyoloji',
        5: 'Tarih',
        6: 'Edebiyat',
        7: 'Felsefe',
        8: 'Din Kültürü',
        9: 'Coğrafya'
    };

    const renkPaletleri = {
        '2023-guz': {
            'A': 'rgba(54, 162, 235, 0.8)',
            'B': 'rgba(255, 99, 132, 0.8)',
            'C': 'rgba(75, 192, 192, 0.8)'
        },
        '2023-bahar': {
            'A': 'rgba(255, 206, 86, 0.8)',
            'B': 'rgba(153, 102, 255, 0.8)',
            'C': 'rgba(201, 203, 207, 0.8)'
        },
        '2024-guz': {
            'A': 'rgba(255, 159, 64, 0.8)',
            'B': 'rgba(54, 162, 235, 0.8)',
            'C': 'rgba(255, 99, 132, 0.8)'
        }
    };

    const fetchVeriler = async () => {
        const donem = donemSecimi.value;
        const sinif = sinifSecimi.value;

        let jsonFilePath;
        if (donem === '2023-guz') {
            jsonFilePath = './2023_guz_verileri.json';
        } else if (donem === '2023-bahar') {
            jsonFilePath = './2023_bahar_verileri.json';
        } else if (donem === '2024-guz') {
            jsonFilePath = './tablo_verileri.json';
        } else {
            console.error('Geçersiz dönem seçimi!');
            return;
        }

        try {
            const response = await fetch(jsonFilePath);
            if (!response.ok) throw new Error(`Dosya yüklenemedi: ${response.status}`);
            const data = await response.json();

            const filteredData = data.filter(item => item.sinif_adi.startsWith(sinif));

            if (filteredData.length === 0) {
                chartsContainer.innerHTML = `<p>${sinif}. sınıf için veri bulunamadı.</p>`;
                return;
            }

            const groupedData = groupBy(filteredData, 'sinif_adi');

            const datasets = Object.keys(groupedData).map(sube => {
                const subeData = groupedData[sube];
                
                // Dersleri İngilizce'yi (ders_id = 10) en başa koyarak sıralama
                const sortedDersler = [10, ...Object.keys(dersIsimleri).filter(id => parseInt(id) !== 10).map(Number)];

                const values = sortedDersler.map(dersId => {
                    const dersVerisi = subeData.find(item => item.ders_id === dersId);
                    return dersVerisi ? dersVerisi.toplam_ortalama : 0;
                });

                return {
                    label: sube,
                    data: values,
                    backgroundColor: values.map(value => value < 70 ? '#ff0000' : renkPaletleri[donem][sube.split('-')[1]]),
                    borderColor: values.map(value => value < 70 ? '#ff0000' : renkPaletleri[donem][sube.split('-')[1]].replace('0.8', '1')),
                    borderWidth: 1
                };
            });

            createChart(`${sinif}. sınıf Şubeleri Ortalamaları`, [dersIsimleri[10], ...Object.keys(dersIsimleri).filter(id => id != 10).map(id => dersIsimleri[id])], datasets);
        } catch (error) {
            console.error('Veri çekme hatası:', error.message);
            chartsContainer.innerHTML = `<p style="color: red;">Veri yüklenirken bir hata oluştu: ${error.message}</p>`;
        }
    };

    const createChart = (title, labels, datasets) => {
        chartsContainer.innerHTML = ''; 

        const chartContainer = document.createElement('div');
        chartContainer.classList.add('chart-container');
        chartsContainer.appendChild(chartContainer);

        const chartTitle = document.createElement('h3');
        chartTitle.textContent = title;
        chartContainer.appendChild(chartTitle);

        const chartCanvas = document.createElement('canvas');
        chartContainer.appendChild(chartCanvas);

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Ortalama Başarı (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Dersler'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    };

    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };

    sinifSecimi.addEventListener('change', fetchVeriler);
    donemSecimi.addEventListener('change', fetchVeriler);

    fetchVeriler();
});
