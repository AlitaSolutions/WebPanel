const router = require('express').Router();
const {body, validationResult} = require("express-validator");
const SettingsService = require("../../services/setting.service");
const ErrorHandler = require("../../errors/error.handler");
const BadRequestError = require("../../errors/badrequest.error");

class SettingsController {
    constructor() {
        router.get('/', this.getSettings);
        router.post('/',
            body("key").notEmpty().isString(),
            body("value").notEmpty().isString(),
            this.createSetting);
        router.patch('/:key',
            body("value").notEmpty().isString(),
            this.updateSetting);
        router.delete('/:id', this.deleteSetting);
    }

    async getSettings(req, res) {
        const settings = SettingsService.getSettings();
        res.status(200).json(settings);
    }

    async createSetting(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const {key, value} = req.body;
        try {
            const setting = await SettingsService.createSetting(key, value);
            res.status(200).json({
                message: 'Setting created',
                data: setting,
            });
        } catch (e) {
            ErrorHandler.handle(res, e);
        }
    }

    async updateSetting(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const {key} = req.params;
        const {value} = req.body;
        try {
            const setting = await SettingsService.updateSetting(key, value);
            res.status(200).json({
                message: 'Setting updated',
                data: setting,
            });
        }catch (e){
            ErrorHandler.handle(res, e);
        }
    }

    async deleteSetting(req, res) {
        const {id} = req.params;
        try{
            const setting = await SettingsService.deleteSetting(id);
            res.status(200).json({
                message: 'Setting deleted',
                data: setting,
            });
        }catch (e){
            ErrorHandler.handle(res, e);
        }
    }
}

new SettingsController();
module.exports = router;