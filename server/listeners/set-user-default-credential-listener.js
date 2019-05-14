import {TextUtils, RandomUtils} from "@themost/common";
/**
 * @param {DataEventArgs} event
 * @param {Function} callback
 */
export function beforeSave(event, callback) {
    return callback();
}

/**
 * @param {DataEventArgs} event
 * @param {Function} callback
 */
export function afterSave(event, callback) {
    // validate insert state and user external flag
    if (event.state === 1 && !event.target.external) {
        // get user password or generate a new one
        const userPassword = `{clear}${RandomUtils.randomChars(8)}`;
        if (event.target.userCredentials && event.target.userPassword) {
            userPassword = event.target.userPassword;
        }
        // insert user credentials
        return event.model.context.model('UserCredential').silent().insert({
            id: event.target.id,
            userPassword: userPassword
        }).then(()=> {
            return callback();
        }).catch((err)=> {
            return callback(err);
        });
    }
    return callback();
}