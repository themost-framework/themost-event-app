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
    if (event.state == 1) {
        let newUser = event.target.user;
        // if user attribute does not exist
        if (event.target.user == null) {
            //set user data
            newUser = {
                groups: [
                    {
                        name:'Users'
                    }
                ]
            };
        }
        Object.assign(newUser, {
            name: event.target.email,
            description:event.target.description,
        });
        // save user
        return event.model.context.model('User').silent().insert(newUser).then( () => {
            return callback();
        }).catch( err => {
            return callback(err);
        });
    }
    return callback();
}