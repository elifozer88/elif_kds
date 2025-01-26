document.addEventListener('DOMContentLoaded', () => {

    fetch('/api/anasayfa/ortalama-verileri')
        .then(response => {
            if (!response.ok) {
                throw new Error('Veriler alınamadı.');
            }
            return response.json();
        })
        .then(data => {
           
            data.sort((a, b) => {
                const order = ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'];
                return order.indexOf(a.sinif_grubu) - order.indexOf(b.sinif_grubu);
            });

           
            const labels = data.map(item => item.sinif_grubu);
            const values = data.map(item => parseFloat(item.toplam_ortalama));

            const backgroundColors = [
                'rgba(75, 192, 192, 0.2)', // Yeşil
                'rgba(54, 162, 235, 0.2)', // Mavi
                'rgba(255, 206, 86, 0.2)', // Sarı
                'rgba(255, 99, 132, 0.2)'  // Kırmızı
            ];
            const borderColors = [
                'rgba(75, 192, 192, 1)', 
                'rgba(54, 162, 235, 1)', 
                'rgba(255, 206, 86, 1)', 
                'rgba(255, 99, 132, 1)'
            ];

           
            const ctx = document.getElementById('ortalamaBarChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ortalama Başarı',
                        data: values,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: borderColors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Başarı Oranı (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Sınıf Grupları'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Grafik yükleme hatası:', error);
            alert('Veriler yüklenirken bir hata oluştu.');
        });
});
