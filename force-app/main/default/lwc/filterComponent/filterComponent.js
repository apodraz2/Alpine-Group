import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import { publish, MessageContext } from 'lightning/messageService';
import FILTER_COMPONENT_MESSAGE from '@salesforce/messageChannel/FilterComponent__c';

import FAMILY_FIELD from '@salesforce/schema/Product2.Family';

// The delay used when debouncing event handlers before firing the event
const DELAY = 150;

export default class FilterComponent extends LightningElement {
    
    searchKey = '';
    maxPrice = 250;

    filters = {
        searchKey: '',
        maxPrice: 250
    };

    @wire(MessageContext)
    messageContext;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: FAMILY_FIELD
    })
    families;

    handleSearchKeyChange(event) {
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
    }

    handleMaxPriceChange(event) {
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }

    handleCheckboxChange(event) {
        if (!this.filters.families) {
            // Lazy initialize filters with all values initially set
            this.filters.families = this.families.data.values.map(
                (item) => item.value
            );
            
        }
        
        const value = event.target.dataset.value;
        const filterArray = this.filters[event.target.dataset.filter];
        
        
        if (event.target.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
                
            }
        } else {
            this.filters[event.target.dataset.filter] = filterArray.filter(
                (item) => item !== value
            );
        }
        
        // Published ProductsFiltered message
        publish(this.messageContext, FILTER_COMPONENT_MESSAGE, {
            filters: this.filters
        });
    }

    delayedFireFilterChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // Published ProductsFiltered message
            publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);
    }

}