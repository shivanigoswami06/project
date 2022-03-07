import { LightningElement,api,wire,track } from 'lwc';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { NavigationMixin } from 'lightning/navigation';
import PROJECT_OBJECT from '@salesforce/schema/K1_PLM__Project__c';
import NAME from '@salesforce/schema/K1_PLM__Project__c.Name';
import TOTALTASK from '@salesforce/schema/K1_PLM__Project__c.K1_PLM__Total_tasks__c';  
import DELAYEDTASK from '@salesforce/schema/K1_PLM__Project__c.Delayed_Task__c';
import COMPLETEDTASK from '@salesforce/schema/K1_PLM__Project__c.Completed_Task__c';
import CONSUMEDCOST from '@salesforce/schema/K1_PLM__Project__c.Consumed_Cost__c';
import CREATEDDATE from '@salesforce/schema/K1_PLM__Project__c.Created_Date__c';
import PROJECTMANAGER from '@salesforce/schema/K1_PLM__Project__c.Project_Manager__c';
import TOTALMEMBERS from '@salesforce/schema/K1_PLM__Project__c.Total_Members__c';


const PROJ_FIELDS = [NAME,TOTALTASK,DELAYEDTASK,COMPLETEDTASK,CONSUMEDCOST,CREATEDDATE,PROJECTMANAGER,TOTALMEMBERS];

export default class ProjectHeader extends NavigationMixin(LightningElement) {

  @api recordId;
  name;
  totaltask;
  delayedtask;
  completedtask;
  consumedcost;
  createddate;
  projectmanager;
  totalmembers;
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
            this.consumedcost= getFieldValue(data, CONSUMEDCOST);
            this.createddate= getFieldValue(data, CREATEDDATE);
            this.projectmanager= getFieldValue(data, PROJECTMANAGER);
            this.totalmembers= getFieldValue(data, TOTALMEMBERS);
            // this.tempname = this.name;
            // this.temptotaltask = this.totaltask;
            // this.tempdelayed = this.delayedtask;
            // this.tempcompleted = this.completedtask;

          
          }
        }
      

}