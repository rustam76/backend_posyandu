

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const crypto = require('crypto');

const SECRET_KEY = 'your_secret_key_here';


const md5 = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
};

// Register a new user

// Register a new user
const register = async (req, res) => {
    const { username, password, name, identity_number, address } = req.body;

    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        // Check if the user already exists
        const existingUser = await sequelize.query(`SELECT * FROM User WHERE username = :username`, {
            replacements: { username },
            type: QueryTypes.SELECT,
            transaction // Use the transaction
        });

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await md5(password);

        // Insert user and use LAST_INSERT_ID() to get the new user's ID
        await sequelize.query(
            `INSERT INTO user (username, password, role, status) VALUES (:username, :password, :role, :status)`,
            {
                replacements: { username, password: hashedPassword, role: 'peserta', status: 'inactive' },
                type: QueryTypes.INSERT,
                transaction // Use the transaction
            }
        );

        // Retrieve the last inserted ID
        const [result] = await sequelize.query(`SELECT LAST_INSERT_ID() AS user_id`, { transaction });

        const userId = result[0].user_id; // Access the user_id

        const kader = await sequelize.query(
            `INSERT INTO peserta (user_id, name, identity_number, address) VALUES (:user_id, :name, :identity_number, :address)`,
            {
                replacements: { user_id: userId, name, identity_number, address },
                type: QueryTypes.INSERT,
                transaction // Use the transaction
            }
        );

        await transaction.commit(); // Commit the transaction
        return res.status(201).json({ message: 'User registered successfully', user_id: userId });
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction if any error occurs
        console.error('Registration failed:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



// Login a user and generate a token

// MD5 hash function


const login = async (req, res) => {
    const { username, password } = req.body;

    // Create MD5 hash of the password
    const hashedPassword = md5(password);

    // Query to find the user by username and hashed password
    const user = await sequelize.query(
        `SELECT User.*, 
                Kader.name AS kaderName, 
                Peserta.name AS pesertaName,
                Peserta.identity_number AS identityNumber,
                Peserta.address
         FROM User 
         LEFT JOIN Kader ON User.id = Kader.user_id 
         LEFT JOIN Peserta ON User.id = Peserta.user_id 
         WHERE User.username = :username AND User.password = :password`,
        {
            replacements: { username, password: hashedPassword },
            type: QueryTypes.SELECT,
        }
    );

    if (user.length === 0) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Check if user status is active
    const foundUser = user[0];
    if (foundUser.status !== 'active') {
        return res.status(403).json({ message: 'User account is not active' });
    }

    // Return success message and user details (excluding password)
    const { password: _, ...userDetails } = foundUser; // Exclude password from user details

    return res.status(200).json({ message: 'Login successful', user: userDetails });
};




module.exports = { register, login };