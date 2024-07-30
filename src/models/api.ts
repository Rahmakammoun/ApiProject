import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Api extends Model {
  public id!: number;
  public name!: string;
  public method!: string;
  public endPoint!: string;
  public params!: string;
  public userId!: number;
}

Api.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    method: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    endPoint: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'apis',
  }
);

export default Api;
