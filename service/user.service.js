const _ = require('lodash');

const userService = {
    login: (req, res) => {
        const user = _.omit(req.user, 'password');
        return (req.user.length !== 0) ? res.send(user) : res.status(400).json({message: "wrong inputs"});
    },
    beforeSignUp: (req, res) => {
        return res.status(202).json({user: true});
    },
    signup: (req, res) => {
        return res.status(201).json({user: "created"});
    },
    isLogedIn: (req, res) => {
        const user = _.omit(req.user, 'password');
        return res.send(user);
    }
}

module.exports = userService;