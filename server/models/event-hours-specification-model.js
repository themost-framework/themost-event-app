import {EdmMapping,EdmType} from '@themost/data/odata';
import {DataObject} from '@themost/data/data-object';
let StructuredValue = require('./structured-value-model');
/**
 * @class
 
 * @property {Date} validFrom
 * @property {Date} validThrough
 * @property {Duration} opens
 * @property {number} duration
 * @property {Duration} closes
 * @property {string} minuteOfHour
 * @property {string} hourOfDay
 * @property {string} dayOfMonth
 * @property {string} monthOfYear
 * @property {string} dayOfWeek
 * @property {number} id
 * @augments {DataObject}
 */
@EdmMapping.entityType('EventHoursSpecification')
class EventHoursSpecification extends StructuredValue {
    /**
     * @constructor
     */
    constructor() {
        super();
    }
    
    toCronJobString() {
        return (this.minuteOfHour || "*") + " " +
            (this.hourOfDay || "*") + " " +
            (this.dayOfMonth || "*") + " " +
            (this.monthOfYear || "*") + " " +
            (this.dayOfWeek || "*");
    }
    
}

module.exports = EventHoursSpecification;