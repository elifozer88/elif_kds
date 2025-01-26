document.addEventListener('DOMContentLoaded', () => {
    const donemSelect = document.getElementById('donemSecimi'); // Dönem seçimi dropdown
    const chartsContainer = document.getElementById('chartsContainer'); // Grafiklerin konteyneri

    // Ders ID'lerini isimlere çeviren bir map
    const dersIsimleri = {
        1: 'Matematik',
        2: 'Fizik',
        3: 'Kimya',
        4: 'Biyoloji',
        5: 'Tarih',
        6: 'Edebiyat',
        7: 'Felsefe',
        8: 'Din Kültürü',
        9: 'Coğrafya',
        10: 'İngilizce'
    };

    // Şube renkleri ve dönemlere özel renkler
    const renkler2023Guz = {
       
        '9. Sınıf': 'rgba(34, 177, 76, 0.8)',  // Canlı Yeşil
        '10. Sınıf': 'rgba(255, 127, 0, 0.8)',  // Canlı Turuncu
        '11. Sınıf': 'rgba(153, 102, 255, 0.8)' // Mor
    };

    const renkler2023Bahar = {
        
        '9. Sınıf': 'rgba(34, 177, 76, 0.8)',  // Canlı Yeşil
        '10. Sınıf': 'rgba(255, 127, 0, 0.8)',  // Canlı Turuncu
        '11. Sınıf': 'rgba(153, 102, 255, 0.8)' // Mor
    };

    const renkler2024Guz = {
        '9. Sınıf': 'rgba(54, 162, 235, 0.8)',  // Mavi
        '10. Sınıf': 'rgba(34, 177, 76, 0.8)',  // Canlı Yeşil
        '11. Sınıf': 'rgba(255, 127, 0, 0.8)',  // Canlı Turuncu
        '12. Sınıf': 'rgba(153, 102, 255, 0.8)' // Mor
    };

    // Kırmızı rengin kodu
    const kırmızıRenk = '#ff0000';

    // Dönem seçimi değiştiğinde API çağrısı
    donemSelect.addEventListener('change', async (event) => {
        const selectedDonem = event.target.value; // Seçilen dönem
        const endpoint = `/api/siniflar/get-ortalama?donem=${selectedDonem}`; // API Endpoint
        chartsContainer.innerHTML = ''; // Önceki grafikleri temizle

        // Döneme göre renkleri seç
        let subeRenkleri;
        if (selectedDonem === '2023-guz') {
            subeRenkleri = renkler2023Guz;
        } else if (selectedDonem === '2023-bahar') {
            subeRenkleri = renkler2023Bahar;
        } else {
            subeRenkleri = renkler2024Guz;
        }

        try {
            const response = await fetch(endpoint); // API çağrısı
            if (!response.ok) {
                throw new Error(`API Hatası: ${response.status}`); // Hata durumunda logla
            }

            const data = await response.json(); // Gelen veriyi JSON olarak al
            console.log('API’den gelen veri:', data); // API verisini logla

            // Gelen veri kontrolü
            if (!data || data.length === 0 || data.message === 'Kayıt bulunamadı.') {
                chartsContainer.innerHTML = '<p>Veri bulunamadı.</p>';
                return;
            }

            // Grafik verilerini hazırlama
            const groupedData = groupBy(data, 'sinif_grubu'); // Sınıf gruplarına göre verileri gruplama

            // Her sınıf grubu için ayrı bir grafik oluştur
            Object.keys(groupedData).forEach(sinifGrubu => {
                const groupData = groupedData[sinifGrubu];
                const labels = groupData.map(item => dersIsimleri[item.ders_id] || `Ders ${item.ders_id}`); // Ders isimleri
                const values = groupData.map(item => parseFloat(item.ders_ortalama)); // Ortalama değerler

                // 70'in altındaki değerler kırmızı, aksi halde döneme göre renk
                const backgroundColors = values.map(value => value < 70 ? kırmızıRenk : subeRenkleri[sinifGrubu]);

                // Grafik oluştur
                createChart(sinifGrubu, labels, values, backgroundColors);
            });
        } catch (error) {
            console.error('Veri çekme hatası:', error.message); // Hata mesajını logla
            chartsContainer.innerHTML = '<p>Veriler yüklenirken bir hata oluştu.</p>';
        }
    });

    // Varsayılan dönemi tetikleme
    donemSelect.dispatchEvent(new Event('change'));

    // Grafik oluşturma fonksiyonu
    function createChart(sinifGrubu, labels, data, backgroundColors) {
        const chartContainer = document.createElement('div'); // Yeni bir div oluştur
        chartContainer.classList.add('chart-container'); // CSS için sınıf ekle
        chartsContainer.appendChild(chartContainer); // Ana konteyner'e ekle

        const chartTitle = document.createElement('h3'); // Başlık oluştur
        chartTitle.textContent = `${sinifGrubu}`; // Sınıf grubunun adı
        chartContainer.appendChild(chartTitle); // Başlığı grafiğin üstüne ekle

        const chartCanvas = document.createElement('canvas'); // Yeni bir canvas elemanı oluştur
        chartContainer.appendChild(chartCanvas); // Canvas'ı konteyner içerisine ekle

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels, // Etiketler (Ders İsimleri)
                datasets: [{
                    label: 'Ders Ortalamaları', // Grafik başlığı
                    data: data, // Grafik verileri
                    backgroundColor: backgroundColors, // Dinamik renkler
                    borderColor: backgroundColors.map(color => color.replace('0.8', '1')), // Renklerin opak versiyonu
                    borderWidth: 1
                }]
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
    }

    // Verileri belirli bir alana göre gruplama
    function groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
});