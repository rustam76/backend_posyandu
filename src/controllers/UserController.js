const { sequelize } = require('../config/db');


// Get all users
getUsers = async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(`
            SELECT p.*, p.id as pesertaId, u.*, u.id as userId
            FROM peserta p
            JOIN user u ON p.user_id = u.id
            WHERE u.status = 'active'
            AND p.id NOT IN (SELECT peserta_id FROM datakb)
        `);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
    getUsers,
    
};