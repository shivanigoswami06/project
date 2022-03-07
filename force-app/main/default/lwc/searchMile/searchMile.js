import { LightningElement, api, track, wire } from "lwc";
import projectList from "@salesforce/apex/milesearch.getTreeData";
import searchAssignees from '@salesforce/apex/milesearch.searchAssignee';
//import uploadFile from "@salesforce/apex/projectoverview.uploadFile";
import adduser from "@salesforce/resourceUrl/adduser";
import addeduser from "@salesforce/resourceUrl/addeduser";
import emptyfile from "@salesforce/resourceUrl/projectemptyfile";
import filledfile from "@salesforce/resourceUrl/projectfilledfile";
//import fileUpload from "@salesforce/resourceUrl/fileUpload";
import FILES from '@salesforce/schema/K1_PLM__File__c';
import ID from '@salesforce/schema/K1_PLM__Project__c.Id';
//import updateStartdate from "@salesforce/apex/projectoverview.updateStartdate";
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


export default class SearchMile extends NavigationMixin(LightningElement){


    searchList;
     searchMsg = false;
     @track searchUser = false;
     searchKey;
     iconName = "utility:edit";
    uploadFileId;
    currentfileID;
    @track menuLevelItem = [];
    mLevel = 0;
    @track header = [];
    expandedlevel = 0; //this variable is used to store the duplicate value of level expanding
    levelCount = 0; 
    @api recordId = 'a0T5f000006hcdQEAQ';
    @track projectdata;
    searchKey = '';
    @wire(projectList, { currentprojectId: '$recordId', search: '$searchKey' })
    projectresult({ data, error }) {
        if (data) {
            this.projectdata = data;
            console.log('project data '+ JSON.stringify(this.projectdata));
        }
        if (error) {
            console.log('error ' +error);
        }
    }

