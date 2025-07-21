// import the prerequisites from the controllers
import { login } from "../../../controllers/Auth/login.js";


import { Router } from "express";

class loginRoute {
    constructor(){
       this.router = Router({mergeParams : true});
       this.setupRoutes();  
    }
    setupRoutes(){
        this.router.route("/").post(login)
    }
}

export default loginRoute