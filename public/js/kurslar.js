document.addEventListener('DOMContentLoaded', () => {
    const donemSecimi = document.getElementById('donemSecimi');
    const kursListesi = document.getElementById('kursListesi');


    function fetchKurslar(donem) {
        // Backend endpoint
        const endpoint = `http://localhost:3000/api/kurslar?donem=${donem}`;
        console.log(`İstek yapılan URL: ${endpoint}`); // API çağrısını logla

        fetch(endpoint)
            .then(response => {
                console.log(`API Yanıt Durumu: ${response.status}`); // Yanıt durumu logla
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API Yanıtı:', data); // Gelen veriyi logla
                renderKurslar(data);
            })
            .catch(error => {
                console.error('Kurs verileri alınırken hata oluştu:', error); // Hata logla
                kursListesi.innerHTML = `<li style="color: red;">Kurs verileri alınamadı: ${error.message}</li>`;
            });
    }


    function renderKurslar(kurslar) {
        kursListesi.innerHTML = ''; // Listeyi temizle
        if (!kurslar || kurslar.length === 0) {
            // Kurs verisi boşsa kullanıcıya bilgi ver
            kursListesi.innerHTML = '<li style="color: gray;">Hiç kurs bulunamadı.</li>';
            return;
        }

        kurslar.forEach(kurs => {
            const listItem = document.createElement('li');
            listItem.textContent = `Kurs ID: ${kurs.kurs_id}, Ders: ${kurs.ders_id}, Şube: ${kurs.sube}`;
            kursListesi.appendChild(listItem);
        });
    }

   
    donemSecimi.addEventListener('change', (event) => {
        const selectedDonem = event.target.value;
        console.log(`Seçilen Dönem: ${selectedDonem}`); // Seçilen dönemi logla
        fetchKurslar(selectedDonem);
    });

    // Sayfa yüklendiğinde varsayılan olarak ilk dönemi yükle
    fetchKurslar(donemSecimi.value);
});
