import { LightningElement, wire,api, track } from 'lwc';
import fetchTaskRecord from '@salesforce/apex/deletemilestone.fetchTaskRecord';
import deleteMultipleTaskRecord from '@salesforce/apex/deletemilestone.deleteMultipleTaskRecord';
import { refreshApex } from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class TaskDelFun extends LightningElement {
    @api  columns =[
        { label: 'Task Name', fieldName: 'Name', type:'text'},
        { label: 'Status', fieldName: 'K1_PLM__Status__c',type:'picklist' },
        { label: 'End Date', fieldName: 'K1_PLM__End_Date__c',type:'date' }
       
       

    ];
 
        
    @wire (fetchTaskRecord) wiretask;
 
    @api selectedTaskIdList=[];
    @track errorMsg;
 
 
    getSelectedIdAction(event){
   
        const selectedTaskRows = event.detail.selectedRows;
        window.console.log('selectedTaskRowss# ' + JSON.stringify(selectedTaskRows));
        this.selectedTaskRows=[];
      
        for (let i = 0; i<selectedTaskRows.length; i++){
            this.selectedTaskIdList.push(selectedTaskRows[i].Id);
        }
 
    }
    deleteTaskRowAction(){
        deleteMultipleTaskRecord({taskObj:this.selectedTaskIdList})
        .then(()=>{
            this.template.querySelector('lightning-datatable').selectedTaskRows=[];
 
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record deleted successfully',
                variant:'success'
              });
              this.dispatchEvent(toastEvent);
 
            return refreshApex(this.wiretask);
        })
        .catch(error =>{
            this.errorMsg =error;
            window.console.log('unable to delete the record due to ' + JSON.stringify(this.errorMsg));
        });
    }
 
}