const { sequelize } = require('../config/db');


createDataKB = async (req, res) => {
  try {
    const { peserta_id, kb_date, type } = req.body;

    // Validasi input
    if (!peserta_id || !kb_date || !type) {
      return res.status(400).json({ message: 'Peserta ID, KB date, dan type harus diisi' });
    }

    const query = `
      INSERT INTO datakb (peserta_id, kb_date, type) 
      VALUES (:peserta_id, :kb_date, :type)
    `;

    // Menggunakan sequelize.query dengan replacements
    await sequelize.query(query, {
      replacements: { peserta_id, kb_date, type },
      type: sequelize.QueryTypes.INSERT
    });

    res.status(201).json({ message: 'DataKB berhasil dibuat' });
  } catch (error) {
    // Menangani error
    console.error('Error creating DataKB:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat DataKB', error: error.message });
  }
};


getAllDataKB = async (req, res) => {
  try {
    const query = `
      SELECT datakb.id, datakb.type, datakb.kb_date as kbDate, peserta.id as pesertaId, peserta.name AS pesertaName, peserta.identity_number as identityNumber, peserta.address 
      FROM DataKB
      INNER JOIN peserta ON datakb.peserta_id = peserta.id
    `;

    // Execute the raw SQL query
    const [dataKBList, metadata] = await sequelize.query(query);

    // Respond with the data
    res.json(dataKBList);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching DataKB', error: error.message });
  }
};


getDataKBById = async (req, res) => {
  try {
    const { id } = req.params;

    // Updated SQL query to fetch data by id
    const query = `
      SELECT datakb.* ,datakb.kb_date as kbDate, peserta.name AS pesertaName, peserta.identity_number as identityNumber, peserta.address 
      FROM DataKB
      INNER JOIN peserta ON datakb.peserta_id = peserta.id
      WHERE datakb.id = :id
    `;

    // Execute the raw SQL query with the id parameter
    const [dataKBList, metadata] = await sequelize.query(query, {
      replacements: { id }  // Use replacements to prevent SQL injection
    });

    // Check if any data was returned
    if (!dataKBList || dataKBList.length === 0) {
      return res.status(404).json({ message: 'DataKB not found' });
    }

    // Send the first item in the list since we expect one DataKB per ID
    res.json(dataKBList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching DataKB', error: error.message });
  }
};


updateDataKB = async (req, res) => {
  try {
    const { id } = req.params; // Mendapatkan id dari parameter URL
    const { kb_date, type } = req.body; // Mendapatkan kb_date dan type dari body permintaan

    const dataKB = 'UPDATE datakb SET kb_date = :kb_date, type = :type WHERE id = :id';
   
    // Menjalankan query untuk memperbarui data
    await sequelize.query(dataKB, {
      replacements: { kb_date, type, id },
      type: sequelize.QueryTypes.UPDATE
    });

    // Mengirimkan respons sukses
    res.json({ message: 'DataKB updated successfully' });
  } catch (error) {
    // Menangani kesalahan dan mengirimkan respons dengan pesan kesalahan
    res.status(500).json({ message: 'Error updating DataKB', error: error.message });
  }
};




module.exports = {
  createDataKB,
  getAllDataKB,
  getDataKBById,
  updateDataKB,

};