    emptyfile = emptyfile;
    filledfile = filledfile;
    adduser = adduser;
    addeduser = addeduser;
    //fileUpload = fileUpload;

fileId;
previewHandler(event) {
this.currentfileID = event.currentTarget.dataset.id;
console.log("this.previewHandlerID ====> " + this.currentfileID);
this[NavigationMixin.Navigate]({
  type: "standard__navItemPage",
  attributes: {
    pageName: "K1_PLM__Management_Files"
    // recordId: 'a0T5f000006hcdQEAQ',
    //         apiName: "K1_PLM__File__c"

  },
  state: {
    selectedRecordId: this.currentfileID
  }
});
console.log("field", this.currentfileID);

}

openModalh = false;
showModalh(event) {
this.openModalh = true;
this.uploadFileId = event.currentTarget.dataset.id;
this.currentfileID = event.currentTarget.dataset.name;
console.log("Record Id " + this.uploadFileId);
}
//Close popup for upload file in process Instruction
closeModalh() {
this.openModalh = false;
}


handleSaveFiles() {
    let fileid = this.uploadFileId;
    uploadFile({ filesToInsert: this.filesUploaded, recId: fileid })
        .then(data => {
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            alert("Error while uploading File!");
        });
}
savefile() {
    // this.handleSaveFiles();
    const fields = {};
    fields[ID.fieldApiName] = this.uploadFileId;
    fields[FILES.fieldApiName] = true;
    const recordInput = { fields };
    updateRecord(recordInput)
        .then(result => {
            this.openModalh = false;
            
            this.levelCount = 1;
            refreshApex(this.refresh);
        })
        .catch(error => {
            console.log(JSON.stringify(error));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: uploadedFiles.length + ' Files uploaded Successfully: ' + uploadedFileNames,
                    variant: 'success',
                }),
            );
        });
}

    // filemile;
    // filetask;
    // filesubtask;
    
    // navigateToTabPage(event) {
    //     this.filetask = event.target.dataset.id;
    //     this.filemile = event.target.dataset.id;
    //     this[NavigationMixin.GenerateUrl]({
    //         type: "standard__navItemPage",
    //         attributes: {
    //             recordId: 'a0T5f000006hcdQEAQ',
    //             apiName: "K1_PLM__File__c"
    //         }
            
    //     }).then((url) => {
    //         localStorage.setItem('proId', this.recordId);
    //         localStorage.setItem('mileId', this.filemile);
    //         localStorage.setItem('task', this.filetask);
    //         localStorage.setItem('subtask', this.filesubtask);
    //         window.open(url, "_blank");
    //     });
    // }
    // openModalh = false;
    // uploadFileId;
    // showModalh(event) {
    //     this.uploadFileId = event.target.dataset.id;
    //     this.openModalh = true;
    // }
    // closeModalh() {
    //     this.openModalh = false;
    //     this.levelCount = 1;
    //     refreshApex(this.refresh);
    // }
    
    // handleUploadFinished(event) {
    //     // Get the list of uploaded files
    //     const uploadedFiles = event.detail.files;
    //     let uploadedFileNames = '';
    //     for(let i = 0; i < uploadedFiles.length; i++) {
    //         uploadedFileNames += uploadedFiles[i].name + ', ';
    //     }
    //     this.openModalh = false;
    //     this.dispatchEvent(
    //         new ShowToastEvent({
    //             title: 'Success',
    //             message: uploadedFiles.length + ' Files uploaded Successfully: ' + uploadedFileNames,
    //             variant: 'success',
    //         }),
    //     );
    //     this.savefile();
    //     location.reload(true);
    // }

    openpartModal = false;
    showpartModal() {
        this.openpartModal = true;
    }
    closepartModal() {
        this.openpartModal = false;
    }

    openSubRowModal = false;
    showSubRowModal() {
        this.openSubRowModal = true;
    }
    closeSubRowModal() {
        this.openSubRowModal = false;
    }
    openRowModal = false;
    showRowModal() {
        this.openRowModal = true;
    }

    closeRowModal() {
        this.openRowModal = false;
    }


    // mboms(result) {
    //     this.isLoading = true;
    //     this.refresh = result;
    //     // let getDocBaseUrl = `https://${window.location.hostname.split(".")[0]
    //     //     }--c.documentforce.com`;
    //     if (result.data) {
    //         var tempOppList = [];
    //         for (var i = 0; i < result.data.length; i++) {
    //             let tempRecord = Object.assign({}, result.data[i]); //cloning object
    //             if (tempRecord.thumb == '') {
    //                 tempRecord.thumb = nothumbnail;
    //             } else {
    //                 tempRecord.thumb = `${getDocBaseUrl}/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${tempRecord.thumb}`;
    //             }
    //             tempOppList.push(tempRecord);
    //         }
    //         this.projectdata = tempOppList;
    //         this.mLevel = 0;
    //         this.projectdata.forEach((obj) => {
    //             if (this.mLevel < obj.level) {
    //                 this.mLevel = obj.level;
    //             }
    //         });
    //         this.menuLevelItem = [];
    //         for (let l = 1; l <= this.mLevel; l++) {
    //             this.menuLevelItem.push({ label: 'Level ' + l, value: l.toString() });
    //         }
    //         if (this.levelCount == 1) {
    //             this.handleChangeAfterRefresh();
    //         }
    //         this.isLoading = false;
    //     }
    //     else if (result.error) {
    //         console.error(JSON.stringify(result.error));
    //     }

    // }


    // value;
    // parseValue;
    // handleChange(event) {
    //     let lists = [];
    //     this.value = event.detail.value;
    //     this.expandedlevel = parseInt(event.detail.value);
    //     if (this.parseValue > this.value) {
    //         this.handlecollapseOnLevelChange();
    //     }
    //     this.parseValue = parseInt(event.detail.value);
    //     for (let a = 0; a < this.projectdata.length; a++) {
    //         if (this.parseValue >= this.projectdata[a].level) {
    //             lists.push(this.projectdata[a].id);
    //         }
    //         if (this.parseValue < this.projectdata[a].level) {
    //             continue;
    //         }
    //     }
    //     for (let k = 0; k < this.projectdata.length; k++) {
    //         if (this.projectdata[k].parentId == 'null' && this.projectdata[k].type == 'Bom') {
    //             this.projectdata[k].state = true;
    //             this.projectdata[k].iconName = 'utility:chevrondown';
    //         }
    //         if (lists.includes(this.projectdata[k].id)) {
    //             this.projectdata[k].rowStyle = 'show';
    //             if (this.projectdata[k].iconName == 'utility:chevronright' && this.projectdata[k].level < this.parseValue) {
    //                 this.projectdata[k].iconName = 'utility:chevrondown';
    //                 this.projectdata[k].state = true;
    //             }
    //         }
    //     }
    // }

    // handleChangeAfterRefresh() {
    //     let lists = [];
    //     this.value = this.expandedlevel;
    //     this.expandedlevel = this.value;
    //     this.parseValue = this.expandedlevel;
    //     for (let a = 0; a < this.projectdata.length; a++) {
    //         if (this.parseValue >= this.projectdata[a].level) {
    //             lists.push(this.projectdata[a].id);
    //         }
    //         if (this.parseValue < this.projectdata[a].level) {
    //             continue;
    //         }
    //     }
    //     for (let k = 0; k < this.projectdata.length; k++) {
    //         if (this.projectdata[k].parentId == 'null' && this.projectdata[k].type == 'Bom') {
    //             this.projectdata[k].state = true;
    //             this.projectdata[k].iconName = 'utility:chevrondown';
    //         }
    //         if (lists.includes(this.projectdata[k].id)) {
    //             this.projectdata[k].rowStyle = 'show';
    //             if (this.projectdata[k].iconName == 'utility:chevronright' && this.projectdata[k].level < this.parseValue) {
    //                 this.projectdata[k].iconName = 'utility:chevrondown';
    //                 this.projectdata[k].state = true;
    //             }
    //         }
    //     }
    // }

    

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

