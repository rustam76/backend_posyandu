const { sequelize } = require('../config/db');

const bcrypt = require('bcrypt');

createPeserta = async (req, res) => {
  try {
    const { username, password, name, identity_number, address } = req.body;

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role: 'peserta' });

    // Create Peserta
    const peserta = await Peserta.create({
      user_id: user.id,
      name,
      identity_number,
      address,
    });

    res.status(201).json({ message: 'Peserta created successfully', peserta });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Peserta', error: error.message });
  }
};

getAllPesertas = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT p.*, u.*
      FROM peserta p
      JOIN user u ON p.user_id = u.id
       WHERE u.status = 'inactive'
    `);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Peserta', error: error.message });
  }
};



const updatePeserta = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body; 
    const [results, metadata] = await sequelize.query(`
      UPDATE user
      SET status = :status
      WHERE id = (
        SELECT user_id 
        FROM peserta 
        WHERE user_id = :id
      )
    `, {
      replacements: { status, id }, // Menyediakan nilai pengganti untuk parameter
    });

    // Cek apakah ada perubahan yang terjadi
    if (results) {
      res.status(200).json({ message: 'Status peserta berhasil diperbarui' });
    } else {
      res.status(404).json({ message: 'Peserta tidak ditemukan atau status sudah diperbarui' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error updating Peserta', error: error.message });
  }
};




module.exports = {
  createPeserta,
  getAllPesertas,
  updatePeserta,
}