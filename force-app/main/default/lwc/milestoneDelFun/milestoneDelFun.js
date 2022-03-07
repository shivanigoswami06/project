import { LightningElement, wire,api, track } from 'lwc';
import fetchMilestoneRecord from '@salesforce/apex/deletemilestone.fetchMilestoneRecord';
import deleteMultipleMilestoneRecord from '@salesforce/apex/deletemilestone.deleteMultipleMilestoneRecord';
import { refreshApex } from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class MilestoneDelFun extends LightningElement {
    @api  columns =[
        { label: 'Milestone Name', fieldName: 'Name', type:'text'},
        { label: 'Status', fieldName: 'K1_PLM__Status__c',type:'picklist' },
        { label: 'End Date', fieldName: 'K1_PLM__End_Date__c',type:'date' },
        { label: 'Start Date', fieldName: 'K1_PLM__Start_Date__c',type:'date' }
       

    ];
 
        
    @wire (fetchMilestoneRecord) wireMilestone;
 
    @api selectedMilestoneIdList=[];
    @track errorMsg;
 
 
    getSelectedIdAction(event){
   
        const selectedMilestoneRows = event.detail.selectedRows;
        window.console.log('selectedMilestoneRows# ' + JSON.stringify(selectedMilestoneRows));
        this.selectedMilestoneRows=[];
      
        for (let i = 0; i<selectedMilestoneRows.length; i++){
            this.selectedMilestoneIdList.push(selectedMilestoneRows[i].Id);
        }
 
    }
    deleteMilestoneRowAction(){
        deleteMultipleMilestoneRecord({mileObj:this.selectedMilestoneIdList})
        .then(()=>{
            this.template.querySelector('lightning-datatable').selectedMilestoneRows=[];
 
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record deleted successfully',
                variant:'success'
              });
              this.dispatchEvent(toastEvent);
 
            return refreshApex(this.wireMilestone);
        })
        .catch(error =>{
            this.errorMsg =error;
            window.console.log('unable to delete the record due to ' + JSON.stringify(this.errorMsg));
        });
    }
 
}