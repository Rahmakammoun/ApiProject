import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'fournisseur';
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'fournisseur'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;
