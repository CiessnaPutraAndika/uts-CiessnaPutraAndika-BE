import User from "../models/UsersModels.js";
import bcrypt from 'bcryptjs/dist/bcrypt.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({error: error.message, message: "Terjadi kesalahan saat getAllUsers"})
    }
}

export const getUserById = async (req, res) => {
    try {
        const {id} = req.params; // Mengambil ID dari parameter URL
        const user = await User.findByPk(id); // Menggunakan findByPk untuk mencari berdasarkan primary key
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil id", error: error.message });
    }
};

export const createUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = await User.create({username, email, password});
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({error: error.message, message: "Gagal membuat User"})
    }
}

export const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        const { username, email, password } = req.body;
        const [updated] = await User.update({ username, email, password }, { where: { id } });
        const updatedUser = await User.findByPk(id);
        // JIKA TIDAK ADA YANG TERUPDATE MAKA AKAN ERROR
        if (updated === 0){
            res.status(404).json({error: error.message, message: "User tidak ter-update"})
        }else{
            res.status(200).json(updatedUser);
        }
    }catch(error){
        res.status(500).json({error: error.message, message: "Gagal mengupdate user"})
    }
}

export const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await User.destroy({where: {id}});
        res.status(200).json(deleted + ` User ke ${id} berhasil dihapus`)
    }catch(error){
        res.status(500).json({error: error.message, message: "Gagal menghapus user"})
    }
}

// LOGIN
export const loginUser = async (req, res) => {
    try {
        // fungsinya untuk mencari alamat email yang telah terdaftar
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (user !== null) {
            // fungsinya untuk matching/menyamakan password yang telah ter-regist
            const matching = await bcrypt.compare(req.body.password, user.password);
            // console.log(matching)
            if (!matching) {
                // console.log('password')
                res.status(401).json("Password salah")
            }else {
                const userId = user.id            
                const email = user.email
                // const password = user.password
                
                const accessToken = jwt.sign(
                    {
                        // PAYLOAD/MUATAN
                        userId, email 
                    },
                        // JWT SECRETT
                        process.env.ACCESS_TOKEN, 
                    {
                        // EXPIRED DATE
                        expiresIn: '1h'
                    }
                )

                //  untuk memperpanjang akses tanpa meminta login ulang setelah access token habis
                const refreshToken = jwt.sign(
                    {
                        userId, email 
                    }, 
                        process.env.REFRESH_TOKEN, 
                    {
                        expiresIn: '1d'
                    }
                )

                // simpan refresh token dalam database
                await User.update({ token_refresh: refreshToken }, {
                    where: {
                        id: userId
                    }
                })
                
                // mengatur cookie di sisi klien melalui HTTP response.
                res.cookie(                    
                    'refreshToken', //nama cookie yang akan disimpan di browser.                    
                    refreshToken, //nilai refresh token yang akan disimpan dalam cookie tersebut.
                    {
                        httpOnly: true, //hanya dapat diakses oleh server
                        maxAge: 24 * 60 * 60 * 1000, //cookie akan kadaluwarsa ketika sudah 24 jam           
                    }
                )
                
                return res.status(200).json({
                    msg: "Login successfully",
                    accessToken,
                })
            }
        } else {
            res.status(500).json("Email belum terdaftar")
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Terjadi kesalahan saat login", error: err.message });
    }
}

// REGISTER

export const registerUser = async (req, res) => {
    try{
        const {username, email, password, token_refresh} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // untuk menyimpan nilai hashedPassword

        const newUser = await User.create ({
            username,
            email,
            password: hashedPassword, // password diganti menjadi hashedPassword
            token_refresh,
        });

        return res.status(201).json({
            msg: "User registered successfully",
            user: newUser,
        })
    }catch (error){
        return res.status(500).json({
            msg: "Registration Failed",
            error: error.message,
        })
    }
}