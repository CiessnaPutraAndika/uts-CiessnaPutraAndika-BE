import express from "express"
import { createOrder, deleteOrder, getAllOrder, getOrderById, updateOrder, } from "../controllers/orderController.js";
import { createMenu, deleteMenu, getAllMenu, getMenuById, updateMenu } from "../controllers/menuController.js";
import { createAdmin, deleteAdmin, getAdminById, getAllAdmin, loginAdmin, registerAdmin, updateAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createDaftar, deleteDaftar, getAllDaftar, getDaftarById, updateDaftar } from "../controllers/daftarController.js";
import { createTransaksi, deleteTransaksi, getAllPayment, getTransaksiById, updateTransaksi } from "../controllers/paymentController.js";
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, registerUser, updateUser } from "../controllers/usersController.js";
const router = express.Router();

router.get("/order", getAllOrder)
router.get("/order/find/:id", getOrderById)
router.post("/order/create", createOrder)
router.put('/order/update/:id', updateOrder);
router.delete("/order/delete/:id", deleteOrder)

router.get("/daftar", getAllDaftar)
router.get("/daftar/find/:id", getDaftarById)
router.post("/daftar/create", createDaftar)
router.put('/daftar/update/:id', updateDaftar);
router.delete("/daftar/delete/:id", deleteDaftar)

router.get("/menu", getAllMenu)
router.get("/menu/find/:id", getMenuById)
router.post("/menu/create", createMenu)
router.delete("/menu/delete/:id", deleteMenu)
router.put("/menu/update/:id",updateMenu)

router.get("/transaksi", getAllPayment)
router.get("/transaksi/find/:id", getTransaksiById)
router.post("/transaksi/create", createTransaksi)
router.delete("/transaksi/delete/:id", deleteTransaksi)
router.put("/transaksi/update/:id", updateTransaksi)

router.get("/admin", verifyToken, getAllAdmin)
router.get("/admin/find/:id", getAdminById)
router.post("/admin/create", createAdmin)
router.delete("/admin/delete/:id", deleteAdmin)
router.put("/admin/update/:id",updateAdmin)

router.get("/users", verifyToken, getAllUsers)
router.get("/users/find/:id", getUserById)
router.post("/users/create", createUser)
router.delete("/users/delete/:id", deleteUser)
router.put("/users/update/:id",updateUser)

router.post("/register/create", registerAdmin)
router.post("/login/create", loginAdmin)
router.post("/userregist/create", registerUser)
router.post("/userlogin/create", loginUser)

export default router;