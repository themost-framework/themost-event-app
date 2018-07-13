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
        if (typeof event.target.eventHoursSpecification === 'undefined' || event.target.eventHoursSpecification === null) {
            return callback();
        }
        let eventHoursSpecification = event.model.context.model('EventHoursSpecification').convert(event.target.eventHoursSpecification);
        if (eventHoursSpecification) {
            //generate events
            let cronjob = eventHoursSpecification.toCronJobString();
            //get intervals
            let options = {
                currentDate: eventHoursSpecification.validFrom,
                endDate: eventHoursSpecification.validThrough,
                iterator: true
            };
            let interval = parseExpression(cronjob, options);
            let intervals = [];
            while (interval) {
                try {
                    let obj = interval.next();
                    intervals.push(obj.value);
                } catch (err) {
                    break;
                }
            }
            console.log('INFO', JSON.stringify(intervals.map((x)=> {
                return x.toDate();
            }), null, 4));
            let events = intervals.map((x)=> {
                return {
                    startDate: x.toDate(),
                    endDate: moment(x.toDate()).add(moment.duration(eventHoursSpecification.duration)).toDate(),
                    duration: eventHoursSpecification.duration,
                    contributor: event.target.contributor,
                    performer: event.target.performer,
                    audience: event.target.audience,
                    remainingAttendeeCapacity: event.target.remainingAttendeeCapacity,
                    maximumAttendeeCapacity: event.target.maximumAttendeeCapacity,
                    organizer: event.target.organizer,
                    superEvent: event.target.id,
                    location: event.target.location
                }
            });
            return event.model.context.model(event.target.additionalType).silent().save(events).then(()=> {
                return callback();
            });
        }
        return callback();
    }
    return callback();
}