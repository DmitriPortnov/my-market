const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const path = require('path');

const userCtrl = require('./controller/user.controller');
const productsCtrl = require('./controller/product.controller');
const cartCtrl = require('./controller/cart.controller');
const orderCtrl = require('./controller/order.controller');

const port = process.env.PORT || 3500;
const app = express();

mongoose.connect(`mongodb://localhost:27017/shopping-online`,
    { useNewUrlParser: true },
    err => err ? console.log('mongo==============', err) : init()
);



app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'my secret word',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 15
    },
    store: new mongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userCtrl);
app.use('/product', productsCtrl);
app.use('/cart', cartCtrl);
app.use('/order', orderCtrl);

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const init = () => {
    app.listen(port, () => {
        console.log(`server up on port ${port}`);
    });
}