import { LightningElement, api, track, wire } from "lwc";
import projectList from "@salesforce/apex/projectoverview.getTreeData";
import searchAssignees from '@salesforce/apex/projectoverview.searchAssignee';
//import uploadFile from "@salesforce/apex/projectoverview.uploadFile";
import filleduser from "@salesforce/resourceUrl/filleduser";
import emptyuser from "@salesforce/resourceUrl/emptyuser";
import emptyfile from "@salesforce/resourceUrl/projectemptyfile";
import filledfile from "@salesforce/resourceUrl/projectfilledfile";
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
import TASK_OBJECT from "@salesforce/schema/K1_PLM__Task__c";
import NAMES_FIELD from '@salesforce/schema/K1_PLM__Task__c.Name';
import MILE_FIELD from "@salesforce/schema/K1_PLM__Milestone__c.Name";
import TASK_MILE__FIELD from "@salesforce/schema/K1_PLM__Task__c.K1_PLM__Milestone__c";
//import getCount from '@salesforce/apex/projectoverview.getCount';
import insertsubrow from '@salesforce/apex/projectoverview.insertsubrow';

//History imports
// import getHistoryTable from '@salesforce/apex/projectoverview.getHistoryTable';
// import hasHistoryTracking from '@salesforce/apex/projectoverview.hasHistoryTracking';
// import hassubtaskHistoryTracking from '@salesforce/apex/projectoverview.hassubtaskHistoryTracking';
// import usertaskassoHistoryTracking from '@salesforce/apex/projectoverview.usertaskassoHistoryTracking';
//  import TaskObj from '@salesforce/schema/Task__c';
//  import SubTaskObj from '@salesforce/schema/Sub_task__c';
//  import UserTaskObj from '@salesforce/schema/UserTaskAssociation__c';

// import NAME from '@salesforce/schema/Task__c.Name';
// import DESCRIPTION from '@salesforce/schema/Task__c.Description__c';
// import STATUS from '@salesforce/schema/Task__c.Status__c';
// import MILESTONE_ID from '@salesforce/schema/Task__c.Milestone__c';
// import DATE from '@salesforce/schema/Task__c.Date__c';
// import PREDECESSOR_TASK from '@salesforce/schema/Task__c.Predecessor_task__c';
// import END_DATE from '@salesforce/schema/Task__c.End_Date__c';
// //import LAST_MODIFIED_DATE from '@salesforce/schema/Task__c.LastModifiedDate';
// import TOTAL_WORKING_DAYS from '@salesforce/schema/Task__c.Total_Working_Days__c';

// import MILESTONE_NAME from '@salesforce/schema/Milestone__c.Name';
// import MILESTONE_DATE from '@salesforce/schema/Milestone__c.Start_Date__c';
// import MILESTONE_END_DATE from '@salesforce/schema/Milestone__c.End_Date__c';
// import PROJECT_FIELD from '@salesforce/schema/Milestone__c.Project__c';

import SUB_TASK_OBJECT from "@salesforce/schema/K1_PLM__Sub_task__c";
import SUBNAME_FIELD from '@salesforce/schema/K1_PLM__Sub_task__c.Name';
import TASK_FIELD from "@salesforce/schema/K1_PLM__Task__c.Name";
import SUBTASK_TASK__FIELD from "@salesforce/schema/K1_PLM__Sub_task__c.K1_PLM__Task__c";
const Task_FIELDS = [TASK_FIELD];
const Milestone_FIELDS = [MILE_FIELD];
const Project_FIELDS = [PRO_FIELD];


export default class Newprojectpage extends NavigationMixin(LightningElement){
 
  @track dateValue = "mileRecord.EndDisplay";


