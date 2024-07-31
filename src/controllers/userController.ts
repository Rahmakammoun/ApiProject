import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to login' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Admin login successfully', token });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const createFournisseur = async (req: Request, res: Response) => {
  console.log('Request body:', req.body);
  console.log('Authorization header:', req.header('Authorization'));
  const { email, password } = req.body;

  try {
  
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to create fournisseur' });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const fournisseur = await User.create({
      email,
      password: hashedPassword,
      role: 'fournisseur',
    });

    return res.status(201).json({ message: 'Fournisseur created successfully', fournisseur });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginFournisseur = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

   
    if (user.role !== 'fournisseur') {
      return res.status(403).json({ message: 'You are not authorized to login as fournisseur' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Fournisseur login successfully', token });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


