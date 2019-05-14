import {EdmMapping,EdmType} from '@themost/data/odata';
import {DataObject} from '@themost/data/data-object';
let Account = require('./account-model');
/**
 * @class
 
 * @property {number} id
 * @property {number} accountType
 * @property {Date} lockoutTime
 * @property {number} logonCount
 * @property {boolean} enabled
 * @property {boolean} external
 * @property {Date} lastLogon
 * @property {Array<Group|any>} groups
 * @augments {DataObject}
 */
@EdmMapping.entityType('User')
class User extends Account {
    /**
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * Gets the interactive user
     * @param context
     * @returns {Promise<User>}
     */
    @EdmMapping.func('Me', 'User')
    static async getMe(context) {
        return await context.model('User').where('name').equal(context.user && context.user.name).getTypedItem();
    }
}
module.exports = User;