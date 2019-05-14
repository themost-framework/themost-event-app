#### Event Management Api Server with MOST Web Framework Codename Blueshift

##### Installation

Clone git repository

    git clone https://github.com/themost-framework/themost-event-app.git
    
Install dependencies

    npm i
    
Build app

    npm run build
    
Seed data

Add sample data by executing:

    npm run seed
    
and finally serve app:

    npm run serve
    
Open your browser and navigate to http://localhost:3000/

##### Specification

Event Management Api Server prototype is a typical [MOST Web Framework](https://github.com/themost-framework/themost) 
that exposes a wide set of endpoints under /api/. 
These endpoints follows [OData v4 specification](https://www.odata.org/documentation/) to get, insert, update or delete entities or entity sets. 

Some of them are:

Get available entity sets:

    GET http://localhost:3000/api/
    
Get entity set metadata:

    GET http://localhost:3000/api/$metadata
    
Get current user:

    GET http://localhost:3000/api/users/me
    
Get events:

    GET http://localhost:3000/api/events
    
Expand entities:

    GET http://localhost:3000/api/events?$expand=performers
    
Query events:

     GET http://localhost:3000/api/events?$filter=eventStatus/alternateName eq 'EventOpened'

and many others.

Event Management Api Server prototype uses [cron-job specification](https://cron-job.org/en/) for creating recursive events.
An EventHoursSpecification object is being converted to a cron-job like object which gives a set of auto generated events.

The following event hours specification object:

    {
        "name": "1st hour",
        "validFrom": "2018-09-01T00:00:00+03:00",
        "validThrough": "2018-09-30T00:00:00+03:00",
        "duration": "PT45M",
        "minuteOfHour": "15",
        "hourOfDay": "8",
        "dayOfWeek": "1",
        "identifier": "00000000-0000-0000-0000-000000000001"
    }

defines an event recurrence pattern which is equivalent with the following cron job:

    15 8 * * 1
    
This job will generate a set of sub-events for the defined period between 1-Sep 2018 to 30-Sep 2018.

    # POST /api/events
    
    {
        "eventHoursSpecification": {
            "identifier": "00000000-0000-0000-0000-000000000001"
        },
        "performer": {
            "email": "cassandra.stevenson@example.com"
        },
        "maximumAttendeeCapacity": 5
    }
    
e.g. 

    {
        "startDate": "2018-09-03 08:15:00.000+00:00",
        "endDate": "2018-09-03 09:00:00.000+00:00",
        "maximumAttendeeCapacity": 5,
        "eventStatus": {
            ...
        },
        "superEvent": 46,
        "duration": "PT45M",
        "performer": 12,
        "additionalType": "Event",
        "id": 47,
        "dateCreated": "2019-05-14 14:12:05.091+00:00",
        "dateModified": "2019-05-14 14:12:05.093+00:00",
        "createdBy": 0,
        "modifiedBy": 0
    },
    {
        "startDate": "2018-09-10 08:15:00.000+00:00",
        "endDate": "2018-09-10 09:00:00.000+00:00",
        "maximumAttendeeCapacity": 5,
        "eventStatus": {
            ...
        },
        "superEvent": 46,
        "duration": "PT45M",
        "performer": 12,
        "additionalType": "Event",
        "id": 48,
        "dateCreated": "2019-05-14 14:12:05.119+00:00",
        "dateModified": "2019-05-14 14:12:05.123+00:00",
        "createdBy": 0,
        "modifiedBy": 0
    }

Event Management Api Server prototype uses a extended set of data models and serves several endpoints
for managing events. 

###### Features

Event management system prototype models have the following features:

* Manage events of any type (organize parent events)
* Organize event based on event organizers like organization, education organization etc
* Manage event status (e.g. cancel, postpone, schedule, re-schedule an event)
* Manage event performers, attendees and audiences
* Manage event locations
* Create event hours specification for recursive events
* Create and manage recursive events
* Manage person availability for performing or attending an event
* Testing api services
