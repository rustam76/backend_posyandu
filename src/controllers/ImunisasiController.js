const { sequelize } = require('../config/db');

// Function to create Immunization (Imunisasi) using raw SQL query
const createImunisasi = async (req, res) => {
  try {
    const { balita_id, immunization_date, type, note } = req.body;

    console.log(balita_id, immunization_date, type, note);
    
    // Check if Balita exists
    const checkBalita = await sequelize.query(
      'SELECT * FROM balita WHERE id = :balita_id',
      {
        replacements: { balita_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (checkBalita.length === 0) {
      return res.status(404).json({ message: 'Balita not found' });
    }

    // Insert into Imunisasi table
    await sequelize.query(
      'INSERT INTO imunisasi (balita_id, immunization_date, type, note) VALUES (:balita_id, :immunization_date, :type, :note)',
      {
        replacements: { balita_id, immunization_date, type, note },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({ message: 'Imunisasi created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Imunisasi', error: error.message });
  }
};

// Function to create Gizi using raw SQL query
const createGizi = async (req, res) => {
  try {
    const { status_gizi, berat_bayi, tinggi_bayi, umur, balita_id, tgl_gizi } = req.body;

    // Check if Balita exists
    const checkBalita = await sequelize.query(
      'SELECT * FROM balita WHERE id = :balita_id',
      {
        replacements: { balita_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (checkBalita.length === 0) {
      return res.status(404).json({ message: 'Balita not found' });
    }

    // Insert into Data Gizi table
    await sequelize.query(
      'INSERT INTO data_gizi (status_gizi, berat_bayi, tinggi_bayi, umur, balita_id, tgl_gizi) VALUES (:status_gizi, :berat_bayi, :tinggi_bayi, :umur, :balita_id, :tgl_gizi)',
      {
        replacements: { status_gizi, berat_bayi, tinggi_bayi, umur, balita_id, tgl_gizi },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({ message: 'Gizi data created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Gizi data', error: error.message });
  }
};




const getAllImunisasi = async (req, res) => {
  try {
    // Fetch all immunization records
    const imunisasiList = await sequelize.query(`
      SELECT imunisasi.*, balita.name AS balitaName, balita.birth_date, peserta.name AS pesertaName 
      FROM imunisasi 
      JOIN balita ON imunisasi.balita_id = balita.id
      JOIN peserta ON balita.peserta_id = peserta.id;
    `);
    
    res.json(imunisasiList[0]); // Adjusted to access the first element as Sequelize returns an array
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Imunisasi', error: error.message });
  }
};

const getImunisasiByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Assuming userId is passed as a URL parameter

    // Fetch immunization records for the logged-in user's children
    const imunisasiList = await sequelize.query(`
      SELECT imunisasi.*, balita.name AS balitaName, balita.birth_date, peserta.name AS pesertaName
      FROM imunisasi 
      JOIN balita ON imunisasi.balita_id = balita.id 
      JOIN peserta ON balita.peserta_id = peserta.id
      WHERE peserta.id = :id;
    `, {
      replacements: { id }, // Using parameter replacement to prevent SQL injection
    });

    if (imunisasiList[0].length === 0) {
      return res.status(404).json({ message: 'No immunization records found for this user.' });
    }

    res.json(imunisasiList[0]); // Adjusted to access the first element as Sequelize returns an array
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Imunisasi by user ID', error: error.message });
  }
};


const getRiwayatImunisasi = async (req, res) => {
  try {
    const { id } = req.params; // Assuming userId is passed as a URL parameter

    // Fetch immunization records along with data from balita and optionally data_gizi
    const imunisasiList = await sequelize.query(`
      SELECT 
        imunisasi.*, 
        balita.name AS balitaName, 
        balita.birth_date, 
        peserta.name AS pesertaName,
        data_gizi.status_gizi, 
        data_gizi.berat_bayi, 
        data_gizi.tinggi_bayi, 
        data_gizi.umur, 
        data_gizi.tgl_gizi
      FROM imunisasi 
      JOIN balita ON imunisasi.balita_id = balita.id 
      JOIN peserta ON balita.peserta_id = peserta.id
      LEFT JOIN data_gizi ON balita.id = data_gizi.balita_id
      WHERE peserta.id = :id;
    `, {
      replacements: { id }, // Preventing SQL injection
      type: sequelize.QueryTypes.SELECT, // Ensuring we get raw data
    });

    // Check if any records are found
    if (!imunisasiList || imunisasiList.length === 0) {
      return res.status(404).json({ message: 'No immunization records found for this user.' });
    }

    // Respond with the immunization records including nutrition data if available
    res.json(imunisasiList);
  } catch (error) {
    console.error("Error fetching immunization and nutrition records:", error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching Imunisasi by user ID', error: error.message });
  }
};





module.exports = {
  createImunisasi,
  createGizi,
  getAllImunisasi,
  getImunisasiByUserId,
  getRiwayatImunisasi


};