const dotenv = require('dotenv')
const {program} = require('./commander.js')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')


const opts = program.opts();

dotenv.config({
    path: opts.mode == 'production' ? './.env.production' : './.env.development'})

const configObject = {
    
    port: process.env.PORT || 8080,
    jwt_code: process.env.JWT_SECRET_CODE,
    cookies_code: process.env.COOKIES_SECRET_CODE,
    mongo_uri: process.env.MONGO_URI,
    mongo_secret_code: process.env.MONGO_SECRET_CODE,
    uadmin: process.env.USER_ADMIN,
    uadmin_pass: process.env.USER_ADMIN_PASS,
    gh_client_id: process.env.GITHUB_CLIENT_ID,
    gh_client_secret: process.env.GITHUB_CLIENT_SECRET,
    development: opts.mode == 'development',

    connectDB: async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, );
            console.log('Base de datos conectada');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error.message);
        }
    },
    sessionAtlas: (app) => {
        app.use(
            session({
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_URI, // 
                mongoOptions: {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
              },
                ttl: 15000000000,
            }),
            secret: process.env.MONGO_SECRET_CODE,
            resave: true, 
            saveUninitialized: true
          }))
    }
}

module.exports = {configObject}
