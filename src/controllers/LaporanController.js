
const { sequelize } = require('../config/db');



const getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;

    // Raw SQL query to fetch Laporan by ID and include associated Balita data
    const query = `
      SELECT laporan.*, balita.name AS balitaName, balita.birth_date AS balitaBirthDate
      FROM laporan
      LEFT JOIN balita ON laporan.balita_id = balita.id
      WHERE laporan.id = :id
    `;

    // Execute the raw SQL query with the 'id' parameter
    const [laporanList, metadata] = await sequelize.query(query, {
      replacements: { id }  // Use parameter replacements to prevent SQL injection
    });

    // Check if Laporan exists
    if (!laporanList || laporanList.length === 0) {
      return res.status(404).json({ message: 'Laporan not found' });
    }

    // Since we expect one laporan, return the first element
    res.json(laporanList[0]);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching Laporan', error: error.message });
  }
};


const getLaporanByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Assuming userId is passed as a URL parameter

    // Raw SQL query to fetch all Laporan records associated with the logged-in user's Balita
    const query = `
      SELECT laporan.id, laporan.balita_id as balitaId, laporan.report_date as reportDate, laporan.report_content as reportContent, balita.name AS balitaName, balita.birth_date AS balitaBirthDate
      FROM laporan
      LEFT JOIN balita ON laporan.balita_id = balita.id
      WHERE balita.peserta_id = :id
    `;

    // Execute the raw SQL query with the 'id' parameter
    const [laporanList, metadata] = await sequelize.query(query, {
      replacements: { id } // Use parameter replacements to prevent SQL injection
    });

    // Check if any Laporan records were found
    if (!laporanList || laporanList.length === 0) {
      return res.status(404).json({ message: 'No laporan found for this user.' });
    }

    // Return the list of laporan with associated balita information
    res.json(laporanList);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching Laporan', error: error.message });
  }
};




module.exports = { getLaporanById, getLaporanByUserId };