import _ from 'lodash';
import HttpBaseController from '@themost/web/controllers/base';
import {httpController, httpGet, httpAction, httpParam, httpPost} from '@themost/web/decorators';
import DataController from "./data-controller";
import {HttpBadRequestError, HttpNotFoundError, HttpError} from "@themost/common";

@httpController()
export default class AppointmentController extends DataController {
    
    constructor() {
        super();
    }
    
}