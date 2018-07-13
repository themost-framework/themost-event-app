import {EdmMapping,EdmType} from '@themost/data/odata';
import StructuredValue = require('./structured-value-model');

declare class Duration extends String {

}

/**
 * @class
 */
declare class EventHoursSpecification extends StructuredValue {

     
     /**
      * @description The date when the item becomes valid.
      */
     public validFrom?: Date; 
     
     /**
      * @description The date after when the item is not valid. For example the end of an offer, salary period, or a period of opening hours.
      */
     public validThrough?: Date; 
     
     /**
      * @description The opening hour of the place or service on the given day(s) of the week.
      */
     public opens?: Duration; 
     
     /**
      * @description The duration of the item (movie, audio recording, event, etc.) in <a href="http://en.wikipedia.org/wiki/ISO_8601">ISO 8601 date format</a>.
      */
     public duration?: Duration;
     
     /**
      * @description The closing hour of the place or service on the given day(s) of the week.
      */
     public closes?: Duration; 
     
     public minuteOfHour?: string; 
     
     public hourOfDay?: string; 
     
     public dayOfMonth?: string; 
     
     public monthOfYear?: string; 
     
     /**
      * @description The day of the week for which these opening hours are valid.
      */
     public dayOfWeek?: string; 
     
     /**
      * @description The identifier of the item.
      */
     public id?: number;

    toCronJobString(): string;

}

export = EventHoursSpecification;