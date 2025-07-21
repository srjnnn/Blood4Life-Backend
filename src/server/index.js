import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
// import bodyParser from 'body-parser'; // No longer needed, as Express has built-in parsers
import logger from '../utils/logger.js'; // Assuming you have a logger utility
import MainRouter from './routes/index.js'; // Assuming this points to your main router file

class Server {
    constructor(port, host) {
        this.app = express();
        this.port = port;
        this.host = host;
        this.httpServer = undefined;

        // Apply middleware immediately after initializing the app
        this.middlewareSetup();

        // Set up routes after middleware
        this.routingSetup();

        // Bind methods to the class instance to ensure `this` context is correct
        this.onListening = this.onListening.bind(this);
        this.onError = this.onError.bind(this);
    }

    /**
     * Configures and applies all necessary Express middleware.
     */
    middlewareSetup() {
        // Enables GZIP compression for all responses
        this.app.use(compression());

        // Helps secure your apps by setting various HTTP headers
        this.app.use(helmet());

        // Enables Cross-Origin Resource Sharing (CORS) for all routes
        this.app.use(cors());

        // --- Body Parsers ---
        // Parses incoming requests with JSON payloads
        // This is crucial for req.body to be populated when sending JSON from the client
        this.app.use(express.json());

        // If you also need to parse URL-encoded form data (e.g., from HTML forms), uncomment this:
        // this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Sets up the main routing for the application.
     */
    routingSetup() {
        // Instantiate your MainRouter and use its exported router instance
        const { router } = new MainRouter();
        // All routes defined in MainRouter will be prefixed with '/api'
        this.app.use('/api', router);

        // Optional: Basic root route for health check or welcome message
        this.app.get('/', (req, res) => {
            res.status(200).send('API is running!');
        });

        // Error handling for unmatched routes (404 Not Found) - always put this last
        this.app.use((req, res, next) => {
            res.status(404).json({ error: 'Not Found', message: `The requested URL ${req.originalUrl} was not found on this server.` });
        });

        // Global error handler - catches errors thrown by route handlers or other middleware
        this.app.use((err, req, res, next) => {
            console.error('Unhandled server error:', err.stack); // Log the full stack trace for debugging
            res.status(err.status || 500).json({
                error: err.name || 'Internal Server Error',
                message: err.message || 'An unexpected error occurred.',
            });
        });
    }

    /**
     * Starts the HTTP server and attaches error and listening event handlers.
     */
    start() {
        this.httpServer = http.createServer(this.app);
        this.httpServer.listen(this.port);
        this.httpServer.on('error', this.onError);
        this.httpServer.on('listening', this.onListening);
    }

    /**
     * Handles HTTP server errors.
     * @param {Error} error - The error object.
     */
    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;

        // Handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1); // Exit with failure code
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1); // Exit with failure code
                break;
            default:
                throw error; // Re-throw any other unhandled errors
        }
    }

    /**
     * Callback function executed when the HTTP server starts listening.
     */
    onListening() {
        const addr = this.httpServer.address();
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        logger.appStarted(addr.port, this.host); // Use logger to indicate server has started
        console.log(`Server listening on ${bind}`); // Also log to console for quick verification
    }
}

export default Server;