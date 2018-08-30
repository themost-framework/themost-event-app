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
    let context = event.model.context;
    //get original data
    return event.model
        .where('id').equal(event.target.id)
        .select('superEvent','eventStatus/alternateName as eventStatus')
        .silent()
        .getItem().then((item)=> {
            if (item && item.superEvent && item.eventStatus === 'EventScheduled') {
                //check child events' status
                return context.model('Appointment').where('superEvent').equal(item.superEvent)
                    .and('eventStatus/alternateName').equal('EventOpened')
                    .silent()
                    .count()
                    .then((count)=> {
                        if (count===0) {
                            //update super event status to scheduled
                            return context.model('Appointment').save({
                                id: item.superEvent,
                                eventStatus: {
                                    alternateName: 'EventScheduled'
                                }
                            }).then(()=> {
                               return callback(); 
                            });
                        }
                        //else do nothing
                        return callback();
                    }).catch((err)=> {
                        return callback(err);
                    });
            }
            return callback();
        }).catch((err)=> {
            return callback(err);
        });
}