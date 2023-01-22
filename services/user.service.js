const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const db = require("../db");
const ConflictError = require("../errors/conflict.error");
const NotFoundError = require("../errors/notfound.error");


class UserService {
    static async createUser(body) {
        const {email, password, name} = body;
        let user = await db.users().findOne({email: email});
        if (user) {
           throw new ConflictError("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await db.users().insertOne({ email: email, password: hashedPassword, name: name });
        user = await db.users().findOne({_id: user.insertedId});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET || "secret", {expiresIn: "1h"});
        return {token: token, user: {email : user.email, name: user.name}};
    }
    static async loginUser(body) {
        const {email, password} = body;
        const user = await db.users().findOne({email: email});
        if (!user) {
            return NotFoundError("User not found");
        }else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return NotFoundError("Invalid password");
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET || "secret", {expiresIn: "1h"});
            return {token: token, user: {email : user.email, name: user.name}};
        }

    }

}

module.exports = UserService;