  InsertSubRowButton = true;
  InsertSubTaskButton = true;
    searchList;
     searchMsg = false;
     @track searchUser = false;
     searchKey;
     iconName = "utility:edit";
    uploadFileId;
    currentfileID;
    @track menuLevelItem = [];
   @track header = [];
    expandedlevel = 0; //this variable is used to store the duplicate value of level expanding
    levelCount = 0; 
    // this.RefreshCount=0;
    @api recordId; 
    // = 'a0T5f000006hcTYEAY';
    @track projectdata;
    searchKey = '';
    @wire(projectList, { currentprojectId: '$recordId', search: '$searchKey' })
    projectresult({ data, error }) {
        // this.RefreshCount=0;
        // this.RefreshTable=result;
        if (data) {
            this.projectdata = data;
            console.log('project data '+ JSON.stringify(this.projectdata));
        }
        if (error) {
            console.log('error ' +error);
        }
}
milestartdate;

milestoneStartDateChange(event) {
  this.milestartdate = event.target.value;
}

milestoneStartDateEdit(event) {
  //when user clicks on save
  // eslint-disable-next-line
  if (event.target.iconName == "utility:check") {
    event.target.iconName = "utility:edit";

    this.currentpmstartid = event.currentTarget.dataset.name;
    console.log(" this.currentpstartid " + this.currentpmstartid);
    let pmstartid = '[data-name="' + this.currentpmstartid + '"]';
    let pmstart = this.template.querySelector(pmstartid);
    pmstart.setAttribute(
      "style",
      "background-color: white; position: absolute; width: 85%; "
    );

    let id = event.target.value;
    console.log(this.mileSID);
    let startid = '[data-id="' + this.mileSID + '"]';

    // if(this.template.querySelector(startid).type == "date"){
    //   this.template.querySelector(startid).type = "text";
    // }
    // console.log("qSTART SAVE " + this.template.querySelector(startid).type);

    let start = this.template.querySelector(startid);

    console.log(start.value);
    console.log(startid);
    start.setAttribute("disabled", "disabled");
    start.setAttribute(
      "style",
      "border-style: none; width: 85%; resize: none;  background-color: transparent;"
    );

    M_START_DATE({
      MSID: id,
      mstartdate: start.value
    }).then(() => {
      refreshApex(this.RefreshMilestoneAndTask);
      getRecordNotifyChange(this.mileSID);
    });
  } else {
    event.target.iconName = "utility:check";

    this.currentpmstartid = event.currentTarget.dataset.name;
    console.log(" this.currentpstartid " + this.currentpmstartid);
    let pmstartid = '[data-name="' + this.currentpmstartid + '"]';
    let pmstart = this.template.querySelector(pmstartid);
    pmstart.setAttribute(
      "style",
      "background-color: white; position: absolute; color: white; z-index: -1; width: 85%;"
    );

    this.mileSID = event.currentTarget.dataset.id;
    let startid = '[data-id="' + this.mileSID + '"]';

    // if(this.template.querySelector(startid).type == "text"){
    //   this.template.querySelector(startid).type = "date";
    // }
    // console.log("qSTART EDIT " + this.template.querySelector(startid).type);

    let start = this.template.querySelector(startid);
    start.removeAttribute("disabled");
    start.setAttribute(
      "style",
      "border:0.02px; width: 85%; resize:none; border-style:none none dotted none; outline:none;"
    );
  }
}

  disabledForEditOption=true;
disableedit=false;
 rees;
 estimateEdit(event){
 if(event.target.iconName = "utility:check") {
    
    let mName = this.template.querySelector('[data-estimate="estimate"]');
    mName.removeAttribute("disabled");
    mName.setAttribute(
        "style",
        "border:1px;  resize:none; border-style:none none dotted none;  padding-left: 10px;outline:none; font-size: small; max-width:70%;"
    );
  }
}
  //  if (event.target.iconName == "utility:check") {
  //      event.target.iconName = "utility:edit";
  //      this.rees = event.currentTarget.dataset.strtDate;
  //      console.log('ress ' + this.rees );
  //      let mName = this.template.querySelector('[data-estimate="estimate"]');
  //      let milestoneUpdatedName = mName.value;
  //      console.log('estimate name' +milestoneUpdatedName);
  //      mName.setAttribute("disabled", "disabled");
  //      mName.setAttribute(
  //          "style",
  //          "border-style: none;  resize: none;  background-color: transparent;  padding-left: 10px; font-size: small; max-width:70%;"
  //      );
  //      if((this.estimateValue !=' ' && this.estimateValue != '')){
  //        this.estimateFilled = true;
  //       }
  //      //  else if(this.estimateValue ==' ' || this.estimateValue == null || this.estimateValue != ''){
  //      else{
  //        this.estimateFilled = false;
  //        this.disableSave = true;
  //       }
  //       if(this.estimateFilled & this.fileUploaded){
  //        this.disableSave = false;
  //       }
      
