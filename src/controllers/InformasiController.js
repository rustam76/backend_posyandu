const { sequelize } = require('../config/db');


createInformasi = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Use raw SQL query to insert a new record into the Informasi table
    const query = 'INSERT INTO informasi (title, content) VALUES (?, ?)';
    const [result] = await sequelize.query(query, {
      replacements: [title, content], // Using an array for positional parameters
    });

    res.status(201).json({ message: 'Informasi created successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Informasi', error: error.message });
  }
};



getAllInformasi = async (req, res) => {
  try {
    const informasis = await  sequelize.query(`SELECT * FROM informasi ORDER BY id DESC`, {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(informasis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Informasi', error: error.message });
  }
};



updateInformasi = async (req, res) => {
  try {
    const { title, content } = req.body;
    const informasiId = req.params.id;

    // Check if the Informasi exists
    const [informasi] = await sequelize.query(
      'SELECT * FROM Informasi WHERE id = ?',
      {
        replacements: [informasiId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!informasi) return res.status(404).json({ message: 'Informasi not found' });

    // Update the Informasi record
    const [result] = await sequelize.query(
      'UPDATE Informasi SET title = ?, content = ? WHERE id = ?',
      {
        replacements: [
          title || informasi.title,
          content || informasi.content,
          informasiId
        ]
      }
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No rows updated' });
    }

    res.json({ message: 'Informasi updated successfully', informasi: { ...informasi, title, content } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Informasi', error: error.message });
  }
};


deleteInformasi = async (req, res) => {
  try {
    const informasiId = req.params.id;

    // Check if the Informasi exists
    const [informasi] = await sequelize.query(
      'SELECT * FROM Informasi WHERE id = ?',
      {
        replacements: [informasiId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!informasi) return res.status(404).json({ message: 'Informasi not found' });

    // Delete the Informasi record
    await sequelize.query(
      'DELETE FROM Informasi WHERE id = ?',
      {
        replacements: [informasiId]
      }
    );

    res.json({ message: 'Informasi deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Informasi', error: error.message });
  }
};


module.exports = {
  createInformasi,
  getAllInformasi,
  // getInformasiById,
  updateInformasi,
  deleteInformasi,
};
