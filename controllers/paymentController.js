import Transaksi from "../models/TransaksiModels.js";
import Admin from "../models/AdminModels.js";
import Menu from "../models/MenuModels.js";
import Users from "../models/UsersModels.js";

export const getAllPayment = async (req, res) => {
    try{
        const transaksi = await Transaksi.findAll({
            include: [
                {
                    model: Menu,
                    as: "Menu",
                },
                {
                    model: Admin,
                    as: "Admin",
                },
                {
                    model: Users,
                    as: "Users",
                },
            ],
        });
        res.status(200).json(transaksi)
    } catch(error){
        res.status(500).json({error: error.massage, message: "terjadi kesalahan saat getAllTransaksi"})
    }
};

export const getTransaksiById = async (req, res) => {
    try {
        const {id} = req.params; // Mengambil ID dari parameter URL
        const transaksi = await Transaksi.findByPk(id, {
            include: [
                {
                    model: Menu,
                    as: "Menu",
                },
                {
                    model: Admin,
                    as: "Admin",
                },
                {
                    model: Users,
                    as: "Users",
                },
            ],
        }); // Menggunakan findByPk untuk mencari berdasarkan primary key
        if (!transaksi) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }
        res.status(200).json(transaksi);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil id", error: error.message });
    }
};

export const createTransaksi = async (req, res) => {
    try{
        const { total_harga, pembayaran, MenuId, AdminiD, UsersId } = req.body;
        const transaksi = await Transaksi.create({total_harga, pembayaran, MenuId: MenuId, AdminId: AdminiD, UsersId: UsersId});
        res.status(200).json(transaksi);
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal membuat Transaksi"})
    }
}

export const updateTransaksi = async (req, res) => {
    try{
        const { id } = req.params;
        const { total_harga, pembayaran, MenuId, AdminId, UsersId } = req.body;
        const [updated] = await Transaksi.update({ total_harga, pembayaran, MenuId: MenuId, AdminId: AdminId, UsersId : UsersId }, { where: { id } });
        const updatedTransaksi = await Transaksi.findByPk(id);
        // JIKA TIDAK ADA YANG TERUPDATE MAKA AKAN ERROR
        if (updated === 0){
            res.status(404).json({error: error.message, message: "transaksi tidak ter-update"})
        }else{
            res.status(200).json(updatedTransaksi);
        }
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal mengupdate transaksi"})
    }
}

export const deleteTransaksi = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await Transaksi.destroy({where: {id}});
        res.status(200).json(deleted + ` transaksi dengan pelanggan ke ${id} berhasil menghapus transaksi`)
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal menghapus transaksi"})
    }
}