  // }

//   else {
//    event.target.iconName = "utility:check";
//    let mName = this.template.querySelector('[data-estimate="estimate"]');
//    mName.removeAttribute("disabled");
//    mName.setAttribute(
//        "style",
//        "border:1px;  resize:none; border-style:none none dotted none;  padding-left: 10px;outline:none; font-size: small; max-width:70%;"
//    );
//  }
// }

    emptyfile = emptyfile;
    filledfile = filledfile;
    filleduser = filleduser;
    emptyuser = emptyuser;
    deleteUsers = true;
   

//navigation to Management_Files page staring
navigateToManagement_FilesTab() {
  this[NavigationMixin.Navigate]({
      type: 'standard__navItemPage',
      attributes: {
         
          apiName: 'Management_Files'
      },
  });
}

//navigation to Teams page staring
navigateToTeamsTab() {
  this[NavigationMixin.Navigate]({
      type: 'standard__navItemPage',
      attributes: {
        
          apiName: 'Teams'
      },
  });
}


navigateToManagement_HisTab() {
  this[NavigationMixin.Navigate]({
      type: 'standard__navItemPage',
      attributes: {
         
          apiName: 'K1_PLM__Task__c'
      },
  });
}
        
//milestone popup functionality staring
 milestoneIdForNavigation;

   projectName; 
   refreshMilestone;
   refreshProject;
 name;
 milestoneId;
 enddate = "";
 strtDate = "";
 @track check=true;
//  @api recordId;
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


    //TASK popup staring

