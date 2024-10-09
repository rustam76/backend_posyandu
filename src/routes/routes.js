const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // JWT Middleware
const userController = require('../controllers/UserController');
const konsultasiController = require('../controllers/KonsultasiController');
const pesertaController = require('../controllers/PesertaController');
const ibuController = require('../controllers/IbuController');
const dataKBController = require('../controllers/DataKBController');
const informasiController = require('../controllers/InformasiController');
const balitaController = require('../controllers/BalitaController');
const imunisasiController = require('../controllers/ImunisasiController');
const jadwalController = require('../controllers/JadwalController');
const laporanController = require('../controllers/LaporanController');

// Auth routes
const authController = require('../controllers/AuthController');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// User routes
router.get('/users',  userController.getUsers);


// Peserta routes
router.get('/peserta', pesertaController.getAllPesertas);
router.put('/peserta/:id', pesertaController.updatePeserta);


router.get('/ibu',  ibuController.getAllIbus);
router.put('/ibu/:id', ibuController.updateIbu);

router.get('/datakb', dataKBController.getAllDataKB);
router.post('/datakb', dataKBController.createDataKB);
router.get('/datakb/:id', dataKBController.getDataKBById);
router.put('/datakb/:id', dataKBController.updateDataKB);

router.get('/informasi',informasiController.getAllInformasi);
router.post('/informasi',informasiController.createInformasi);
router.put('/informasi/:id',informasiController.updateInformasi);
router.delete('/informasi/:id', informasiController.deleteInformasi);


router.get('/balita',balitaController.getAllBalitas);
router.get('/balita/:id',balitaController.getBalitaById);
router.post('/balita',balitaController.createBalita);

router.get('/imunisasi', imunisasiController.getAllImunisasi);
router.post('/imunisasi', imunisasiController.createImunisasi);
router.post('/gizi', imunisasiController.createGizi);
router.get('/imunisasiuser/:id', imunisasiController.getImunisasiByUserId);
router.get('/riwayatimunisasi/:id', imunisasiController.getRiwayatImunisasi);

router.get('/jadwal', jadwalController.getAllJadwals);
router.post('/jadwal', jadwalController.createJadwal);

// router.get('/konsultasi/:id',konsultasiController.getKonsultasi);
router.post('/konsultasi',konsultasiController.createKonsultasi);
router.get('/konsultasi/:kaderId',konsultasiController.getPesertaKonsultasi);
router.get('/konsultasi/:kaderId/:pesertaId',konsultasiController.getRiwayatKonsultasi);
router.post('/konsultasi/:senderId/:receiverId/send',konsultasiController.kirimPesanKonsultasi);


router.get('/laporan/:id', laporanController.getLaporanById);
router.get('/laporanbyuser/:id', laporanController.getLaporanByUserId);


module.exports = router;
