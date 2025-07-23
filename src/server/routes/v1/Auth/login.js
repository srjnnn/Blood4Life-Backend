// import the prerequisites from the controllers
import { login } from "../../../controllers/Auth/login.js";
import { resetPassword } from "../../../controllers/Auth/reset.js";
import { verifyAndUpdatePassword } from "../../../controllers/Auth/reset/verifyOtp.js";
import { Router } from "express";

class loginRoute {
    constructor(){
       this.router = Router({mergeParams : true});
       this.setupRoutes();  
    }
    setupRoutes(){
        this.router.route("/").post(login)
        this.router.route("/reset").post(resetPassword)
        this.router.route("/reset/verify").post(verifyAndUpdatePassword)
    }
}

export default loginRoute