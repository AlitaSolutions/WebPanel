const redis = require('redis');
const {EventEmitter, Events} = require("../events/emitter");

class CacheService {
    constructor() {
        this.client = redis.createClient({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || null,
            db: process.env.REDIS_DB || 0
        });
        EventEmitter.on(Events.PLATFORM_MODIFIED , this.updateCache);
        EventEmitter.on(Events.SERVICE_MODIFIED , this.updateCache);
        EventEmitter.on(Events.SERVER_MODIFIED , this.updateCache);
        EventEmitter.on(Events.SETTINGS_MODIFIED , this.updateCache);
    }
    async updateCache(ev){
        console.log(ev);
    }
}
module.exports = CacheService;