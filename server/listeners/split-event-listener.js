import _ from 'lodash';
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
                let intervals = [];
                let nextDate = options.currentDate;
                let duration = moment.duration(splitDuration);
                while(nextDate<event.target.endDate) {
                    intervals.push(nextDate);
                    nextDate = moment(nextDate).add(duration).toDate();
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