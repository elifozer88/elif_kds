document.addEventListener('DOMContentLoaded', () => {
    const donemSelect = document.getElementById('donemSecimi');
    const chartsContainer = document.getElementById('chartsContainer'); 

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

    
    const renkler2023Guz = {
       
        '9. Sınıf': 'rgba(34, 177, 76, 0.8)',  
        '10. Sınıf': 'rgba(255, 127, 0, 0.8)',  
        '11. Sınıf': 'rgba(153, 102, 255, 0.8)' 
    };

    const renkler2023Bahar = {
        
        '9. Sınıf': 'rgba(34, 177, 76, 0.8)',  
        '10. Sınıf': 'rgba(255, 127, 0, 0.8)',  
        '11. Sınıf': 'rgba(153, 102, 255, 0.8)'
    };

    const renkler2024Guz = {
        '9. Sınıf': 'rgba(54, 162, 235, 0.8)', 
        '10. Sınıf': 'rgba(34, 177, 76, 0.8)',  
        '11. Sınıf': 'rgba(255, 127, 0, 0.8)', 
        '12. Sınıf': 'rgba(153, 102, 255, 0.8)' 
    };

    const kırmızıRenk = '#ff0000';

    donemSelect.addEventListener('change', async (event) => {
        const selectedDonem = event.target.value; // Seçilen dönem
        const endpoint = `/api/siniflar/get-ortalama?donem=${selectedDonem}`;
        chartsContainer.innerHTML = ''; 

       
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
                throw new Error(`API Hatası: ${response.status}`); 
            }

            const data = await response.json(); 
            console.log('API’den gelen veri:', data); 

          
            if (!data || data.length === 0 || data.message === 'Kayıt bulunamadı.') {
                chartsContainer.innerHTML = '<p>Veri bulunamadı.</p>';
                return;
            }

           
            const groupedData = groupBy(data, 'sinif_grubu');

            
            Object.keys(groupedData).forEach(sinifGrubu => {
                const groupData = groupedData[sinifGrubu];
                const labels = groupData.map(item => dersIsimleri[item.ders_id] || `Ders ${item.ders_id}`); 
                const values = groupData.map(item => parseFloat(item.ders_ortalama)); 

                const backgroundColors = values.map(value => value < 70 ? kırmızıRenk : subeRenkleri[sinifGrubu]);

                createChart(sinifGrubu, labels, values, backgroundColors);
            });
        } catch (error) {
            console.error('Veri çekme hatası:', error.message); 
            chartsContainer.innerHTML = '<p>Veriler yüklenirken bir hata oluştu.</p>';
        }
    });

    
    donemSelect.dispatchEvent(new Event('change'));


    function createChart(sinifGrubu, labels, data, backgroundColors) {
        const chartContainer = document.createElement('div'); 
        chartContainer.classList.add('chart-container'); 
        chartsContainer.appendChild(chartContainer); 

        const chartTitle = document.createElement('h3');
        chartTitle.textContent = `${sinifGrubu}`; 
        chartContainer.appendChild(chartTitle); 

        const chartCanvas = document.createElement('canvas'); 
        chartContainer.appendChild(chartCanvas); 

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Ders Ortalamaları', 
                    data: data, 
                    backgroundColor: backgroundColors, 
                    borderColor: backgroundColors.map(color => color.replace('0.8', '1')), 
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

   
    function groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }
});
