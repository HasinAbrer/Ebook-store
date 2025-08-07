const express =  require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const { loginUser } = require('./user.controller');
const { registerUser } = require('./user.controller');
const { getUserById } = require('./user.controller');
const { adminRegister } = require('./user.controller');
const { adminDetails } = require('./user.controller');
const { getAllUsers } = require('./user.controller');
const authMiddleware = require('../middleware/verifyAdminToken'); // Import the auth middleware
const bcrypt = require('bcrypt'); // Use the same as in your model


const router =  express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

router.get('/:id',getUserById);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/admin',adminRegister);
router.get('/details', adminDetails);
router.get('/allUsers',getAllUsers);

// router.post("/admin", async (req, res) => {
//     const {username, password} = req.body;
//     try {
//         const admin =  await User.findOne({username});
//         if(!admin) {
//             res.status(404).send({message: "Admin not found!"})
//         }
//         if(admin.password !== password) {
//             res.status(401).send({message: "Invalid password!"})
//         }

//         const token =  jwt.sign(
//             {id: admin._id, username: admin.username, role: admin.role},
//             JWT_SECRET,
//             {expiresIn: "1h"}
//         )

//         return res.status(200).json({
//             message: "Authentication successful",
//             token: token,
//             user: {
//                 username: admin.username,
//                 role: admin.role
//             }
//         })

//     } catch (error) {
//        console.error("Failed to login as admin", error)
//        res.status(401).send({message: "Failed to login as admin"})
//     }
// })

module.exports = router;