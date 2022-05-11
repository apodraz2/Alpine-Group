import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/FilterComponent__c';

import PRODUCT_FAMILY from '@salesforce/schema/Product2.Family';

export default class FilterComponent extends LightningElement {
    


}