import { LightningElement, track } from 'lwc';
import saveRecord from '@salesforce/apex/Candidate_Qualification.saveQualification';
import CandidateInfo from '@salesforce/apex/Candidate_Qualification.CandidateInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const MAX_FILE_SIZE = 100000000; //10mb
export default class Registraion_page extends LightningElement {
    @track firstname;
    @track midelname;
    @track lastname;
    @track phone;
    @track email;
    @track pannumber;
    @track address;

    @track qualifiacation;
    @track passingyear;
    @track percentage;



    handelfirstname(event) {
        this.firstname = event.detail.value;
        //this.firstnamevar=this.firstname;
    }
    handelmidelname(event) {
        this.midelname = event.detail.value;
       // this.midelnamevar=this.midelname;
    }
    handellastname(event) {
        this.lastname = event.detail.value;
       // this.lastnamevar=this.lastname;
    }
    handelphone(event) {
        this.phone = event.detail.value;
       // this.phonevar=this.phone;
    }
    handelemail(event) {
        this.email = event.detail.value;
      //  this.emailvar=this.email;
    }
    handelpannumber(event) {
        this.pannumber = event.detail.value;
      //  this.pannumbervar=this.pannumber;
    }
    handeladdress(event) {
        this.address = event.detail.value;
      //  this.addressvar=this.address;
    }

    get qualifiacationOptions() {
        return [
                {label:	'10th',	value:	'10th' },
                {label:	'12th', value:	'12th'},
                {label:	'Graduation',	value:	'Graduation'	},
                {label:	'Postgraduation',	value:	'Postgraduation'	}
            ];
            }

            uploadedFiles = []; file; fileContents; fileReader; content; fileName
            
            handlequalifiacationChange(event) {  
                this.qualifiacation = event.detail.value;  
              }

              handelyearofpassing(event) {  
                this.passingyear = event.detail.value;  
              }

              handelpercentage(event) {  
                this.percentage = event.detail.value;  
              }

              onFileUpload(event) {  
                if (event.target.files.length > 0) {  
                  this.uploadedFiles = event.target.files;  
                  this.fileName = event.target.files[0].name;  
                  this.file = this.uploadedFiles[0];  
                  if (this.file.size > this.MAX_FILE_SIZE) {  
                    alert("File Size Can not exceed" + MAX_FILE_SIZE);  
                  }  
                }  
              }

    handleClick(){
        CandidateInfo({ 
        fname : this.firstname,
        mname : this.midelname,
        lname : this.lastname,
        email : this.email,
        phone : this.phone,
        pan :   this.pannumber,
        address :this.address
    })
.then(result =>{
   // alert('result ===> '+JSON.stringify(result));
})
    
    .catch(error =>{
        this.error = error.message;
        alert(JSON.stringify(error));
    })

      
  }

  qualificationhandleClick() {

    this.fileReader = new FileReader();  
    this.fileReader.onloadend = (() => {  
      this.fileContents = this.fileReader.result;  
      let base64 = 'base64,';  
      this.content = this.fileContents.indexOf(base64) + base64.length;  
      this.fileContents = this.fileContents.substring(this.content);  
      this.saveRecord();  
    });  
    this.fileReader.readAsDataURL(this.file);  
  }
saveRecord() {  
    var qal = {  
      'sobjectType': 'Qualification_Detail__c',  
      'Qualification__c': this.qualifiacation,  
      'Year_Of_Passing__c': this.passingyear,  
      'Percentage__c': this.percentage
    }  
    saveRecord({  
        qualificationRec: qal,  
      file: encodeURIComponent(this.fileContents),  
      fileName: this.fileName  
    })
.then(qalId => {  
    alert('qalId ===> '+JSON.stringify(qalId));
        if (qalId) {  
          this.dispatchEvent(  
            new ShowToastEvent({  
              title: 'Success',  
              variant: 'success',  
              message: 'Qualification Successfully created',  
            }),  
          ); 
        }  
      }).catch(error => {  
        console.log('error ', error);  
        this.error = error.message;
        alert(JSON.stringify(error));
      });

   }

}
