import _ from 'lodash';
import {DataConfigurationStrategy} from '@themost/data';
/**
 * @param {DataEventArgs} event
 * @param {Function} callback
 */
export function beforeSave(event, callback) {
    if (event.state === 1) {
        let context = event.model.context;
        let configuration = context.getApplication().getConfiguration().getStrategy(DataConfigurationStrategy);
        if (typeof event.target.person === 'object') {
            //try to find person
            let q;
            if (new RegExp(configuration.dataTypes.Email.properties.pattern).test(event.target.person.email)) {
                q = context.model('Person').where('email').equal(event.target.person.email);    
            }
            else if (new RegExp(configuration.dataTypes.Guid.properties.pattern).test(event.target.person.identifier)) {
                q = context.model('Person').where('identifier').equal(event.target.person.identifier);
            }
            if (q) {
                return q.silent().getItem().then((person)=> {
                    if (_.isNil(person)) {
                        return context.model('Person').silent().save(event.target.person).then(()=> {
                           return callback(); 
                        });
                    }
                    //set person
                    event.target.person = person;
                    return callback();
                }).catch((err)=> {
                    return callback(err);
                });
            }
            else {
                //try to insert person
                return context.model('Person').silent().save(event.target.person).then(()=> {
                   return callback(); 
                }).catch((err)=> {
                    return callback(err);
                });
            }
            
        }
    }
    return callback();
}

/**
 * @param {DataEventArgs} event
 * @param {Function} callback
 */
export function afterSave(event, callback) {
    return callback();
}