const router = require('express').Router();
const {body, validationResult} = require("express-validator");
const BadRequestError = require("../../errors/badrequest.error");
const ErrorHandler = require("../../errors/error.handler");
const UserService = require("../../services/user.service");


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
    async register(req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ErrorHandler.handle(res,new BadRequestError(errors.array()));
        }
        try{
            const result = await UserService.createUser(req.body);
            res.status(200).json({
                data: result,
                message: "User created"
            });
        }catch (e){
            ErrorHandler.handle(res,e);
        }
    }
    async login(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ErrorHandler.handle(res,new BadRequestError(errors.array()));
        }
        try{
            const result = await UserService.loginUser(req.body);
            res.status(200).json({
                data: result,
                message: "User logged in"
            });
        }catch (e){
            ErrorHandler.handle(res,e);
        }
    }
    async logout(req,res){
        //TODO BLACKLIST TOKEN
        res.status(200).json({
            message: "User logged out"
        });
    }
}
new UserController();

module.exports = router;