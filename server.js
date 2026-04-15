const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo immagini sono permesse'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nessun file caricato' });
    }
    const imageUrl = '/uploads/' + req.file.filename;
    res.json({ success: true, url: imageUrl, filename: req.file.filename });
});

app.get('/uploads/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'uploads', req.params.filename);
    res.sendFile(filepath);
});

app.listen(PORT, () => {
    console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
});
