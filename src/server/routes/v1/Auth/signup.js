import { signup } from "../../../controllers/Auth/signup.js";
import { Router } from "express";

class signUpRoutes{
    constructor(){
        this.router = Router({mergeParams : true})
        this.signUpRoutes();
    }
    signUpRoutes(){
        this.router.route("/").post(signup);
    }
}
export default signUpRoutes