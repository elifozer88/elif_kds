const express = require('express');
const router = express.Router();
const db = require('../config/db');



const VALID_USER = {
    kullanici_adi: 'elifozer',
    sifre: '8888',
};

router.post('/login', (req, res) => {
    const { kullanici_adi, sifre } = req.body;

    if (kullanici_adi === VALID_USER.kullanici_adi && sifre === VALID_USER.sifre) {
        res.status(200).json({ message: 'Login successful', user: { kullanici_adi } });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});


module.exports = router;
