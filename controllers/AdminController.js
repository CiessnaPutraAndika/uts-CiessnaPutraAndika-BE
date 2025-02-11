import Admin from "../models/AdminModels.js";
import bcrypt from 'bcryptjs/dist/bcrypt.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const getAllAdmin = async (req, res) => {
    try{
        const admin = await Admin.findAll();
        res.status(200).json(admin)
    }catch(error){
        res.status(500).json({error: error.massage, message: "terjadi kesalahan saat getAllAdmin"})
    }
}

export const getAdminById = async (req, res) => {
    try {
        const {id} = req.params; // Mengambil ID dari parameter URL
        const admin = await Admin.findByPk(id); // Menggunakan findByPk untuk mencari berdasarkan primary key
        if (!admin) {
            return res.status(404).json({ message: "Admin tidak ditemukan" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil id", error: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const admin = await Admin.create({username, email, password});
        res.status(200).json(admin);
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal membuat Admin"})
    }
}

export const updateAdmin = async (req, res) => {
    try{
        const { id } = req.params;
        const { username, email, password } = req.body;
        const [updated] = await Admin.update({ username, email, password }, { where: { id } });
        const updatedAdmin = await Admin.findByPk(id);
        // JIKA TIDAK ADA YANG TERUPDATE MAKA AKAN ERROR
        if (updated === 0){
            res.status(404).json({error: error.message, message: "admin tidak ter-update"})
        }else{
            res.status(200).json(updatedAdmin);
        }
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal mengupdate admin"})
    }
}

export const deleteAdmin = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await Admin.destroy({where: {id}});
        res.status(200).json(deleted + ` Admin ke ${id} berhasil dikeluarkan`)
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal mengeluarkan admin"})
    }
}

// LOGIN
export const loginAdmin = async (req, res) => {
    try {
        // fungsinya untuk mencari alamat email yang telah terdaftar
        const admin = await Admin.findOne({
            where: {
                email: req.body.email
            }
        })
        if (admin !== null) {
            // fungsinya untuk matching/menyamakan password yang telah ter-regist
            const matching = await bcrypt.compare(req.body.password, admin.password);
            // console.log(matching)
            if (!matching) {
                // console.log('password')
                res.status(401).json("password salah")
            }else {
                const adminId = admin.id            
                const email = admin.email
                // const password = admin.password
                
                const accessToken = jwt.sign(
                    {
                        // PAYLOAD/MUATAN
                        adminId, email 
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
                        adminId, email 
                    }, 
                        process.env.REFRESH_TOKEN, 
                    {
                        expiresIn: '1d'
                    }
                )

                // simpan refresh token dalam database
                await Admin.update({ token_refresh: refreshToken }, {
                    where: {
                        id: adminId
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
                    msg: "login successfully",
                    accessToken,
                })
            }
        } else {
            res.status(500).json("email belum terdaftar")
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Terjadi kesalahan saat login", error: err.message });
    }
}

// REGISTER

export const registerAdmin = async (req, res) => {
    try{
        const {username, email, password, token_refresh} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // untuk menyimpan nilai hashedPassword

        const newUser = await Admin.create ({
            username,
            email,
            password: hashedPassword, // password diganti menjadi hashedPassword
            token_refresh,
        });

        return res.status(201).json({
            msg: "admin registered successfully",
            user: newUser,
        })
    }catch (error){
        return res.status(500).json({
            msg: "Registration Failed",
            error: error.message,
        })
    }
}
