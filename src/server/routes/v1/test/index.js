// import the prerequisites from the controllers
import { getTestData } from "../../../controllers/test/index.js";


import { Router } from "express";

class testRoutes {
    constructor(){
       this.router = Router({mergeParams : true});
       this.setupRoutes();  
    }
    setupRoutes(){
        this.router.route("/").get(getTestData)
    }
}

export default testRoutes