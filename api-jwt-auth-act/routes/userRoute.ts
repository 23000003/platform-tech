import express, { Express, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router : Router = Router();

const JWT_SECRET : string = 'supersecretkey';

const users = [
    { id: 1, username: 'admin', password: 'admin_password', role: 'admin' },
    { id: 2, username: 'user', password: '$2a$10$xyz1234', role: 'user' },
];

// Login route
router.post('/login', (req: Request, res: Response) : Response => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        console.log("HERE2#!#!#!")
        return res.status(401).send('Invalid username or password');
    }

    // Validate password
    const isMatch = bcrypt.compare(user.password, password); //compareSync always returns false so ichange it to compare
    if (!isMatch) {
        console.log("HERE")
        return res.status(401).send('Invalid username or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
}); 

declare global {
    namespace Express {
      interface Request {
        user: User;
      }
    }
  }

interface User{
    userId: number,
    role: string,
}

// Protected route for all authenticated users
router.get('/profile', authenticateToken, (req: Request, res: Response) : void => {
    res.json({ message: `Hello ${req.user.role}, this is your profile.` });
});

// Admin-only route
router.get('/admin', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) : void => {
    res.json({ message: 'Welcome Admin! This route is restricted to admins only.' });
});

// User-only route
router.get('/user', authenticateToken, authorizeRole('user'), (req: Request, res: Response) : void => {
    res.json({ message: 'Welcome User! This route is restricted to users only.' });
});


export { router as userRoute };