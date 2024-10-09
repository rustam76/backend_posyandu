const { sequelize } = require('../config/db');



getAllIbus = async (req, res) => {
  try {
    const ibus = await sequelize.query(`
      SELECT 
      peserta.id,
      peserta.name,
      peserta.identity_number AS identityNumber, 
      peserta.address, 
      peserta.user_id AS userId,
      
      user.*
      FROM peserta peserta
      JOIN user user ON peserta.id = user.id
      WHERE user.status = 'active'
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(ibus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Ibus', error: error.message });
  }
};




updateIbu = async (req, res) => {
  try {
    const { name, identityNumber, address } = req.body;
    const ibuId = req.params.id;

    // Prepare the SQL query
    const query = `
      UPDATE ibu
      SET 
        name = COALESCE(NULLIF(:name, ''), name),
        identity_number = COALESCE(NULLIF(:identity_number, ''), identity_number),
        address = COALESCE(NULLIF(:address, ''), address)
      WHERE id = :id
    `;

    // Execute the SQL query
    const [result] = await sequelize.query(query, {
      replacements: { id: ibuId, name, identityNumber, address },
    });

    // Check if any row was updated
    if (result[1] === 0) {
      return res.status(404).json({ message: 'Ibu not found' });
    }

    res.json({ message: 'Ibu updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Ibu', error: error.message });
  }
};



module.exports = {

  getAllIbus,

  updateIbu,

};