    name;  
    @track check=true;
    taskId;
    mileId;
    milestoneName;
    addName(event){
        this.name = event.target.value; 
        
    }
 
@wire(getRecord, { mileId: '$recordId', fields: Milestone_FIELDS })
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
       fields[TASK_MILE__FIELD.fieldApiName] = this.parentId;
//    fields[MILE_FIELD.fieldApiName] = this.taskId;
    fields[NAMES_FIELD.fieldApiName] = this.name;
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


saveClick1(event){
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


    isModalOpen1 = false;
    openModal1() {
      this.isModalOpen1 = true;
    }
    closeModal1() {
        this.isModalOpen1 = false;
    }


//SUB TASK popup staring

name;
    @track check=true;
    taskId;
    taskName;
    addName(event){
        this.name = event.target.value; 
        
    }
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
       fields[SUBTASK_TASK__FIELD.fieldApiName] = this.tasksId;
//    fields[MILE_FIELD.fieldApiName] = this.taskId;
    fields[SUBNAME_FIELD.fieldApiName] = this.name;
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
                message: "Sub Task Created Successfully!!",
                variant: "success"
              })
            );                      
        // if(this.check){ 
        //   this.isModalOpen=false;
        //    this[NavigationMixin.Navigate]({
        //      type: 'standard__recordPage',
        //      attributes: {
        //          recordId: this.subtaskIdForNavigation ,
        //          objectApiName: 'K1_PLM__Sub_task__c',               
        //          actionName: 'view'
        //      }
        //    });   
        //  }                               
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
saveClick2(event){
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

isModalOpen2 = false;
openModal2() {
   // to open modal set isModalOpen tarck value as true
  this.isModalOpen2 = true;
}
closeModal2() {
    this.isModalOpen2 = false;
}


//search functionality
     searchMsg = false;
     @wire(searchAssignees, {currentprojectId: '$recordId',searchKey: '$searchKey'})
searchAssignee({data,error}) {       
    if (data) {        
        this.searchList = data;    
        console.log("search "+this.searchList);  
        if(this.searchList != '' & this.searchKey != '') {
            this.searchUser = true;
            this.searchMsg = false;
        } else if(this.searchList == '' & this.searchKey != ''){
            this.searchMsg = true;
            this.searchUser = true;
        }else if(this.searchList == '' & this.searchKey == '') {
            this.searchUser = false;
            this.searchMsg = false;
        } 

        this.checkboxValue;
        this.error = undefined;
        // this.template.querySelectorAll('[data-id="' +this.selectedId+ '"]').forEach(each => {
        //     each.checked = true;
        //     console.log("each.checked search " +each.checked);
        // });          
    } else if (error) {
        this.error = error;
        this.data = undefined;
    }
}

handleChange( event ) {
    this.searchKey = event.target.value;
    
}



// RefreshCount=0;
// // Total Count of Parts
// PartsCount(objArray){
       
//   objArray.forEach(obj=>{
//       if(obj.ObjectName==='Task'){
//       this.RefreshCount++;
//       console.log(this.RefreshCount)
//       }
//       if(obj.hasOwnProperty('_children') && obj._children.length>0){
//         this.PartsCount(obj._children)
        
//       }
//     });
// }


//Insert SubRow
    mileId;
    parentId;
    subtaskId;
    tasksId

    handleCheckbox(event) {

        let boxes = this.template.querySelectorAll("lightning-input[data-my-id=checkboxes]");
        let currentBox = event.target.name;
        this.tasksId = event.target.dataset.id;
        this.subtaskId = event.target.dataset.id;
        this.parentId = event.currentTarget.dataset.id;

        if (event.target.checked == true) {
          this.deleteUsers = false;
      }
      else if
      (event.target.checked == false) {
          this.deleteUsers =true;
      }
      
console.log("testing" +this.parentId, "test1" +this.subtaskId);
        if (this.parentId == 'null' && this.taskId == 'null') {
            
            this.InsertSubRowButton = false;
            this.InsertSubTaskButton = false;
            // this.navigateToManagement_HisTab = false;
        }
        else if (this.parentId != 'null' && this.taskId != 'null') {
            
            this.InsertSubRowButton = false;
            this.InsertSubTaskButton = false;
            // this.navigateToManagement_HisTab = false;

        }
       
        for (let i = 0; i < boxes.length; i++) {
            let box = boxes[i];
            if (box.name !== currentBox && box.checked) {
                box.checked = false;
            }

        }
        if (event.target.checked == false) {
           
            this.InsertSubRowButton = true;
            this.InsertSubTaskButton = true;
           
        }
    }


InsertSubRow() {
  let mbomrecId = this.mileId;
  let mbomassocid = this.taskId;
   let bomname = this.taskname;
   let mbomassoc = this.subtaskId;
  // let mbomassoc = this.taskId;
  // let level = this.selectedLevel;
  // let bomPartId = this.bomPartId;
  if (this.mileId && this.taskId) {
    console.log("checked" +this.taskId, "checked1" +this.subtaskId);
      insertSubRow({
          parentId: mbomassocid,
          mbomId: mbomrecId,
         tasknames:bomname,
        subtaskId:mbomassoc,

          //  MbomAsso: mbomassoc
          // bomPartId: bomPartId
      })
          .then(() => {
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Success',
                      message: 'New Record Inserted Successfully',
                      variant: 'success',
                  }),
              )
              this.handleReset();
              if (this.check) {
                  this.isModal = false;
                 
              }
              this.expandedlevel = this.expandedlevel + 1;
              this.levelCount = 1;
              refreshApex(this.refresh);
              this.openSubRowModal = false;
          })
          .catch(error => {
              console.log(JSON.stringify(error));
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Error creating record',
                      message: error.body.message,
                      variant: 'error',
                  }),
              );
          });
  }
}
saveSubRow(event) {
  if (this.checkError()) {
      this.InsertSubRow();
      this.check = true;
  }
}






