import { LightningElement, api, wire, track} from 'lwc';
import WeeksandDays from "@salesforce/apex/maproadclass.WeeksandDays";
import dayNames from "@salesforce/apex/maproadclass.dayNames";
import searchAssignees from '@salesforce/apex/maproadclass.searchAssignee';
import projectList from "@salesforce/apex/maproadclass.getTreeData";
export default class RoadMaps extends LightningElement {
    @track Dates;
    @api recordId
  @wire(WeeksandDays, { PrId: "$recordId" })
  Datedate({ data }) {
    if (data) {
      this.Dates = data;
      console.log('here'+data);
    }
  }
  @track Days;
  @wire(dayNames, { PrId: "$recordId" })
  Datedays({ data }) {
    if (data) {
      this.Days = data;
    }
  }
 
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
// searchList;
// searchMsg = false;
// @track searchUser = false;
// searchKey;

// @wire(searchAssignees, {currentprojectId: '$recordId',searchKey: '$searchKey'})
// searchAssignee({data,error}) {       
// if (data) {        
//    this.searchList = data;    
//    console.log("search "+this.searchList);  
//    if(this.searchList != '' & this.searchKey != '') {
//        this.searchUser = true;
//        this.searchMsg = false;
//    } else if(this.searchList == '' & this.searchKey != ''){
//        this.searchMsg = true;
//        this.searchUser = true;
//    }else if(this.searchList == '' & this.searchKey == '') {
//        this.searchUser = false;
//        this.searchMsg = false;
//    } 

//    this.checkboxValue;
//    this.error = undefined;
   // this.template.querySelectorAll('[data-id="' +this.selectedId+ '"]').forEach(each => {
   //     each.checked = true;
   //     console.log("each.checked search " +each.checked);
   // });          
// } else if (error) {
//    this.error = error;
//    this.data = undefined;
// }
// }
}