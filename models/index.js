import { Sequelize } from "sequelize";
import db from "../utils/connection.js"
import Order from "./OrderModels.js";
import Menu from "./MenuModels.js";
import Transaksi from "./TransaksiModels.js";
import Daftar from "./DaftarModels.js";
import Admin from "./AdminModels.js";
// import Transaksi from "./TransaksiModels.js";


await db.sync();
await Admin.sync()
await Order.sync()
await Daftar.sync()
await Menu.sync()
await Transaksi.sync()
// await Transaksi.sync()
// await Sequelize.sync({ force: true });  // Akan menghapus dan membuat ulang tabel