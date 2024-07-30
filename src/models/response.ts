import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Api from './api';

class Response extends Model {
  public id!: number;
  public apiId!: number;
  public data!: string;
  public params!: string;
  
}

Response.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    apiId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    params: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  
  {
    sequelize,
    tableName: 'responses',
  }
);



export default Response;
