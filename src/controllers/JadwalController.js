const { sequelize } = require('../config/db');

const createJadwal = async (req, res) => {
  try {
    const { date, time, kader_id, lokasi, keterangan } = req.body;

    // Check if Kader exists
    const kader = await sequelize.query(
      `SELECT * FROM Kader WHERE id = :kader_id`,
      { 
        replacements: { kader_id }, 
        type: sequelize.QueryTypes.SELECT 
      }
    );

    if (!kader.length) {
      return res.status(404).json({ message: 'Kader not found' });
    }

    // Insert Jadwal using raw SQL query
    const [result] = await sequelize.query(
      `INSERT INTO Jadwal (date, time, kader_id, lokasi, keterangan) 
       VALUES (:date, :time, :kader_id, :lokasi, :keterangan)`,
      {
        replacements: { date, time, kader_id, lokasi, keterangan},
        type: sequelize.QueryTypes.INSERT
      }
    );

    res.status(201).json({ message: 'Jadwal created successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Jadwal', error: error.message });
  }
};


const getAllJadwals = async (req, res) => {
  try {
    const [jadwals, metadata] = await sequelize.query(`
      SELECT 
          j.*, 
          k.* 
      FROM 
          jadwal j
      JOIN 
          kader k ON j.kader_id = k.id
      ORDER BY j.id DESC
    `);
    
    res.json(jadwals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Jadwals', error: error.message });
  }
};



module.exports = {
  createJadwal,
  getAllJadwals,

};
