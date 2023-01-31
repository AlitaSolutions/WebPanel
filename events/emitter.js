const emitter = require('events');

const Events  = {
    PLATFORM_MODIFIED : 'platform_modified',
    SERVICE_MODIFIED : 'service_modified',
    SERVER_MODIFIED : 'server_modified',
    SETTINGS_MODIFIED : 'settings_modified',
    SCHEMA_MODIFIED : 'schema_modified',
    MANAGER_LOGGEDIN : 'manager_loggedin',
}
let EventEmitter = new emitter();

module.exports = {
    EventEmitter,Events
}