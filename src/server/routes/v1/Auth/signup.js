import { signup } from "../../../controllers/Auth/signup.js";
import { verifyEmail } from "../../../controllers/Auth/verifyUser.js";
import { Router } from "express";

class signUpRoutes{
    constructor(){
        this.router = Router({mergeParams : true})
        this.signUpRoutes();
    }
    signUpRoutes(){
        this.router.route("/").post(signup);
        this.router.route("/verify").post(verifyEmail)
    }
}
export default signUpRoutes