import { LightningElement, api } from 'lwc';

export default class ProductTile extends LightningElement {
    /** Whether the tile is draggable. */
    @api draggable;

    _product;
    /** Product__c to display. */
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.photo = value.Product_Photo__c;
        this.name = value.Name;
        this.product_price = value.Product_Price__c;
    }

    /** Product__c field values to display. */
    pictureUrl;
    name;
    msrp;

    handleClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: this.product.Id
        });
        this.dispatchEvent(selectedEvent);
    }

    handleDragStart(event) {
        event.dataTransfer.setData('product', JSON.stringify(this.product));
    }
}