//Insert SubTask

// bomPartId;
// markupRecordId;
// recordType;
// tasktnumber;
// mileId;
// parentId;

// handleCheckbox(event) {

//     let boxes = this.template.querySelectorAll("lightning-input[data-my-id=checkboxes]");
//     let currentBox = event.target.name;
//     this.tasksId = event.target.dataset.id;
//     this.parentId = event.currentTarget.dataset.id;
  
// console.log("testing" +this.parentId)
//     if (this.parentId == 'null' ) {
        
//         this.InsertSubTaskButton = false;
//     }
//     else if (this.parentId != 'null' ) {
        
//         this.InsertSubTaskButton = false;

//     }
   
//     for (let i = 0; i < boxes.length; i++) {
//         let box = boxes[i];
//         if (box.name !== currentBox && box.checked) {
//             box.checked = false;
//         }

//     }
//     if (event.target.checked == false) {
       
//         this.InsertSubTaskButton = true;
       
//     }
// }

// InsertSubTask() {
// let mbomrecId = this.taskId;
// let mbomassocid = this.subtaskId;
// let bomname = this.subtaskname;
// if (this.taskId) {
// console.log("checked" +this.subtaskId);
//   insertSubTask({
//       parentId: mbomassocid,
//       mbomId: mbomrecId,
//      tasknames:bomname,
//       //  MbomAsso: mbomassoc
//       // bomPartId: bomPartId
//   })
//       .then(() => {
//           this.dispatchEvent(
//               new ShowToastEvent({
//                   title: 'Success',
//                   message: 'SubTask Inserted Successfully',
//                   variant: 'success',
//               }),
//           )
//           this.handleReset();
//           if (this.check) {
//               this.isModal2 = false
//           }
//           this.expandedlevel = this.expandedlevel + 1;
//           this.levelCount = 1;
//           refreshApex(this.refresh);
//           this.openSubRowModal2 = false;
//       })
//       .catch(error => {
//           console.log(JSON.stringify(error));
//           this.dispatchEvent(
//               new ShowToastEvent({
//                   title: 'Error creating record',
//                   message: error.body.message,
//                   variant: 'error',
//               }),
//           );
//       });
// }
// }
// saveSubRow(event) {
// if (this.checkError()) {
//   this.InsertSubTask();
//   this.check = true;
// }
// }

//history button

    // taskObject=TASK_OBJECT;
    // subtaskObject=SUB_TASK_OBJECT;
    // assignedtoObject=UserTaskObj;
    // @wire(hasHistoryTracking,{name:'$taskObject'}) TaskTracking ;
    // @wire(hassubtaskHistoryTracking,{name:'$subtaskObject'}) SubtaskTracking ;
    // @wire(usertaskassoHistoryTracking,{name:'$assignedtoObject'}) AssignedtoTracking ;
    // // @api recordId;
    
    // //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    //  @track isModalOpen3 = false;
    //  openModal3() {
    //      // to open modal set isModalOpen tarck value as true
    //      this.isModalOpen3 = true;
    //  }
    //  closeModal3() {
    //      // to close modal set isModalOpen tarck value as false
    //      this.isModalOpen3 = false;
    //  }    
    // taskVisible = true;
    // historyVisible = false;  
    // @track taskHistory;

    // handleClickTask(event) {  
    //     const label = event.target.label;  
  
    //     if ( label === 'Task Details' ) {  
    
    //         this.taskVisible = true;  
    //         this.historyVisible = false;
    //     } 
    // }  

    // handleClickHistory(event){
    //     console.log('---test----------');
    //     console.log(this.taskid);
    //     const label = event.target.label; 
    //     if  ( label === 'History' ) 
    //     {  
    //         // this.taskVisible = false;  
    //         this.historyVisible = true;
    //         getHistoryTable({
    //             taskId: this.taskid
    //         }).then((result) => {
    //         this.taskHistory = result;
    //         console.log(result);
    //         });  
           
    //     }  
    // }
    
}
 