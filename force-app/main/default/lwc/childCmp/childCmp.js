import { LightningElement, api } from "lwc";

export default class ChildCmp extends LightningElement {
    @api consumer;

    get totalCardsClass() {
      return `slds-col slds-size_1-of-3 slds-text-align_center slds-text-title_bold ${
        this.consumer.Level__c = 'Task' ? "green" : "orange"
      }`;
    }
  }