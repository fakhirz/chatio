require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const [check, validationResult] = require('express-validator');
const cookieParser = require('cookie-parser');
// ...

const db = require('./util/database');

const app = express();
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', 'views');

const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(dashboardRoutes);
app.use('/auth', authRoutes);
app.use(chatRoutes);
app.use(messageRoutes);

app.listen(3000);
