import _ from 'lodash';
import {parseExpression} from 'cron-parser';
import moment from 'moment';
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
    if (event.state === 1) {
        //get super event hours specification if any 
        let model = event.model;
        return model.where('id').equal(event.target.id)
            .select('superEvent/eventHoursSpecification/splitDuration').silent().value().then((splitDuration)=> {
                if (_.isNil(splitDuration)) {
                    return callback();
                }
                //try to split this event
                let options = {
                    currentDate: event.target.startDate,
                    endDate: event.target.endDate,
                    iterator: true
                };
                //create cronjob expression
                let duration = moment.duration(splitDuration);
                let cronjob = `*/${duration.as('minutes')} * * * *`;
                let interval = parseExpression(cronjob, options);
                let intervals = [];
                while (interval) {
                    try {
                        let obj = interval.next();
                        let nextDate = obj.value.toDate();
                        if (nextDate<event.target.endDate) {
                            intervals.push(nextDate);
                        }
                    } catch (err) {
                        break;
                    }
                }
                //clone event
                let events = intervals.map((x)=> {
                    return {
                        startDate: x,
                        endDate: moment(x).add(duration).toDate(),
                        duration: duration.toISOString(),
                        contributor: event.target.contributor,
                        performer: event.target.performer,
                        audience: event.target.audience,
                        remainingAttendeeCapacity: event.target.maximumAttendeeCapacity,
                        maximumAttendeeCapacity: event.target.maximumAttendeeCapacity,
                        organizer: event.target.organizer,
                        superEvent: event.target.id,
                        location: event.target.location
                    }
                });
                return model.context.model(event.target.additionalType).silent().save(events).then(()=> {
                    return callback();
                });
            }).catch((err)=> {
               return callback(err); 
            });
        
    }
    return callback();
}