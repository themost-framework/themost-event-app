import {HttpApplication} from '@themost/web/app';
import path from 'path';

describe('test split event', ()=> {
   
   /**
     * @type HttpContext
     */
    let context;
    before((done)=> {
        //initialize app
        console.log('INFO', 'Initializing application', path.resolve(__dirname, ".."));
        let app = new HttpApplication(path.resolve(__dirname, ".."));
        app.execute((newContext)=> {
            context = newContext;
            return done();
        });
    });

    after((done)=> {
        context.finalize(()=> {
            return done();
        });
    });
   /*
   it('should add person availability', (done)=> {
       context.model('Person').where('email').equal('christian.lambert@example.com').silent().getItem().then((teacher)=> {
            console.log('INFO', 'Person',teacher);
           return context.model('EventHoursSpecification').where('name').equal('GL1-1st hour').silent().getItem().then((eventHoursSpecification)=> {
                     console.log('INFO', 'EventHoursSpecification',eventHoursSpecification);
                     return context.model('PersonAvailability').silent().save({
                         person: teacher,
                         eventHoursSpecification: eventHoursSpecification
                     }).then(()=> {
                        return done(); 
                     });
           });
           
       }).catch((err)=> {
           return done(err);
       });
   });
   */
   it('should add super appointment', (done)=> {
       context.model('PersonAvailability').where('person/jobTitle').equal('Lecturer')
       .expand('eventHoursSpecification')
       .silent().getItems().then((res)=> {
            let appointments = res.map(x=> {
                return {
                        performer: x.person,
                        eventHoursSpecification: x.eventHoursSpecification,
                        maximumAttendeeCapacity:1,
                        eventStatus: {
                            "alternateName": "EventOpened"
                        }
                    };
            });
            return context.model('Appointment').silent().save(appointments).then(()=> {
                console.log('INFO', 'Appointments',appointments);
                return done();
            });
       }).catch((err)=> {
           return done(err);
       });
   });
    
});