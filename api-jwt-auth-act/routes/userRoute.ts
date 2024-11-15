import express, { Express, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router : Router = Router();

const JWT_SECRET : string = 'supersecretkey';

const users = [   //admin_password     //user_password          (created my encrypted password mock as the given is returning false)
    { id: 1, username: 'admin', password: '$2a$10$3XeiDzWLReC0f6Msfy.Ym.aJfzkN1GYdMN6A.uB.1xi/iajoQV3uK', role: 'admin' },
    { id: 2, username: 'user', password: '$2a$10$YaTXSvO5cIVOO96DDOm/8ec2iPFY4hjBeJ1FrriNLDVi7efaR/3oi', role: 'user' },
];


// Login route
router.post('/login', (req: Request, res: Response) : Response => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    // const Comp = async(): Promise<void> =>{
    //     const salt = await bcrypt.genSalt();
    //     const hashed = await bcrypt.hash(password, salt);
    //     const isMatch = bcrypt.compareSync(password, "$2a$10$3XeiDzWLReC0f6Msfy.Ym.aJfzkN1GYdMN6A.uB.1xi/iajoQV3uK");
    //     console.log(isMatch)
    //     console.log(password, hashed);
    // }

    // Comp();

    //Validate password
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
        console.log("HERE")
        return res.status(401).send('Invalid username or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Generate Refresh Token
    const refreshToken = jwt.sign({ userId: user.id, isRefreshToken: "true" }, JWT_SECRET, { expiresIn: '1d'});

    return res.json({ token, refreshToken });
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


// Refresh-token route
router.get('/refresh', authenticateToken, (req: Request, res: Response): Response | undefined =>{
    
    const refreshToken = <string>req.headers['refreshtoken'];
    const user = req.user;

    if(!refreshToken){
        return res.send("No Refresh Token").status(403);
    }

    // Take away "Bearer " string
    const newToken : string = refreshToken.split(" ")[1];

    jwt.verify(newToken, JWT_SECRET, (err: any) : Response => {
        if (err) return res.status(403).send('Invalid refresh token');
        
        const newToken = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        
        return res.status(200).json({ newToken })
    });
    
});


export { router as userRoute };