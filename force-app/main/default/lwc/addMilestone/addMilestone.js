
import { LightningElement, api, track, wire } from "lwc";
import {  ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue} from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import MILESTONE_OBJECT from "@salesforce/schema/K1_PLM__Milestone__c";
import NAME_FIELD from '@salesforce/schema/K1_PLM__Milestone__c.Name';
import END_DATE_FIELD  from '@salesforce/schema/K1_PLM__Milestone__c.K1_PLM__End_Date__c';
import START_DATE_FIELD from '@salesforce/schema/K1_PLM__Milestone__c.K1_PLM__Start_Date__c';
import PRO_FIELD from "@salesforce/schema/K1_PLM__Project__c.Name";
import MILESTONE_PRO__FIELD from "@salesforce/schema/K1_PLM__Milestone__c.K1_PLM__Project__c";
const Project_FIELDS = [PRO_FIELD];
export default class ADDMILESTONE extends NavigationMixin(LightningElement)
{
  milestoneIdForNavigation;
//   @api accId;
  projectName; 
  refreshMilestone;
  refreshProject;
name;
milestoneId;   
enddate = "";
strtDate = "";
@track check=true;
@api recordId;
@wire(getRecord, { recordId: '$recordId', fields: Project_FIELDS })
 projectResult({ data, error }) {
     if(data){
        this.projectName = getFieldValue(data, PRO_FIELD);
        console.log(this.projectName);
     }
  if(error){
    console.log(error);
   }
 }     
addName(event){
    this.name = event.target.value; 
    
}
changeDate(event) {
    this.enddate = event.target.value;
}
changestrtDate(event) {
  this.strtDate = event.target.value;
}
      createMilestone() {
        const fields = {};
        fields[MILESTONE_PRO__FIELD.fieldApiName] = this.recordId;
    // fields[PRO_FIELD.fieldApiName] = this.proId;
    fields[NAME_FIELD.fieldApiName] = this.name;
    fields[END_DATE_FIELD.fieldApiName] = this.enddate;
       fields[START_DATE_FIELD.fieldApiName] = this.strtDate;
       const milestoneRecord = { apiName:MILESTONE_OBJECT.objectApiName, fields };
        console.log('fields' +JSON.stringify(fields));     
        createRecord(milestoneRecord)
          .then((milestone) => {
            console.log("milestone saved");
            this.milestoneId = milestone.id;
            console.log('Milestone Id for Navigation 1 '+this.milestoneId);    
            // this.milestoneIdForNavigation =  milestone.id;
            // console.log('Milestone Id for Navigation 1 '+this.milestoneIdForNavigation);         
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Success!!",
                message: "Milestone Created Successfully!!",
                variant: "success"
              })
            );                      
        if(this.check){ 
          this.isModalOpen=false;
           this[NavigationMixin.Navigate]({
             type: 'standard__recordPage',
             attributes: {
                recordId: this.milestoneId , 
                //  recordId: this.milestoneIdForNavigation ,
                 objectApiName: 'K1_PLM__Milestone__c',               
                 actionName: 'view'
             }
           });   
         }                               
          this.handleReset();           
         })     
        .catch(error => {
       this.dispatchEvent(
           new ShowToastEvent({
               title: 'Error creating record',
               message: error.body.message,
               variant: 'error',
           }),
       );
       console.log("Error " +JSON.stringify(error));
   });
}


saveClick(event){
    if (this.checkError())  {
       this.createMilestone();
    }
  }
  checkError(){
    var valid = true;
    var inputs = this.template.querySelectorAll(".requiredfield");
    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        input.reportValidity();       
        valid = false;
      }
    
    });
    return valid;
    }
    handleReset(event) {
        const inputfields = this.template.querySelectorAll(".resetfields");
        if (inputfields) {
          inputfields.forEach((field) => {
            field.value=" ";
          });
                  this.name=null;
                  this.enddate=null;
                this.strtDate=null;
        }
    }

    isModalOpen = false;
    openModal() {
       // to open modal set isModalOpen tarck value as true
      this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
        this.name=null;
                  this.enddate=null;
                this.strtDate=null;
    }

}
