import { LightningElement, api, track, wire } from "lwc";
import {  ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, getFieldValue} from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';
import SUB_TASK_OBJECT from "@salesforce/schema/K1_PLM__Sub_task__c";
import NAME_FIELD from '@salesforce/schema/K1_PLM__Sub_task__c.Name';
import TASK_FIELD from "@salesforce/schema/K1_PLM__Task__c.Name";
import SUBTASK_TASK__FIELD from "@salesforce/schema/K1_PLM__Sub_task__c.K1_PLM__Task__c";
const Task_FIELDS = [TASK_FIELD];




export default class AddSubTask extends NavigationMixin(LightningElement){


    name;
    @track check=true;
    

    taskId;
    taskName;
    addName(event){
        this.name = event.target.value; 
        
    }
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: Task_FIELDS })
     taskResult({ data, error }) {
         if(data){
            this.taskName = getFieldValue(data, TASK_FIELD);
            console.log(this.taskName);
         }
      if(error){
        console.log(error);
       }
     }     
    
    createSubTask() {
        const fields = {};
       fields[SUBTASK_TASK__FIELD.fieldApiName] = this.recordId;
//    fields[MILE_FIELD.fieldApiName] = this.taskId;
    fields[NAME_FIELD.fieldApiName] = this.name;
    // fields[END_DATE_FIELD.fieldApiName] = this.enddate;
    //    fields[START_DATE_FIELD.fieldApiName] = this.strtDate;
       const subTaskRecord = { apiName:SUB_TASK_OBJECT.objectApiName, fields };
        console.log('fields' +JSON.stringify(fields));     
        createRecord(subTaskRecord)
          .then((subtask) => {
            console.log("task saved");
            this.subtaskId = subtask.id;
            this.subtaskIdForNavigation =subtask.id;
            console.log('Sub Task Id for Navigation 1 '+this.subtaskIdForNavigation);         
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
                 recordId: this.subtaskIdForNavigation ,
                 objectApiName: 'K1_PLM__Sub_task__c',               
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
       this.createSubTask();
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

