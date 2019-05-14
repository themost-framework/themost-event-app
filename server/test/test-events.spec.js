import request from 'supertest';
import {assert} from 'chai';
import _app from '../server';
// get application runtime
let app = _app.runtime();
describe('test events', () => {
  it('GET /api/events', (done) => {
    request(app)
      .get('/api/events')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('GET /api/events with query', (done) => {
    request(app)
      .get('/api/events')
      .query({
          $filter: 'eventStatus/alternateName eq \'EventOpened\''
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('GET /api/events with paging', (done) => {
    request(app)
      .get('/api/events')
      .query({
          $top: 5
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('GET /api/eventHoursSpecifications', (done) => {
    request(app)
      .get('/api/eventHoursSpecifications')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('POST /api/eventHoursSpecifications as admin', (done) => {
    request(app)
      .post('/api/eventHoursSpecifications')
      .auth('peter.rees@example.com', 'admin')
      .send({
        "name": "Tue 1st hour",
        "validFrom": "2018-09-01T00:00:00+03:00",
        "validThrough": "2018-09-30T00:00:00+03:00",
        "duration": "PT45M",
        "minuteOfHour": "15",
        "hourOfDay": "8",
        "dayOfWeek": "2",
        "identifier": "00000000-0000-0000-0002-000000000001"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500, done);
  });
});