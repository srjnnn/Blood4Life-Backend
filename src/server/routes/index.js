import { Router } from 'express';
import V1Route from './v1/index.js';

export default class MainRouter {
    constructor() {
        this.router = Router({ mergeParams: true });

        this.v1Route = new V1Route();
        this.v1RouterSetup();
    }

    v1RouterSetup() {
        this.router.use('/v1', this.v1Route.router);
    }
}