const app = require('../dist/server/server');

const SEED_DATA = [
    {
        "model": "Audience",
        "input": require('./Audience')
    },
    {
        "model": "Person",
        "input": require('./Person')
    },
    {
        "model": "EventHoursSpecification",
        "input": require('./EventHoursSpecification')
    },
    {
        "model": "Event",
        "input": require('./Event')
    }
];

async function seed(context) {
    for (let i = 0; i < SEED_DATA.length; i++) {
        const value = SEED_DATA[i];
        await context.model(value.model).silent().save(value.input);
    }
}

app.execute(context => {
    seed(context).then(() => {
        // eslint-disable-next-line no-console
        console.log('INFO', 'The operation was completed successfully.');
        process.exit(0);
    }).catch( err => {
        // eslint-disable-next-line no-console
        console.log('ERROR', 'An error occurred while updating data.');
        // eslint-disable-next-line no-console
        console.log('ERROR', err);
        process.exit(1);
    })
});
