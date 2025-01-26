document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Sayfanın yenilenmesini önler

    // Kullanıcıyı direkt olarak yönlendir
    window.location.href = 'http://localhost:3000/pages/anasayfa.html';
});
