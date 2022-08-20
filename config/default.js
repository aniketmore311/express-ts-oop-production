//eslint-disable-next-line
const path = require("path");

module.exports = {
    server: {
        port: process.env.PORT || "8080"
    },
    application: {
        logDir: process.env.LOG_DIR || path.join(process.cwd(), 'logs')
    },
    env: {
        NODE_ENV: process.env.NODE_ENV || "development"
    }
}