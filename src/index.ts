import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import fournisseurRoutes from './routes/fournisseurRoutes';
import apiRoutes from './routes/apiRoutes'; 
import initializeDatabase from './init';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/fournisseur', fournisseurRoutes);
app.use('/api', apiRoutes);  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  initializeDatabase().catch((err) => console.log(err));
});

export default app;
