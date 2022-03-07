import { LightningElement, wire,api, track } from 'lwc';
import fetchSubtaskRecord from '@salesforce/apex/deletemilestone.fetchSubtaskRecord';
import deleteMultipleSubTaskRecord from '@salesforce/apex/deletemilestone.deleteMultipleSubTaskRecord';
import { refreshApex } from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class SubTaskDelFun extends LightningElement {

  @api  columns =[
        { label: 'Task Name', fieldName: 'Name', type:'text'},
        { label: 'Status', fieldName: 'K1_PLM__Status__c',type:'picklist' },
        { label: 'End Date', fieldName: 'K1_PLM__End_Date__c',type:'date' },
        { label: 'Start Date', fieldName: 'K1_PLM__Date__c',type:'date' }
       
       

    ];
 
        
    @wire (fetchSubtaskRecord) wireSubTask;
 
    @api selectedSubTaskIdList=[];
    @track errorMsg;
 
 
    getSelectedIdAction(event){
   
        const selectedSubTaskRows = event.detail.selectedRows;
        window.console.log('selectedSubTaskRowss# ' + JSON.stringify(selectedSubTaskRows));
        this.selectedSubTaskRows=[];
      
        for (let i = 0; i<selectedSubTaskRows.length; i++){
            this.selectedSubTaskIdList.push(selectedSubTaskRows[i].Id);
        }
 
    }
    deleteSubTaskRowAction(){
        deleteMultipleSubTaskRecord({subtaskObj:this.selectedSubTaskIdList})
        .then(()=>{
            this.template.querySelector('lightning-datatable').selectedSubTaskRows=[];
 
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record deleted successfully',
                variant:'success'
              });
              this.dispatchEvent(toastEvent);
 
            return refreshApex(this.wireSubTask);
        })
        .catch(error =>{
            this.errorMsg =error;
            window.console.log('unable to delete the record due to ' + JSON.stringify(this.errorMsg));
        });
    }
 
}