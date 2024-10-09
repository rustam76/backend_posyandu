const { sequelize } = require('../config/db');


const createBalita = async (req, res) => {
  try {
    const { name, birth_date, ibu_id } = req.body;

    // Check if Ibu exists using a raw SQL query
    const [ibu] = await sequelize.query(
      `SELECT * FROM ibu WHERE id = :ibu_id`, 
      { 
        replacements: { ibu_id }, 
        type: sequelize.QueryTypes.SELECT 
      }
    );

    if (!ibu) {
      return res.status(404).json({ message: 'Ibu not found' });
    }

    // Create Balita using a raw SQL INSERT query
    await sequelize.query(
      `INSERT INTO balita (name, birth_date, ibu_id) VALUES (:name, :birth_date, :ibu_id)`,
      {
        replacements: { name, birth_date, ibu_id },
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Get the last inserted Balita using LAST_INSERT_ID()
    const [balita] = await sequelize.query(
      `SELECT * FROM balita WHERE id = LAST_INSERT_ID()`,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Send success response with the created balita object
    res.status(201).json({ message: 'Balita created successfully', balita });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Balita', error: error.message });
  }
};


const getAllBalitas = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.name AS balitaName,
        b.jenis_kelamin AS jenisKelamin, 
        b.birth_date as birthDate, 
        p.identity_number AS identityNumber, 
        p.address, 
        b.peserta_id AS pesertaId,
        p.name AS ibuName
      FROM balita b
      LEFT JOIN Peserta p ON b.peserta_id = p.id  
      JOIN user u ON p.user_id = u.id
      WHERE u.status = 'active';
    `;
    
    const [balitas] = await sequelize.query(query); // Using Sequelize to execute the raw query
    res.json(balitas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Balitas', error: error.message });
  }
};

const getBalitaById = async (req, res) => {
  try {
    const { id } = req.params;

    const balitas = await sequelize.query(
      `SELECT 
        b.id,
        b.name AS balitaName, 
        b.birth_date as birthDate,
        b.jenis_kelamin AS jenisKelamin, 
        p.identity_number AS identityNumber, 
        p.address, 
        b.peserta_id AS pesertaId,
        p.name AS pesertaName, 
        p.name AS ibuName 
      FROM Balita b
      LEFT JOIN Peserta p ON b.peserta_id = p.id  
      WHERE b.id = :id`, 
      {
        replacements: { id: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!balitas || balitas.length === 0) {
      return res.status(404).json({ message: 'Balita not found' });
    }

    res.json(balitas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Balita', error: error.message });
  }
};




module.exports = { createBalita, getAllBalitas, getBalitaById, };