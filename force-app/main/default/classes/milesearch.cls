public with sharing class milesearch {
    public static List<K1_PLM__Milestone__c> mileData = new List<K1_PLM__Milestone__c>();
    public static List<K1_PLM__Task__c> taskData = new List<K1_PLM__Task__c>();
    public static List<K1_PLM__Sub_task__c> subtaskData = new List<K1_PLM__Sub_task__c>();
    public static List<customStructure> projectList = new List<customStructure>();
    // public static List<String> pIds = new List<String>();
    // public static Map<String,String> finalMAp = new Map<String,String>();
    // public static Map<String,String> filesMap = new Map<String,String>();
    // public static Map<Id,String> bomUrlMap= new Map<Id,String>();
    // public static Map<Id,String> partUrlMAp = new Map<Id,String>();
    public static Integer pixelB = 10;
    public static Integer pixelP = 10;
    public static Integer levelp = 2;
    public static Integer levelb = 1;
    public static Integer count = 1;
    public static Integer filesCount = 0;
    public static Map<Id, Integer> toUpdate = new Map<Id, Integer>();
    public static List<Id> listOfIdsToDelete = new List<Id>(); //this list is store all the child ids of selected row for remove row

    public static Map<String, List<Integer>> parentIdMapBom = new Map<String, List<Integer>>();

    public static string objApiName(String recordId){
        String objectAPIName='';
        String keyPrefix;
        keyPrefix = recordId.substring(0,3);
         for( Schema.SObjectType obj : Schema.getGlobalDescribe().Values() ){
              String prefix = obj.getDescribe().getKeyPrefix();
               if(prefix == keyPrefix){
                         objectAPIName = obj.getDescribe().getName();
                          break;
                }
         }
         System.debug(objectAPIName);
        return objectAPIName;
    }
    public class customStructure {
        @AuraEnabled
        public Id id { get; set; }
        @AuraEnabled
        public String Name { get; set; }
        @AuraEnabled
        public String Level { get; set; }
        @AuraEnabled
        public String Stage { get; set; }
        @AuraEnabled
        public boolean Files { get; set; }
        @AuraEnabled
        public boolean Assignee { get; set; }
        @AuraEnabled
        public Date StartDate { get; set; }
        @AuraEnabled
        public Date EndDate { get; set; }
        @AuraEnabled
        public String Duration { get; set; }
        @AuraEnabled
        public String PercentageComplete { get; set; }
        @AuraEnabled
        public String iconName { get; set; }
        @AuraEnabled
        public String rowStyle { get; set; }
        @AuraEnabled
        public String nameStyle { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<customStructure> getTreeData(Id currentprojectId,String search) {
        if (search == '') {
            // if(
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Name__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Number__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Total_Cost__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Bought_Out_Part__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.isAccessible())
            // {
            mileData = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c
                        FROM K1_PLM__Milestone__c
                        WHERE K1_PLM__Project__c = :currentprojectId ];
             // }
        }
        else if (search != null && search.length() > 0) {
            String searchingValue = '%' + search + '%';
            //  if(Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Bom_Part_Id__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Name__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Number__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Total_Cost__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.isAccessible())
            // {
            mileData = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c
            FROM K1_PLM__Milestone__c
            WHERE K1_PLM__Project__c = :currentprojectId  AND (Name LIKE :searchingValue or Name LIKE :searchingValue)];
             // }
        }
        List<Id> mileId = new List<Id>();
        for(K1_PLM__Milestone__c mile:mileData)
        {
            mileId.add(mile.Id);
        }
        List<ContentDocumentLink> milestoneFiles = new List<ContentDocumentLink>();
        milestoneFiles = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :mileId];

        taskData = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c
        FROM K1_PLM__Task__c
        WHERE K1_PLM__Milestone__c IN :mileId ];

        List<Id> taskId = new List<Id>();
        for(K1_PLM__Task__c task:taskData)
        {
            taskId.add(task.Id);
        }
        List<ContentDocumentLink> taskFiles = new List<ContentDocumentLink>();
        taskFiles = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :taskId];

        subtaskData = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c,K1_PLM__End_Date__c, K1_PLM__Date__c
        FROM K1_PLM__Sub_task__c
        WHERE K1_PLM__Task__c IN :taskId ];

        List<Id> subtaskId = new List<Id>();
        for(K1_PLM__Sub_task__c subtask:subtaskData)
        {
            subtaskId.add(subtask.Id);
        }
        List<ContentDocumentLink> subtaskFiles = new List<ContentDocumentLink>();
        subtaskFiles = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :subtaskId];

        //for milestone data
        for(K1_PLM__Milestone__c milestone : mileData){
            System.debug('entering to milestone');
            Integer filesCount=0;
            boolean noFilesFound = true;
            customStructure milestoneStruct = new customStructure();
            milestoneStruct.id = milestone.Id;
            milestoneStruct.Name = milestone.Name;
            milestoneStruct.Level = 'Milestone';
            milestoneStruct.Stage = 'Create';
            for(ContentDocumentLink cdl : milestoneFiles){
                filesCount = filesCount + 1;
                if(cdl.LinkedEntityId == milestone.Id){
                    milestoneStruct.Files = true;
                    noFilesFound = false;
                }
                if(noFilesFound && filesCount == milestoneFiles.size()){
                    milestoneStruct.Files = false;
                }
            }
            if(milestoneFiles.size() == 0){
                milestoneStruct.Files = false;
            }
            if(milestone.K1_PLM__Assignee__c != null || milestone.K1_PLM__Assignee__c != ''){
                milestoneStruct.Assignee = true;
            }
            else{
                milestoneStruct.Assignee = false;
            }
            milestoneStruct.StartDate = milestone.K1_PLM__Start_Date__c;
            milestoneStruct.EndDate = milestone.K1_PLM__End_Date__c;
            milestoneStruct.Duration = '0';
            milestoneStruct.PercentageComplete = '0%';
            milestoneStruct.iconName = 'utility:chevronright';
            milestoneStruct.rowStyle = 'show';
            milestoneStruct.nameStyle = '';
            //milestoneStruct.level = 1;
            // milestoneStruct.state = false;
            // milestoneStruct.markState = false;
            projectList.add(milestoneStruct);
            //for task data
            for(K1_PLM__Task__c task : taskData){
                System.debug('entering to task');
                Integer taskfilesCount=0;
                boolean noTaskFilesFound = true;
                customStructure taskStruct = new customStructure();
                taskStruct.id = task.Id;
                taskStruct.Name = task.Name;
                taskStruct.Level = 'Task';
                taskStruct.Stage = 'Create';
                for(ContentDocumentLink cdl : taskFiles){
                    taskfilesCount = taskfilesCount + 1;
                    if(cdl.LinkedEntityId == task.Id){
                        taskStruct.Files = true;
                        noTaskFilesFound = false;
                    }
                    if(noTaskFilesFound && taskfilesCount == taskFiles.size()){
                        taskStruct.Files = false;
                    }
                }
                if(taskFiles.size() == 0){
                    taskStruct.Files = false;
                }
                if(task.K1_PLM__User__c != null || task.K1_PLM__User__c != ''){
                    taskStruct.Assignee = true;
                }
                else{
                    taskStruct.Assignee = false;
                }
                taskStruct.StartDate = task.K1_PLM__Date__c;
                taskStruct.EndDate = task.K1_PLM__End_Date__c;
                taskStruct.Duration = '0';
                taskStruct.PercentageComplete = '0%';
                taskStruct.iconName = 'utility:chevronright';
                taskStruct.rowStyle = 'hidden';
                taskStruct.nameStyle = 'margin-left:10px;';
                //milestoneStruct.level = 1;
                // milestoneStruct.state = false;
                // milestoneStruct.markState = false;
                projectList.add(taskStruct);
                //for subtask data
                for(K1_PLM__Sub_task__c subtask : subtaskData){
                    System.debug('entering to subtask');
                    Integer subtaskfilesCount=0;
                    boolean noSubTaskFilesFound = true;
                    customStructure subTaskStruct = new customStructure();
                    subTaskStruct.id = subtask.Id;
                    subTaskStruct.Name = subtask.Name;
                    subTaskStruct.Level = 'Sub Task';
                    subTaskStruct.Stage = 'Create';
                    for(ContentDocumentLink cdl : subtaskFiles){
                        subtaskfilesCount = subtaskfilesCount + 1;
                        if(cdl.LinkedEntityId == subtask.Id){
                            subTaskStruct.Files = true;
                            noSubTaskFilesFound = false;
                        }
                        if(noTaskFilesFound && subtaskfilesCount == subtaskFiles.size()){
                            subTaskStruct.Files = false;
                        }
                    }
                    if(subtaskFiles.size() == 0){
                        subTaskStruct.Files = false;
                    }
                    if(subtask.K1_PLM__User__c != null || subtask.K1_PLM__User__c != ''){
                        subTaskStruct.Assignee = true;
                    }
                    else{
                        subTaskStruct.Assignee = false;
                    }
                    subTaskStruct.StartDate = subtask.K1_PLM__Date__c;
                    subTaskStruct.EndDate = subtask.K1_PLM__End_Date__c;
                    subTaskStruct.Duration = '0';
                    subTaskStruct.PercentageComplete = '0%';
                    // subTaskStruct.iconName = 'utility:chevronright';
                    subTaskStruct.rowStyle = 'hidden';
                    // subTaskStruct.nameStyle = 'margin-left:40px;';
                    //milestoneStruct.level = 1;
                    // milestoneStruct.state = false;
                    // milestoneStruct.markState = false;
                    projectList.add(subTaskStruct);
                }
               
            }
        } system.debug('projectList ' +projectList);
        return projectList;
    }

    
   //file upload
   @AuraEnabled
   public static list<Id> uploadFile(list<Object> filesToInsert, String recId)
    {
       list<Id> lstCntVerIds = new list<Id>();
       List<ContentVersion> lstVersionsToInsert = new List<ContentVersion>();
       for (Object file : filesToInsert) {
           FileInfo fileData = (FileInfo)JSON.deserialize(JSON.serialize(file), FileInfo.class);
           ContentVersion objCntVersion = new ContentVersion();
           objCntVersion.PathOnClient = fileData.Title;
           objCntVersion.FirstPublishLocationId = recId;
           objCntVersion.Title = fileData.Title;
           objCntVersion.VersionData = fileData.VersionData;
          //  objCntVersion.K1_PLM__Thumb_Nail__c= true;
           lstVersionsToInsert.add(objCntVersion);
       }
    //    if (Schema.sObjectType.ContentVersion.fields.PathOnClient.isCreateable() &&
    //    Schema.sObjectType.ContentVersion.fields.FirstPublishLocationId.isCreateable() &&
    //    Schema.sObjectType.ContentVersion.fields.Title.isCreateable() &&
    //    Schema.sObjectType.ContentVersion.fields.VersionData.isCreateable() &&
    //    ContentVersion.sObjectType.getDescribe().isCreateable()) {
       list<Database.saveResult> res = Database.insert(lstVersionsToInsert);
       for (Database.SaveResult saveResult : res) {
           if(saveResult.isSuccess()) {
               lstCntVerIds.add(saveResult.getId());
           }
       }
     // }
       return lstCntVerIds;
   }
   public class FileInfo
   {
       public String Title;
       public Blob VersionData;
   }

    // @AuraEnabled
    //     public static void updateStartdate(Id mId,String mstartdate){

    //         K1_PLM__Supplier_Site_Facility__c mileStartdate = new K1_PLM__Supplier_Site_Facility__c();
    //         // if ( Schema.sObjectType.K1_PLM__Supplier_Site_Facility__c.fields.K1_PLM__Facility_Name__c.isAccessible() ){
    //         mileStartdate= [Select Id,K1_PLM__Start_Date__c FROM K1_PLM__Milestone__c where Id = :mId];
    //          mileStartdate.K1_PLM__Start_Date__c=mstartdate;
    //           update mileStartdate;
                    
    //                 System.debug(mileStartdate);
    //     }

    @AuraEnabled(cacheable=true)   
    public static List<SSObjectResult> searchAssignee(Id currentprojectId,Id mileId, String searchKey){
       
        List<SSObjectResult> newmilesList = new List<SSObjectResult>();
        // List<SSObjectResult1> newtasksList = new List<SSObjectResult1>();
        List<K1_PLM__Milestone__c> milesList = new List<K1_PLM__Milestone__c>();
        List<K1_PLM__Task__c> tasksList = new List<K1_PLM__Task__c>();                               
        
        if ( searchKey != null && searchKey != '' ) {
            String key = '%' + searchKey + '%';
            // if(Schema.sObjectType.User.isAccessible() && Schema.sObjectType.User.fields.Name.isAccessible()&&Schema.sObjectType.UserRole.fields.Name.isAccessible()){
                milesList = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c
                FROM K1_PLM__Milestone__c
                WHERE K1_PLM__Project__c = :currentprojectId AND (Name LIKE :key)];
            // }
            tasksList = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c FROM K1_PLM__Task__c
            WHERE K1_PLM__Milestone__c = :mileId AND(Name LIKE : key)] ;   
    
        }              
        for(K1_PLM__Milestone__c userl:milesList)
        {
           Id RecordId = userl.Id;
           String Name = userl.Name;           
           String Status = userl.K1_PLM__Status__c;
           String Assignee = userl.K1_PLM__Assignee__c;
           Date EndDate = userl.K1_PLM__End_Date__c;
           Date StartDate = userl.K1_PLM__Start_Date__c;
         // String Assignee = userl.Assignee;
       
           newmilesList.add(new SSObjectResult(RecordId,Name,Status,Assignee,EndDate,StartDate));
        }
       
                for(K1_PLM__Task__c userl1:tasksList)
        {
           Id RecordId = userl1.Id;
           String Name = userl1.Name;           
           String Status = userl1.K1_PLM__Status__c;
           String Assignee = userl1.K1_PLM__User__c;
           Date StartDate = userl1.K1_PLM__Date__c;
           Date EndDate = userl1.K1_PLM__End_Date__c;
         // String Assignee = userl.Assignee;
       
         newmilesList.add(new SSObjectResult(RecordId,Name,Status,Assignee,EndDate,StartDate));
        }
        return newmilesList;
    }

    public class SSObjectResult 
    {
        @AuraEnabled
        public Id Id;
        @AuraEnabled
        public String Name;
        @AuraEnabled
        public String status;
        @AuraEnabled
        public String assignee;
          @AuraEnabled
        public Date enddate;
        @AuraEnabled
        public Date startdate;
        // @AuraEnabled
        // public Date date1;
        // @AuraEnabled
        // public String user;
       
        
        public SSObJectResult(Id Id,String NameTemp, String StatusTemp,String AssigneeTemp,Date EnddateTemp,Date StartdateTemp) {
            Id = Id;
            Name = NameTemp;
            status = StatusTemp;
            assignee =AssigneeTemp;
            enddate =EnddateTemp;
            startdate =StartdateTemp;
            // user =UserTemp;
            // date1 =DateTemp;
            
        }
    }

    // public class SSObjectResult1 
    // {
    //     @AuraEnabled
    //     public Id Id;
    //     @AuraEnabled
    //     public String Name;
    //     @AuraEnabled
    //     public String status;
    //     @AuraEnabled
    //     public String assignee;
    //       @AuraEnabled
    //     public Date enddate;
    //     @AuraEnabled
    //     public Date startdate;
    //     // @AuraEnabled
    //     // public Date date1;
    //     // @AuraEnabled
    //     // public String user;
       
        
    //     public SSObJectResult1(Id Id,String NameTemp, String StatusTemp,String AssigneeTemp,Date EnddateTemp,Date StartdateTemp) {
    //         Id = Id;
    //         Name = NameTemp;
    //         status = StatusTemp;
    //         assignee =AssigneeTemp;
    //         enddate =EnddateTemp;
    //         startdate =StartdateTemp;
    //         // user =UserTemp;
    //         // date1 =DateTemp;
            
    //     }
    // }
}
