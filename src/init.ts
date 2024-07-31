import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import User from './models/user'; 

const initializeDatabase = async () => {
  const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  });

  try {
   
    await sequelize.sync();

   
    const adminExists = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL }
    });

    if (!adminExists) {
      
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });

      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase;
