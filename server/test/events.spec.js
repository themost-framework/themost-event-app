import {assert} from 'chai';
import app from '../server';
/**
 * Executes DataAdapter.executeInTransaction() method for testing environments 
 * and auto cancels a successfully executed transaction
 */ 
function testExecuteInTransaction(context, func) {
        return new Promise((resolve, reject) => {
            // start transaction
            context.db.executeInTransaction((cb) => {
                try {
                    func().then(() => {
                        const err = new Error('Cancel test transaction');
                        err.code = 'ERR_CANCEL_TRANSACTION';
                        return cb(err);
                    }).catch( err => {
                        return cb(err);
                    });
                }
                catch (err) {
                    return cb(err);
                }

            }, err => {
                // if error code is ERR_CANCEL_TRANSACTION
                if (err && err.code === 'ERR_CANCEL_TRANSACTION') {
                    return resolve();
                }
                if (err) {
                    return reject(err);
                }
                // exit
                return resolve();
            });
        });
    }

describe('test events in application sandbox', () => {
  /**
   * @type HttpContext
   */ 
  let context;
  // use before test event to create a new context
  before((done)=> {
    app.execute((newContext)=> {
      // set context
      context = newContext;
      // and exit 
      return done();
    });
  });
  // use after test event to destroy context
  after((done) => {
    if (context == null) {
      // do nothing and exit
    }
    // otherwise finalize context
    context.finalize(()=> {
      return done();
    });
  });
  it('should get events', async () => {
    // get events
    const events = await context.model('Event').asQueryable().getItems();
    // validate result
    assert.isArray(events);
    assert.isAbove(events.length, 0);
  });
  it('should query events', async () => {
    // get events with status opened
    const events = await context.model('Event')
                        .where('eventStatus/alternateName').equal('EventOpened')
                        .getItems();
    // validate result
    assert.isArray(events);
    assert.isAbove(events.length, 0);
  });
  it('should use paging while getting events', async () => {
    // get events and apply paging parameters
    const events = await context.model('Event')
                        .asQueryable()
                        .orderByDescending('startDate')
                        .take(5)
                        .getItems();
    // validate result
    assert.isArray(events);
    assert.equal(events.length, 5);
  });
  it('should get event hours specification', async () => {
    // get event hours specifications
    const eventHoursSpecifications = await context.model('EventHoursSpecification')
                                              .asQueryable().getItems();
    // validate result
    assert.isArray(eventHoursSpecifications);
    assert.isAbove(eventHoursSpecifications.length, 0);
  });
  it('should save event hours specification', async () => {
    // set context user as admin
    context.user = {
      name: 'peter.rees@example.com',
      authenticationType: 'basic'
    };
    // set new itens
    const item = {
        "name": "Tue 3rd hour",
        "validFrom": new Date("2018-09-01 00:00:00"),
        "validThrough": new Date("2018-09-30 00:00:00"),
        "duration": "PT45M",
        "minuteOfHour": "15",
        "hourOfDay": "10",
        "dayOfWeek": "2"
      };
      // executes in test transaction
      await testExecuteInTransaction(context, async() => {
        // save new item
        await context.model('EventHoursSpecification').save(item);
        // validate id
        assert.isNumber(item.id);
        // get item again
        const eventHoursSpecication = await context.model('EventHoursSpecification').where('name').equal('Tue 3rd hour').getItem();
        // validate object
        assert.isObject(eventHoursSpecication);
        assert.equal(item.id, eventHoursSpecication.id);
      });
  });
});