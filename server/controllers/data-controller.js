import HttpDataModelController from '@themost/web/controllers/model';
import {httpController,httpGet, httpAction} from '@themost/web/decorators';
import {HttpNotFoundError} from '@themost/common';

@httpController()
export default class DataController extends HttpDataModelController {
    
    constructor() {
        super();
    }

    @httpAction('schema')
    @httpGet()
    getSchema(model) {
        try {
            //get entity set
            //get entityType
            let thisModel = this.context.model(model);
            let context = this.context;
            if (typeof thisModel === 'undefined') {
                return Promise.reject(new HttpNotFoundError());
            }
            //get migrations
            return new Promise((resolve, reject)=> {
                return context.model('Migration').select('model').groupBy('model').silent().getAllItems().then((models)=> {
                    return resolve({
                        name:thisModel.name,
                        title:thisModel.title,
                        version: thisModel.version,
                        attributes: thisModel.attributes,
                        migrations: models
                    });
                }).catch((err)=> {
                    return reject(err);
                });
            });
            
            
        }
        catch(err) {
            return Promise.reject(err);
        }

    }

}