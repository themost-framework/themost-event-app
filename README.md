#### Event Management Api Server with MOST Web Framework Codename Blueshift

##### Installation

Clone git repository

    git clone https://github.com/themost-framework/themost-event-app.git
    
Install dependencies

    npm i
    
Serve app

    npm run serve
    
##### Specification

Event Management Api Server prototype uses a extended set of data models and serves several endpoints
for managing events. 

####### Features

Event management system prototype models have the following features:

* Manage events of any type (organize parent events)
* Organize event based on event organizers like organization, education organization etc
* Manage event status (e.g. cancel, postpone, schedule, re-schedule an event)
* Manage event performers, attendees and audiences
* Manage event locations
* Create event hours specification for recursive events
* Create and manage recursive events
* Manage person availability for performing or attending an event
