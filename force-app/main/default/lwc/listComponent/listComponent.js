import { LightningElement, api, wire } from 'lwc';

import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/FilterComponent__c';

import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ListComponent extends LightningElement {

    filters = {};

    @wire(MessageContext) messageContext;

    productFilterSubscription;

    @wire(getProducts, { filters: '$filters', pageNumber: '$pageNumber' })
    products;

    connectedCallback() {
        // Subscribe to ProductsFiltered message
        this.productFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

}