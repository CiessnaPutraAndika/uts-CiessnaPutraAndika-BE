import Admin from "../models/AdminModels.js";
import Daftar from "../models/DaftarModels.js";

export const getAllDaftar = async (req, res) => {
    try{
        const daftarMenu = await Daftar.findAll({
            include: [
                {
                    model: Admin,
                    as: "Admin",
                },
            ],
        });
        res.status(200).json(daftarMenu)
    } catch(error){
        res.status(500).json({error: error.massage, message: "terjadi kesalahan saat getAllDaftarMenu"})
    }
};

export const getDaftarById = async (req, res) => {
    try {
        const {id} = req.params; // Mengambil ID dari parameter URL
        const daftarMenu = await Daftar.findByPk(id, {
            include: [
                {
                    model: Admin,
                    as: "Admin",
                },
            ],
        }); // Menggunakan findByPk untuk mencari berdasarkan primary key
        if (!daftarMenu) {
            return res.status(404).json({ message: "Daftar Menu tidak ditemukan" });
        }
        res.status(200).json(daftarMenu);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil id", error: error.message });
    }
};

export const createDaftar = async (req, res) => {
    try{
        const { name, description, price, gambar, AdminId } = req.body;
        const daftarMenu = await Daftar.create({name, description, price, gambar, AdminId : AdminId});
        res.status(200).json(daftarMenu);
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal create daftar menu"})
    }
}

export const updateDaftar = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, description, price, gambar, AdminId } = req.body;
        const [updated] = await Daftar.update({ name, description, price, gambar, AdminId : AdminId }, { where: { id } });
        const updatedMenu = await Daftar.findByPk(id);
        // JIKA TIDAK ADA YANG TERUPDATE MAKA AKAN ERROR
        if (updated === 0){
            res.status(404).json({error: error.message, message: "daftar menu tidak ter-update"})
        }else{
            res.status(200).json(updatedMenu);
        }
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal mengupdate daftar menu"})
    }
}

export const deleteDaftar = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await Daftar.destroy({where: {id}});
        res.status(200).json(deleted + ` daftar menu ke ${id} berhasil dihapus`)
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal menghapus daftar menu"})
    }
}