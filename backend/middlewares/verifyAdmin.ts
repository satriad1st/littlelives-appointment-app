import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Admin } from '../schema/admin'; 
import { verifyToken } from '@be/utils/jwt';

export const verifyAdmin = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      console.log(token)
      console.log(process.env.JWT_SECRET )
      const decoded: any = await verifyToken(token, false);
      console.log(decoded)
      const admin = await Admin.findOne({ _id: decoded.id });
      
      if (!admin) {
          return res.status(400).json({ message: 'admin not found.' });
      }

      if (admin.role !== 'admin' && admin.role !== 'superadmin') {
          return res.status(403).json({ message: 'Access denied. Admins only.' });
      }

      req.user = admin;
      next();
  } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
  }
};

export const verifySuperAdmin = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const admin = await Admin.findOne({ _id: decoded.id });
      
      if (!admin) {
          return res.status(400).json({ message: 'admin not found.' });
      }

      if (admin.role !== 'superadmin') {
          return res.status(403).json({ message: 'Access denied. Super Admins only.' });
      }

      req.user = admin;
      next();
  } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
  }
};