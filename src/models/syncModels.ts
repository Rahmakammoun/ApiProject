import User from './user';
import Api from './api';
import Response from './response';

// Sync associations
User.hasMany(Api, { foreignKey: 'userId', as: 'apis' });
Api.belongsTo(User, { foreignKey: 'userId', as: 'user' });  

Api.hasMany(Response, { foreignKey: 'apiId', as: 'responses' });
Response.belongsTo(Api, { foreignKey: 'apiId', as: 'api' });

const syncModels = async () => {
  await User.sync();
  await Api.sync();
  await Response.sync();
};

export { User, Api, Response, syncModels };
