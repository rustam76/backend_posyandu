const { sequelize } = require('../config/db');


const getKonsultasi = async (req, res) => {
    const receiverId = req.params.id;
  
    const query = `
      SELECT DISTINCT u.id, u.username, k.sent_at
FROM konsultasi k
JOIN user u ON k.sender_id = u.id
WHERE k.receiver_id = :receiverId
ORDER BY k.sent_at DESC;

    `;
  
    try {
      // Gunakan Promise untuk menjalankan query database dengan parameterized query
      const results = await sequelize.query(query, {
        replacements: { receiverId }, // Mengganti placeholder dengan nilai dari params
        type: sequelize.QueryTypes.SELECT // Menentukan tipe query sebagai SELECT
      });
  
      // Jika tidak ada hasil, kembalikan respons kosong
      if (results.length === 0) {
        return res.status(404).json({ message: 'No chats found.' });
      }
  
      // Kembalikan hasil query sebagai JSON
      return res.json(results);
    } catch (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };


  const getPesertaKonsultasi = async (req, res) => {
    const kaderId = req.params.kaderId; // id dari kader yang sedang login
  
    const query = `
      SELECT u.id, u.username, MAX(k.sent_at) AS sent_at
      FROM konsultasi k
      JOIN user u ON k.sender_id = u.id
      WHERE k.receiver_id = :kaderId
      GROUP BY u.id, u.username
      ORDER BY sent_at DESC;
    `;
  
    try {
      const peserta = await sequelize.query(query, {
        replacements: { kaderId },
        type: sequelize.QueryTypes.SELECT
      });
  
      if (peserta.length === 0) {
        return res.status(404).json({ message: 'No participants found.' });
      }
  
      res.json(peserta);
    } catch (error) {
      console.error('Error fetching participants:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
const createKonsultasi = async (req, res) => {
  const { peserta_id, kader_id, message } = req.body;

  console.log('Request body:', req.body); // Log the incoming request body

  try {
      // Raw SQL query to insert a new konsultasi
      const query = 'INSERT INTO konsultasi (peserta_id, kader_id, message) VALUES (?, ?, ?)';
      const [result] = await sequelize.query(query, {
          replacements: [peserta_id, kader_id, message],
          type: sequelize.QueryTypes.INSERT,
      });

    
      // Check if the insert was successful and result contains insertId
      if (result) {
          // Fetch the newly created konsultasi message
          const newKonsultasiQuery = 'SELECT * FROM konsultasi WHERE id = ?';
          const [newKonsultasi] = await sequelize.query(newKonsultasiQuery, {
              replacements: [result],
              type: sequelize.QueryTypes.SELECT,
          });

          return res.status(201).json(newKonsultasi); // Return the newly created konsultasi message
      } else {
          return res.status(400).json({ message: 'Failed to create konsultasi.' });
      }
  } catch (error) {
      console.error('Error sending konsultasi:', error); // Log the error for debugging
      res.status(500).json({ message: 'Error sending konsultasi', error: error.message });
  }
};

const getRiwayatKonsultasi = async (req, res) => {
    const { kaderId, pesertaId } = req.params;
  
    const query = `
      SELECT k.message, k.sent_at as sentAt, u.username AS senderName, u.id AS senderId
      FROM konsultasi k
      JOIN user u ON k.sender_id = u.id
      WHERE (k.sender_id = :pesertaId AND k.receiver_id = :kaderId)
      OR (k.sender_id = :kaderId AND k.receiver_id = :pesertaId)
      ORDER BY k.sent_at ASC;
    `;
  
    try {
      const riwayat = await sequelize.query(query, {
        replacements: { kaderId, pesertaId },
        type: sequelize.QueryTypes.SELECT
      });
  
      if (riwayat.length === 0) {
        return res.status(404).json({ message: 'No messages found.' });
      }
  
      res.json(riwayat);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

const kirimPesanKonsultasi = async (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;
  
    try {
      const result = await sequelize.query(
        `INSERT INTO konsultasi (sender_id, receiver_id, message) VALUES (:senderId, :receiverId, :message)`,
        {
          replacements: { senderId, receiverId, message },
          type: sequelize.QueryTypes.INSERT
        }
      );
  
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {
    getPesertaKonsultasi,
    createKonsultasi,
    getKonsultasi,
    getRiwayatKonsultasi,
    kirimPesanKonsultasi
};
