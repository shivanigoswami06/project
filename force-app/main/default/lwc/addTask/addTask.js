import { LightningElement, api, track, wire } from "lwc";
import {  ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue} from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import TASK_OBJECT from "@salesforce/schema/K1_PLM__Task__c";
import NAME_FIELD from '@salesforce/schema/K1_PLM__Task__c.Name';
import MILE_FIELD from "@salesforce/schema/K1_PLM__Milestone__c.Name";
import TASK_MILE__FIELD from "@salesforce/schema/K1_PLM__Task__c.K1_PLM__Milestone__c";
const Milestone_FIELDS = [MILE_FIELD];
export default class AddTask extends NavigationMixin(LightningElement){
    name;  
    @track check=true;
    taskId;
    milestoneName;
    addName(event){
        this.name = event.target.value; 
        
    }
    @api recordId;
@wire(getRecord, { recordId: '$recordId', fields: Milestone_FIELDS })
 milestoneResult({ data, error }) {
     if(data){
        this.milestoneName = getFieldValue(data, MILE_FIELD);
        console.log(this.milestoneName);
     }
  if(error){
    console.log(error);
   }
 }     


    createTask() {
        const fields = {};
       fields[TASK_MILE__FIELD.fieldApiName] = this.recordId;
//    fields[MILE_FIELD.fieldApiName] = this.taskId;
    fields[NAME_FIELD.fieldApiName] = this.name;
    // fields[END_DATE_FIELD.fieldApiName] = this.enddate;
    //    fields[START_DATE_FIELD.fieldApiName] = this.strtDate;
       const taskRecord = { apiName:TASK_OBJECT.objectApiName, fields };
        console.log('fields' +JSON.stringify(fields));     
        createRecord(taskRecord)
          .then((task) => {
            console.log("task saved");
            this.taskId = task.id;
            this.taskIdForNavigation =task.id;
            console.log('Task Id for Navigation 1 '+this.taskIdForNavigation);         
            this.dispatchEvent(
              new ShowToastEvent({
                title: "Success!!",
                message: "tASK Created Successfully!!",
                variant: "success"
              })
            );                      
        if(this.check){ 
          this.isModalOpen=false;
           this[NavigationMixin.Navigate]({
             type: 'standard__recordPage',
             attributes: {
                 recordId: this.taskIdForNavigation ,
                 objectApiName: 'K1_PLM__Task__c',               
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
       this.createTask();
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
     // this.strtDate=null;
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
        }
    }


    isModalOpen = false;
    openModal() {
       // to open modal set isModalOpen tarck value as true
      this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
}

