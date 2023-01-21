const router = require('express').Router();
const db = require('../../db');
const mongo = require("mongodb");
const {body, validationResult} = require("express-validator");


class UserController {
    constructor() {
        router.post('/register',
            body('email').notEmpty().isEmail(),
            body('password').notEmpty().isString(),
            body('name').notEmpty().isString(),
            this.register);
        router.post('/login',
            body('email').notEmpty().isEmail(),
            body('password').notEmpty().isString(),
            this.login);
        router.post('/logout', this.logout);
    }
    async register() {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password, name} = req.body;
        //check if user exists
        let user = await db.users().findOne({email: email});
        if (user) {
            return res.status(409).json({message: 'User already exists'});
        }
        user = await db.users().insertOne({ email: email, password: bcrypt(password), name: name });
    }
    async login(){

    }
    async logout(){

    }
}
new UserController();

module.exports = router;