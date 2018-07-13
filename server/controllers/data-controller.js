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
            if (typeof thisModel === 'undefined') {
                return Promise.reject(new HttpNotFoundError());
            }
            return this.view({
                name:thisModel.name,
                title:thisModel.title,
                version: thisModel.version,
                attributes: thisModel.attributes
            });
        }
        catch(err) {
            return Promise.reject(err);
        }

    }

}