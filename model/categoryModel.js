const { Sequelize, DataTypes } = require("sequelize");

const makeCategoryTable = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        categoryName: {
            type: DataTypes.ENUM('Mens', 'Womens', 'Sports', 'Luxury'),
            allowNull: false,
            defaultValue: 'Mens' // Optional: Set a default category if needed
        }
    });

    return Category;
};

module.exports = makeCategoryTable;
