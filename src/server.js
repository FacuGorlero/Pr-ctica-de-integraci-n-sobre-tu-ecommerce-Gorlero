const {configObject} = require ('./config/index.js');
const program = require ('./config/commander.js')
const express = require('express');
const { createServer} = require('node:http');
const serverIo = require('./routes/serverIO.js');
//const session = require('express-session');
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars');
const { viewsrouter } = require('./routes/views.route.js');
const appRouter     = require('./routes');
const sessionsRouter = require('./routes/session.route.js')
const {userRouter} = require('./routes/user.router.js')
const passport = require('passport');
const {initializePassport} = require('./config/passport.config.js');
const session = require('express-session')
const MongoStore = require('connect-mongo')


configObject.connectDB()

const port = process.env.PORT || 8080;;
const app = express();
const server = createServer(app)
serverIo(server)


// middlewars de passport
initializePassport()
app.use(passport.initialize())
// app.use(passport.session())


// configuraciones de la App
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(configObject.cookies_code))

// motor de plantilla
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// definiendo vistas
app.use('/', viewsrouter);
app.use(appRouter)
app.use('/api/session', sessionsRouter)
app.use('/api/users', userRouter)

// Confirmacion de inicio
server.listen(port, () => {
  console.log(`Server andando en port ${port}`);
});

