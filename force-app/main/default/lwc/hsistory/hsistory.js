import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import PROJECT_OBJECT from '@salesforce/schema/K1_PLM__Project__c';
import NAME from '@salesforce/schema/K1_PLM__Project__c.Name';

const PROJ_FIELDS = [NAME];

export default class Hsistory extends LightningElement {


    isModalOpen = false;
   
    @api recordId;
    name;
    @wire(getObjectInfo, { objectApiName: PROJECT_OBJECT })
    projectAPI;
    @wire(getRecord, { recordId: '$recordId', fields: PROJ_FIELDS })
          wiredRecord(result) {
              let data = result.data;
              if (data) {
                this.name = getFieldValue(data, NAME);
                this.totaltask = getFieldValue(data, TOTALTASK);  
                this.delayedtask= getFieldValue(data, DELAYEDTASK);
                this.completedtask= getFieldValue(data, COMPLETEDTASK);
                // this.tempname = this.name;
                // this.temptotaltask = this.totaltask;
                // this.tempdelayed = this.delayedtask;
                // this.tempcompleted = this.completedtask;
    
              
              }
            }
            isModalOpen = false;
            openModal() {
               // to open modal set isModalOpen tarck value as true
              this.isModalOpen = true;
            }
            closeModal() {
                this.isModalOpen = false;
                // this.name=null;
                //           this.enddate=null;
                //         this.strtDate=null;
            }
          }