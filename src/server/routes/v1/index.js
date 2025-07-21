// Import the routeClasses from the routes
import { Router } from "express";

// example 
import testRoutes from "./test/index.js"
import { authenticate } from "../../middleware/authMiddleware.js";


export default class V1Route{
    constructor(){
        this.router = Router({mergeParams:true});
        this.router.use(authenticate);
       
        // define routes here

        this.testRoutes = new testRoutes();




        // init setup routes
       this.setupRoutes();

    }
    setupRoutes(){
        this.router.use("/test", this.testRoutes.router);
    }
}