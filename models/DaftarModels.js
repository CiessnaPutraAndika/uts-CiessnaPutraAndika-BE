import { DataTypes } from "sequelize";
import db from "../utils/connection.js";
import Order from "./OrderModels.js";
import Menu from "./MenuModels.js";
import Transaksi from "./TransaksiModels.js";
import Admin from "./AdminModels.js";
import Users from "./UsersModels.js";

const Daftar = db.define(
    // memberikan nama models dengan nama User secara default, jika tidak memberikan tablename maka akan menjadi nama jamak
    "Daftar", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,        
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,        
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,        
        },
        gambar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, 
    {
        tableName: "daftar",        
    }
);

Admin.hasMany(Daftar, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Daftar.belongsTo(Admin, {
    foreignKey: "AdminId",  // Foreign key in Customer refers to Menu
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Users.hasMany(Menu, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

Menu.belongsTo(Users, {
    foreignKey: "UserId",
    as: "Users",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

// Daftar.hasOne(Order, {
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
// })

// Order.belongsTo(Daftar, {
//     foreignKey: "ListId",
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
// })

// Menu.hasMany(Order, {
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
// });

// Order.belongsTo(Menu, {
//     foreignKey: "MenuId",  // Foreign key in Order refers to Menu
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
// });

Menu.hasOne(Transaksi, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Transaksi.belongsTo(Menu, {
    foreignKey: "MenuId",  // Foreign key in Transaksi
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Users.hasOne(Transaksi, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Transaksi.belongsTo(Users, {
    foreignKey: "UserId",  // Foreign key in Transaksi
    as: "Users",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Admin.hasMany(Transaksi, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

Transaksi.belongsTo(Admin, {
    foreignKey: "AdminId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})

export default Daftar;