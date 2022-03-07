public with sharing class deletemilestone {
    @AuraEnabled(cacheable=true)
    public static List<K1_PLM__Milestone__c > fetchMilestoneRecord(){
        List<K1_PLM__Milestone__c > mileList = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c
        FROM K1_PLM__Milestone__c ];
        return mileList;
    }
    @AuraEnabled(cacheable=true)
    public static List<K1_PLM__Task__c > fetchTaskRecord(){
        List<K1_PLM__Task__c > taskList = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c FROM K1_PLM__Task__c ];
        return taskList;
    }
    @AuraEnabled(cacheable=true)
    public static List<K1_PLM__Sub_task__c> fetchSubtaskRecord(){
        List<K1_PLM__Sub_task__c> subtaskList = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c,K1_PLM__End_Date__c, K1_PLM__Date__c
        FROM K1_PLM__Sub_task__c];
        return subtaskList;
    }
    @AuraEnabled
    public static List<K1_PLM__Milestone__c > deleteMultipleMilestoneRecord(List<String> mileObj){
        List<K1_PLM__Milestone__c> mileObjItem = new   List<K1_PLM__Milestone__c >();
      List<K1_PLM__Milestone__c > mileObjList = [Select Id, Name  From K1_PLM__Milestone__c  Where Id IN:mileObj];
      for(K1_PLM__Milestone__c  mile:mileObjList){
        mileObjItem.add(mile);
      }
      if(mileObjItem.size()>0){
          try{
            delete mileObjItem;           
          }
          catch (Exception exp) {
            throw new AuraHandledException(exp.getMessage());
        }
      }
      return fetchMilestoneRecord();
    }
    @AuraEnabled
    public static List<K1_PLM__Task__c> deleteMultipleTaskRecord(List<String> taskObj){
        List<K1_PLM__Task__c> taskObjItem = new   List<K1_PLM__Task__c>();
      List<K1_PLM__Task__c> taskObjList = [Select Id, Name  From K1_PLM__Task__c  Where Id IN:taskObj];
      for(K1_PLM__Task__c   task:taskObjList){
        taskObjItem.add(task);
      }
      if(taskObjItem.size()>0){
          try{
            delete taskObjItem;           
          }
          catch (Exception exp) {
            throw new AuraHandledException(exp.getMessage());
        }
      }
      return fetchTaskRecord();
    }
    @AuraEnabled
    public static List<K1_PLM__Sub_task__c> deleteMultipleSubTaskRecord(List<String> subtaskObj){
        List<K1_PLM__Sub_task__c> subtaskObjItem = new   List<K1_PLM__Sub_task__c>();
      List<K1_PLM__Sub_task__c> subtaskObjList = [Select Id, Name  From K1_PLM__Sub_task__c  Where Id IN:subtaskObj];
      for(K1_PLM__Sub_task__c  subtask:subtaskObjList){
        subtaskObjItem.add(subtask);
      }
      if(subtaskObjItem.size()>0){
          try{
            delete subtaskObjItem;           
          }
          catch (Exception exp) {
            throw new AuraHandledException(exp.getMessage());
        }
      }
      return fetchSubtaskRecord();
    }
}