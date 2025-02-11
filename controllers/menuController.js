import Menu from "../models/MenuModels.js";
import Users from "../models/UsersModels.js";

export const getAllMenu = async (req, res) => {
    try {
        console.log('Fetching menu with included Users...');
        const menu = await Menu.findAll({
            include: [
                {
                    model: Users,
                    as: "Users", // Ensure this matches the alias in the association
                },
            ],
        });
        console.log('Menu fetched successfully:', menu);
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error in getAllMenu:', error);
        res.status(500).json({ error: error.message, message: "terjadi kesalahan saat getAllMenu" });
    }
};

export const getMenuById = async (req, res) => {
    try {
        const {id} = req.params; // Mengambil ID dari parameter URL
        const menu = await Menu.findByPk(id, {
            include: [
                {
                    model: Users,
                    as: "Users",
                },
            ],
        }); // Menggunakan findByPk untuk mencari berdasarkan primary key
        if (!menu) {
            return res.status(404).json({ message: "Menu tidak ditemukan" });
        }
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat mengambil id", error: error.message });
    }
};

export const createMenu = async (req, res) => {
    try{
        const { menu_name, description, harga, gambar, UserId } = req.body;
        const menu = await Menu.create({menu_name, description, harga, gambar, UserId: UserId});

        // if (OrderId) {
        //     const orderExists = await Order.findByPk(OrderId);
        //     if (!orderExists) {
        //         return res.status(400).json({ error: "OrderId does not exist", message: "gagal create karena order" });
        //     }
        // }

        res.status(200).json(menu);
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal membuat createMenu"})
    }
}

export const updateMenu = async (req, res) => {
    try{
        const { id } = req.params;
        const { menu_name, description, harga, gambar, UserId } = req.body;
        const [updated] = await Menu.update({ menu_name, description, harga, gambar, UserId: UserId }, { where: { id } });
        const updatedMenu = await Menu.findByPk(id);
        // JIKA TIDAK ADA YANG TERUPDATE MAKA AKAN ERROR
        if (updated === 0){
            res.status(404).json({error: error.message, message: "menu tidak ter-update"})
        }else{
            res.status(200).json(updatedMenu);
        }
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal mengupdate menu"})
    }
}

export const deleteMenu = async (req, res) => {
    try{
        const { id } = req.params;
        const deleted = await Menu.destroy({where: {id}});
        res.status(200).json(deleted + ` menu ke ${id} berhasil dihapus`)
    }catch(error){
        res.status(500).json({error: error.message, message: "gagal menghapus menu"})
    }
}