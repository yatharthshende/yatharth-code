import { LightningElement, wire, track, api } from 'lwc';

// Importing Apex Class Method
import createCandidate from '@salesforce/apex/candidateController.createCandidate';
import sendOTP from '@salesforce/apex/candidateController.sendOTP';
import createQualificationRecord from '@salesforce/apex/candidateController.createQualificationRecord';

// importing static resource from org
import team6StaticResource from '@salesforce/resourceUrl/team6StaticResource';

// PICKLIST FIELD REQUIREMENTS
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import QUALIFICATION_OBJECT from '@salesforce/schema/Qualification__c';

import SELECTQUALIFICATION_FIELD from '@salesforce/schema/Qualification__c.Qualification__c';

// Import Upload File
import uploadFile from '@salesforce/apex/candidateController.uploadFile';

// Importing to show Toast Notifications
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class candidateTask extends LightningElement {

    //<<-------------------------------------------------------------------------------------------->>
    @api recordId;
    @track error;
    @api candidateId;

    @track qualificationId;
    @track value;
    EmailToAddress;
    SentOtp = false;
    VerfiedOtp;
    messageOtp;

    otpvalueData = null;
    otpValue = null;











    @track lstAllFiles = [];


    // FOR QUALIFICATION
    @track qualList = [{
        selectqualification: '',
        fileData: '',
        filenameShivang: '',
        yearOfpassing: '',
        percentage: null,
        key: ''
    }];
    @track index = 0;
    @api qualRecordId;
    isLoaded = false;
    get acceptedFormats() {
        return ['.pdf', '.png', '.jpg'];
    }

    //<<-------------------------------------------------------------------------------------------->>

    // Candidate object has record Information
    @track getCandidateRecord = {
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Pan: '',
        Phone: '',
        Email: '',
        Address: ''

    }

    //input field for qualification using api 
    @api qual = {
        selectqualification: '',
        fileData: '',
        filenameShivang: '',
        yearOfpassing: '',
        percentage: null,
        key: ''
    }


    // PICKLIST FIELD SELECT QUALIFICATION

    @wire(getObjectInfo, { objectApiName: QUALIFICATION_OBJECT })

    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: SELECTQUALIFICATION_FIELD })

    SelectqualPicklistValues;









    //<<-------------------------------------------------------------------------------------------->>

    // ADD ROW BUTTON WORK

    addRow() {

        this.index++;
        var i = this.index;
        this.qual.key = i;

        this.qualList.push(JSON.parse(JSON.stringify(this.qual)));

    }

    // REMOVE ROW

    removeRow(event) {
        this.isLoaded = true;
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        if (this.qualList.length > 1) {
            this.qualList.splice(key, 1);
            this.index--;
            this.isLoaded = false;
        } else if (this.qualList.length == 1) {
            this.qualList = [];
            this.index = 0;
            this.isLoaded = false;
        }
    }

    //<<-------------------------------------------------------------------------------------------->>



    //<<-------------------------------------------------------------------------------------------->>
    // Putting the values with the help of OnChange Methods - Candidate

    handleFirstNameChange(event) {
        this.getCandidateRecord.FirstName = event.target.value;
        console.log('First Name ==> ' + this.getCandidateRecord.FirstName);
        /* this.siddharttask = event.target.value;
        console.log('Sidtask ==> ' + this.siddharttask); */
    }

    handleMiddleNameChange(event) {
        this.getCandidateRecord.MiddleName = event.target.value;
        console.log('Middle Name ==> ' + this.getCandidateRecord.MiddleName);
    }

    handleLastNameChange(event) {
        this.getCandidateRecord.LastName = event.target.value;
        console.log('Last Name ==> ' + this.getCandidateRecord.LastName);
    }

    handlePanChange(event) {
        this.getCandidateRecord.Pan = event.target.value;
        console.log('Pan Number ==> ' + this.getCandidateRecord.Pan);

    }

    handlePhoneChange(event) {
        this.getCandidateRecord.Phone = event.target.value;
        console.log('Phone ==> ' + this.getCandidateRecord.Phone);
    }

    handleEmailChange(event) {

        this.getCandidateRecord.Email = event.target.value;
        this.EmailToAddress = event.target.value;

        console.log('Email ==> ' + this.getCandidateRecord.Email);
    }

    handleAddressChange(event) {
        this.getCandidateRecord.Address = event.target.value;
        console.log('Address ==> ' + this.getCandidateRecord.Address);
    }

    handleOtpChange(event) {
        this.otpValue = event.target.value;
        console.log('Writing OTP ==> ' + this.otpValue);

    }

    //<<-------------------------------------------------------------------------------------------->>

    // Putting the values with the help of OnChange Methods ----- NEW QUALIFICATION WITH JS


    handleQualificationChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].selectqualification = event.detail.value;

    }


    handleYearOfPassingChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].yearOfpassing = event.target.value;
        console.log('Year qualList year of passing= ' + this.qualList[key].yearOfpassing);
    }

    handlePercentageChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].percentage = event.target.value;
        console.log('Year qualList Percentage ==> ' + this.qualList[key].percentage);
    }

    // File Upload - Upload Button

    handleopenfileUpload(event) {
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;


        const file = event.target.files[0]

        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.qualList[key].fileData = {
                'filename': file.name,
                'base64': base64,
            }
            console.log(this.qualList.fileData.filename)
        }

        reader.readAsDataURL(file)
    }



    //BATCH 6 BEFORE SUBMIT


    SamplePDFURL = team6StaticResource;

    // variables related to checkbox
    ischecked = false;
    pdfVisible = false;

    // variables related to submit button 
    disableBtn = true;

    // onclick of check box, handleChange function renders the pdf and enables the submit button, vice-versa
    @api handleChange(event) {
        if (event.target.checked) {
            this.disableBtn = false;
        }
        else {
            this.disableBtn = true;
        }
    }

    handleAnchor() {
        this.pdfVisible = true;
    }



    //<<-------------------------------------------------------------------------------------------->>
    // SUBMIT BUTTON METHOD
    // SUBMIT BUTTON METHOD
    // SUBMIT BUTTON METHOD
    // SUBMIT BUTTON METHOD
    //<<-------------------------------------------------------------------------------------------->>

    async handleSaveShivang(event) {


        // VALIDATION FOR FIELDS 

        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
        if (allValid) {
            alert('All form entries look valid. Ready to submit!');
        } else {
            alert('Please update the invalid form entries and try again.');
        }

        // CANDIDATE METHOD CALLING

        await createCandidate({ FirstNamecls: this.getCandidateRecord.FirstName, MiddleNamecls: this.getCandidateRecord.MiddleName, LastNamecls: this.getCandidateRecord.LastName, Pancls: this.getCandidateRecord.Pan, Phonecls: this.getCandidateRecord.Phone, Emailcls: this.getCandidateRecord.Email, Addresscls: this.getCandidateRecord.Address })
            .then(result => {
                this.getCandidateRecord = {};
                this.candidateId = result.Id;

                window.console.log('Results ==> ' + result);

                // Show Success Message
                this.dispatchEvent(new ShowToastEvent({
                    tite: 'Success',
                    message: 'Record Created Successfully',
                    variant: 'success'

                }),);

                //QUALIFICATION METHOD

                createQualificationRecord({ quList: JSON.stringify(this.qualList), qualId: this.candidateId })
                    .then(result => {
                        this.qualList = [{
                            selectqualification: '',
                            fileData: '',
                            filenameShivang: '',
                            yearOfpassing: '',
                            percentage: null,
                            key: ''
                        }];

                    })
                    .catch(errorQ => {
                        this.error = errorQ.message;
                        console.error(errorQ);
                    });


                this.qualList.forEach(element => {
                    const { base64, filename, recordId } = element.fileData
                    uploadFile({ base64, filename, recordId: this.candidateId }).then(result => {

                        let title = `${filename} uploaded successfully!!`
                        this.toast(title)
                    }).then((result) => {
                        console.log('result: ', result);

                    }).catch((error) => {
                        console.log('Error: ', error);
                    })

                });


                // CALLING OTHERS SUBMIT BUTTONS


                this.template.querySelector('c-company_-exp_-form').handleClick(this.candidateId);

                this.template.querySelector('c-file-upload-chunk').uploadFiles();


            })
            .catch(errorM => {
                this.error = errorM.message;
                console.error(errorM);
            });










    }

    //<<-------------------------------------------------------------------------------------------->>

    // SUBMIT VERIFY PHONE METHOD

    handlePhoneVerify() {
        alert('Otp Sent');
    }

    //<<-------------------------------------------------------------------------------------------->>

    // SUBMIT VERIFY EMAIL METHOD

    handleEmailVerify() {

        sendOTP({ EmailField: this.EmailToAddress }).then(result => {

            this.otpvalueData = result;
            if (this.EmailToAddress != null) {
                this.SentOtp = true;

            }


        }).catch(error => {
            alert('Invalid Email . Please check . Thank You!!')
        })
    }

    // HANDLE OTP VERIFICATION

    handleOtpVerify() {
        if (this.otpvalueData === this.otpValue) {

            this.VerfiedOtp = true;

        }
        else {
            this.messageOtp = 'Incorrect OTP Check your Otp'

            this.VerfiedOtp = false;
        }
        //<<-------------------------------------------------------------------------------------------->>

    }


}