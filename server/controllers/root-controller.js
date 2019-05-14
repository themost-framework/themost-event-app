
import HttpBaseController from '@themost/web/controllers/base';
import {httpController,httpGet,httpAction} from '@themost/web/decorators';
import {ODataModelBuilder} from '@themost/data';
@httpController()
class RootController extends HttpBaseController {
    
    constructor() {
        super();
    }
    
    @httpGet()
    @httpAction('index')
    getIndex() {
        return this.view();
    }
    
    @httpGet()
    @httpAction('entityTypes')
    async getEntityTypes() {
        const schema = await this.context.getApplication().getService(ODataModelBuilder).getEdm();
        return this.view(schema);
    }
    
    @httpGet()
    @httpAction('entityType')
    async getEntityType(name) {
        return this.view(this.context.model(name));
    }
}

module.exports = RootController;
