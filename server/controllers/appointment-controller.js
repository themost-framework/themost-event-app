import HttpBaseController from '@themost/web/controllers/base';
import {httpController, httpGet, httpAction, httpParam, httpPost} from '@themost/web/decorators';
import DataController from "./data-controller";
import {HttpBadRequestError,HttpNotFoundError} from "@themost/common";

@httpController()
export default class AppointmentController extends DataController {
    
    constructor() {
        super();
    }

    @httpPost()
    @httpAction('attend')
    postAttend() {
        let context = this.context;
        //get data
         let data = context.params.data;

         return new Promise((resolve, reject)=> {
             if (typeof data === 'undefined' || data === null) {
                 return reject(new HttpBadRequestError())  ;
             }
             context.model('Appointment').where('id').equal(data.id).expand('attendees').getItem().then((appointment)=> {
                 if (typeof appointment === 'undefined' || appointment === null) {
                     return reject(new HttpNotFoundError())  ;
                 }
                 if (typeof appointment.eventHoursSpecification === 'undefined' || appointment.eventHoursSpecification === null) {
                     //get person
                     return context.model('Person').where('email').equal(context.user.name).silent().getItem().then((person)=> {
                         if (typeof person === 'undefined' || person === null) {
                             return reject(new HttpNotFoundError())  ;
                         }
                         //update appointment
                         appointment.attendees = appointment.attendees || [];
                         appointment.attendees.push(person);
                         appointment.eventStatus = {
                             alternateName: "EventScheduled"
                         };
                         appointment.remainingAttendeeCapacity = 0;
                         return context.model('Appointment').silent().save(appointment).then(()=> {
                             return resolve(appointment) ;
                         });
                     }).catch((err)=> {
                         return reject(err);
                     });
                 }
             }).catch((err)=> {
                 return reject(err);
             });
         });

    }
    
}