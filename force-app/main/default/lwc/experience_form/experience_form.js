import { LightningElement, track,api } from 'lwc';
import getMethod from '@salesforce/apex/Experince.Experienceinfo';
export default class experience_form extends LightningElement {

    @track comName
    @track fromDate
    @track toDate
    @track currentlyWorking

    handleCompanyName(event)
    {
        this.comName = event.detail.value
    }

    handleFromDate(event)
    {
        this.fromDate = event.detail.value
    }

    handleToDate(event)
    {
        this.toDate = event.detail.value
    }

    handleCurrentlyworking(event)
    {
        this.currentlyWorking = event.detail.value
    }

    handleClick()
    {
        getMethod({
            companyName:this.comName, fromDate:this.fromDate, toDate:this.toDate, workingStatus:this.currentlyWorking
        })
        .then(result =>{
            console.log('success');
        })
        .catch(error =>{
            console.log('error')
        })
    }
}