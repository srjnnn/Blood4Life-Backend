import { validate } from '../../../controllers/Auth/validate.js';
import { Router } from 'express';

class validateRoute {
  constructor() {
    this.router = Router({ mergeParams: true });
    this.setupRoutes();
  }
  setupRoutes() {
    this.router.route('/').post(validate);
  }
}

export default validateRoute;
