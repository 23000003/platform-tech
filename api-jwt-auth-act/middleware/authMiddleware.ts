import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import express, { Express, Request, Response, NextFunction } from 'express';

const JWT_SECRET : string = 'supersecretkey';

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


// Middleware to validate JWT token
function authenticateToken(req: Request, res: Response, next: NextFunction) : Response | undefined {
    const token : string | undefined = req.headers['authorization'];

    if (!token) return res.status(403).send('Token is required');

    // Take away "Bearer " string
    const newToken : string = token.split(" ")[1];

    jwt.verify(newToken, JWT_SECRET, (err: any, user: any) : Response | undefined => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });

}

// Middleware to authorize based on role
function authorizeRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) : Response | void => {
        if (req.user.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    }
}


export { authenticateToken , authorizeRole };