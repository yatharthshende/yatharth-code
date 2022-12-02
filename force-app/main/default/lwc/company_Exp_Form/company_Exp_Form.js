import { api, LightningElement, track } from 'lwc';
/* import ComapanyInfo from '@salesforce/apex/company_details.ComapanyInfo'; */
import Currently_Working_Here from '@salesforce/schema/Company_Details__c.Currently_Working_Here__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
export default class Company_Exp_Form extends LightningElement {
    @track comapnyname;
    @track fromdate;
    @track todate;
    @track currentlyworkinghere = false;
    @track visible1 = true;
    @track visible2 = true;
    @track cw = Currently_Working_Here;


    keyIndex = 0;
    @track itemList = [
        {
            id: 0
        }
    ];

    handelcomapnyname(event) {
        this.comapnyname = event.detail.value;
    }

    handelfromdate(event) {
        this.fromdate = event.detail.value;
    }

    handeltodate(event) {
        this.todate = event.detail.value;
        if (this.todate = !null) {
            this.visible1 = true;
            this.visible2 = false;
        }
        else if (this.todate = null) {
            this.visible2 = true;
            this.visible1 = false;
        }
        else {
            this.visible1 = true;
            this.visible2 = true;
        }

    }



    handelcurrentlyworkinghere(event) {
        console.log('on click = ' + event.target.checked);
        console.log('cw' ,this.cw);
        console.log('field' ,Currently_Working_Here);

        this.currentlyworkinghere = event.target.checked;
        /* this.visible2 = true; */
        /* this.visible1 = false; */

        if (event.target.checked) {
            this.visible1 = false;
            
            
        } else {
            this.visible1 = true;
        }

        /* console.log('on click' + this.currentlyworkinghere); */
    }

    addRow() {
        ++this.keyIndex;
        var newItem = [{ id: this.keyIndex }];
        this.itemList = this.itemList.concat(newItem);
    }

    removeRow(event) {
        if (this.itemList.length >= 2) {
            this.itemList = this.itemList.filter(function (element) {
                return parseInt(element.id) !== parseInt(event.target.accessKey);
            });
        }
    }


    handlesuccess(event) {

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Company Details Successfully created',
                variant: 'success',
            }),
        );


    }

    @api handleClick(candidateId) {

        var isVal = true;
        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            isVal = isVal && element.reportValidity();
        });
        if (isVal) {

            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );
            if (inputFields) {
                inputFields.forEach(field => {
                    console.log('data');
                    if (field.name === "candidate") {
                        field.value = candidateId;
                    }
                });
            }

            this.template.querySelectorAll('lightning-record-edit-form').forEach(element => {
                element.submit();

                return refreshApex(this.element);
            });

        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Please enter all the required fields',
                    variant: 'error',
                }),
            );
        }
    }

}