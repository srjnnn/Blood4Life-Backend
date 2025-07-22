// Import the routeClasses from the routes
import { Router } from "express";

// example 
import testRoutes from "./test/index.js"
import { authenticate, authorize } from "../../middleware/authMiddleware.js";
import loginRoute from "./Auth/login.js";
import signUpRoutes from "./Auth/signup.js";

export default class V1Route{
    constructor(){
        this.router = Router({mergeParams:true});
        
        // Mount login route first (no authentication)
        this.loginRoute = new loginRoute();
        this.signUpRoutes = new signUpRoutes();
        this.router.use("/login", this.loginRoute.router);
        this.router.use("/signup", this.signUpRoutes.router);


        this.router.use(authenticate);
        // restrict the routes for admin
        this.router.get("/admin",authorize(['admin']),(req,res)=>{ });

        // Restrict to hospital and admin
        this.router.get('/hospital', authorize(['hospital', 'admin']), (req, res) => {});

       
        // define routes here
        this.testRoutes = new testRoutes();

        // init setup routes
       this.setupRoutes();

    }
    setupRoutes(){
        this.router.use("/test", this.testRoutes.router);
    }
}