//search functionality
     searchMsg = false;
     @wire(searchAssignees, {currentprojectId: '$recordId',searchKey: '$searchKey'})
// @wire(searchAssignees, {currentprojectId: '$recordId', searchKey: '$searchKey', mileId:'$recordId'})
searchAssignee({data,error}) {       
    if (data) {        
        this.searchList = data;    
        console.log("search ");  
        if(this.searchList != '' & this.searchKey != '') {
            this.searchUser = true;
            this.searchMsg = false;
        } else if(this.searchList == '' & this.searchKey != ''){p
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

  ModifiedendDate;

  currentMId;
  originalenddate;

  milestoneEndDateChange(event) {
    this.milesenddate = event.target.value;
    console.log(" this.milesenddate in pl" + this.milesenddate);
  }

  milestoneEndDateEdit(event) {
    //when user clicks on save
    // eslint-disable-next-line
    if (event.target.iconName == "utility:check") {
      event.target.iconName = "utility:edit";

      this.currentpmendid = event.currentTarget.dataset.name;
      console.log(" this.currentpstartid " + this.currentpmendid);
      let pmendid = '[data-name="' + this.currentpmendid + '"]';
      let pmend = this.template.querySelector(pmendid);
      pmend.setAttribute(
        "style",
        "background-color: white; position: absolute; width: 85%;"
      );

      let id = event.target.value;
      this.currentMId = id;
      console.log("id ", +id);
      console.log("this.currentMId " + this.currentMId);
      console.log(this.mileEID);

      let startid = '[data-id="' + this.mileEID + '"]';

      // if(this.template.querySelector(startid).type == "date"){
      //   this.template.querySelector(startid).type = "text";
      //   console.log("this.milesenddate ", +this.milesenddate );
      //        getEndDateFormat1({
      //         EndDate : this.milesenddate
      //     })
      //     .then((result) => {
      //         this.ModifiedendDate = result;
      //     })

      //     this.template.querySelector(startid).value =  this.ModifiedendDate;
      // }
      // console.log("qEND SAVE " + this.template.querySelector(startid).type);

      let start = this.template.querySelector(startid);
      console.log("datebsave " + start.value);
      console.log(startid);

      // let milestoneendsave = " <input  min={mileRecord.projectSDate} data-id={mileRecord.mileEID} max={mileRecord.projectEDate}  value={mileRecord.milestoneEdate} onchange={milestoneEndDateChange} disabled />";
      // this.template.querySelector(startid).innerHTML = milestoneendsave;

      start.setAttribute("disabled", "disabled");
      start.setAttribute(
        "style",
        "border-style: none; width: 85%; resize: none;  background-color: transparent;"
      );

      M_END_DATE({
        MEID: id,
        menddate: start.value
      }).then(() => {
        refreshApex(this.RefreshMilestoneAndTask);
        getRecordNotifyChange(this.mileEID);
      });
    } else {
      // event.target.type = "date";
      // console.log("save" +event.target.type);
      event.target.iconName = "utility:check";

      this.currentpmendid = event.currentTarget.dataset.name;
      console.log(" this.currentpstartid " + this.currentpmendid);
      let pmendid = '[data-name="' + this.currentpmendid + '"]';
      let pmend = this.template.querySelector(pmendid);
      pmend.setAttribute(
        "style",
        "background-color: white; position: absolute; color: white; z-index: -1; width: 85%;"
      );

      this.mileEID = event.currentTarget.dataset.id;
      let startid = '[data-id="' + this.mileEID + '"]';

      // if(this.template.querySelector(startid).type == "text"){
      //   this.template.querySelector(startid).type = "date";
      //      displayenddate({
      //         mendid : this.currentMId
      //     })
      //     this.template.querySelector(startid).value =  this.originalenddate;
      // }
      // console.log("qEND EDIT " + this.template.querySelector(startid).type);

      let start = this.template.querySelector(startid);
      console.log("datebedit " + start.value);

      // let milestoneendedit = " <input  min={mileRecord.projectSDate} data-id={mileRecord.mileEID} max={mileRecord.projectEDate}  value={mileRecord.EndDisplay} onchange={milestoneEndDateChange} disabled />";
      // this.template.querySelector(startid).innerHTML = milestoneendedit;

      // let milestoneendtest = "enddate";
      // this.template.querySelector(startid).innerHTML = milestoneendtest;

      start.removeAttribute("disabled");
      start.setAttribute(
        "style",
        "border:0.02px; width: 85%;  resize:none; border-style:none none dotted none; outline:none;"
      );
    }
  }


 
 }
 