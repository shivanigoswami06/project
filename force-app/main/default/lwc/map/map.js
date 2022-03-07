import { LightningElement,wire,track,api } from 'lwc';
import WeeksandDays from "@salesforce/apex/maproadclass.WeeksandDays";
import dayNames from "@salesforce/apex/maproadclass.dayNames";

export default class Map extends LightningElement {
    @track Dates;
    @track searchUser = false;
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
 
}