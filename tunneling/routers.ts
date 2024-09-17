import express, { Express, Response, Request } from 'express';

/**All routes are protected with a condition via headers
 * req => the request of the frontend to the backend which is this server
 * res => the response of the backend to the frontend
 * status => 200 = success    403 = Forbidden Status
 * send=> response body 
 * 
 */


// my routes function
export default function MyRouters(app: Express) : void {
    
    // my landing page on path " / "
    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Hello World");
    });

    //my route1 on path " route1 "
    app.get("/route1", (req: Request, res: Response) => {
        const { xaccessroute1 }: any = req.headers; // access the Item named XACessRouter
        
        if(xaccessroute1 === "allow-route1"){ //if not the value we like then access the path
            return res.status(200).send("You are At AllowRoute1"); // 200 = status complete
        }else{
            // res.redirect("/");
            return res.status(403).send("Invalid Headers for Route 1"); // send status 403
        }
    });

    app.get("/route2", (req: Request, res: Response) => {
        const { xaccessroute2 }: any = req.headers;

        if(xaccessroute2 === "allow-route2"){
            return res.status(200).send("You are At AllowRoute2");
        }else{
            return res.status(403).send("Invalid Headers for Route 2"); 
        }
    });

    app.get("/route3", (req: Request, res: Response) => {
        const { username, password }: any = req.headers;

        if(username === "test" &&  password === "password"){
            return res.status(200).send("You are now Login'd");
        }else{
            return res.status(403).send("Invalid Headers for Route 3"); 
        }
    });

    app.get("/route4", (req: Request, res: Response) => {
        const { authorizationbearer }: any = req.headers;

        let bearerToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        if(authorizationbearer === bearerToken){
            return res.status(200).send("You are now Login'd Bearer");
        }else{
            return res.status(403).send("Invalid Headers for Route 4"); 
        }
    });
    
}