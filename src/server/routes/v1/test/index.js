// import the prerequisites from the controllers
// import

import { Router } from "express";

class testRoutes {
    constructor(){
       this.route = Router({mergeParams : true});
       this.setupRoutes();  
    }
    setupRoutes(){
        this.router.route("/").get(getTestData)
    }
}

export default testRoutes