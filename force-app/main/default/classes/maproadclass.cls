public with sharing class maproadclass {
    @AuraEnabled(cacheable=true)
    public static List<SObjectDays> WeeksandDays(Id PrId)
    {
        K1_PLM__Project__c proj = new K1_PLM__Project__c();
        if(Schema.sObjectType.K1_PLM__Project__c.fields.K1_PLM__Start_Date__c.isAccessible() && 
            Schema.sObjectType.K1_PLM__Project__c.fields.K1_PLM__Finish_Date__c.isAccessible()){
                proj= [SELECT K1_PLM__Start_Date__c,Id,K1_PLM__Finish_Date__c FROM K1_PLM__Project__c WHERE Id =:PrId]; 
        }
        List<K1_PLM__Milestone__c> milestoneList = new List<K1_PLM__Milestone__c>();
        if(Schema.sObjectType.K1_PLM__Milestone__c.fields.Name.isAccessible() && 
            Schema.sObjectType.K1_PLM__Milestone__c.fields.K1_PLM__Start_Date__c.isAccessible() &&
            Schema.sObjectType.K1_PLM__Milestone__c.fields.K1_PLM__End_Date__c.isAccessible() &&
            Schema.sObjectType.K1_PLM__Milestone__c.fields.K1_PLM__Project__c.isAccessible()){
                milestoneList = [SELECT Id,Name,K1_PLM__Start_Date__c,K1_PLM__End_Date__c,K1_PLM__Project__c FROM K1_PLM__Milestone__c WHERE K1_PLM__Project__c=:PrId];
        }
        List<SObjectDays> DayList=new List<SObjectDays>();
        DateTime dateStart = proj.K1_PLM__Start_Date__c;
        DateTime dateEnd = proj.K1_PLM__Finish_Date__c;
        DateTime CurrentDate = dateStart;
        String TotalWeek;
        Integer uniqueID=1;
        while(CurrentDate<=dateEnd)
        {
            String weekStart = CurrentDate.format('d MMM  ');
            Datetime weekEndDate=CurrentDate.addDays(6);
            DateTime nextWeekStartDate = CurrentDate.addDays(7);
            DateTime weekEndDate1=CurrentDate.addDays(1);
            DateTime weekEndDate2=CurrentDate.addDays(2);
            DateTime weekEndDate3=CurrentDate.addDays(3);
            DateTime weekEndDate4=CurrentDate.addDays(4);
            DateTime weekEndDate5=CurrentDate.addDays(5);
            DateTime weekEndDate6=CurrentDate.addDays(6);
            String weekEnd;
            if(weekEndDate<=dateEnd)
            {
             weekEnd  = weekEndDate.format('- d MMM YYYY'); 
            }
            else if(weekEndDate6<=dateEnd)
            {
                weekEnd  = weekEndDate6.format('- d MMM YYYY'); 
            }
            else if(weekEndDate5<=dateEnd)
            {
                weekEnd  = weekEndDate5.format('- d MMM YYYY');
            }
            else if(weekEndDate4<=dateEnd)
            {
                weekEnd  = weekEndDate4.format('- d MMM YYYY'); 
            }
            else if(weekEndDate3<=dateEnd)
            {
                weekEnd  = weekEndDate3.format('- d MMM YYYY');
            }
            else if(weekEndDate2<=dateEnd)
            {
                 weekEnd  = weekEndDate2.format('- d MMM YYYY'); 
            }
            else if(weekEndDate1<=dateEnd)
            {
                 weekEnd  = weekEndDate1.format('- d MMM YYYY'); 
            }
            if(weekEnd != NULL)
            {
            TotalWeek = weekStart + weekEnd;
            }else
            {
            TotalWeek = weekStart;
            }
            CurrentDate=nextWeekStartDate;
            DayList.add(new SObjectDays(uniqueID,TotalWeek));
            uniqueID=uniqueID+1;
        }
    
        return DayList;
       
    }
    public class SObjectDays 
    {
        @AuraEnabled
        public Integer DateId;
        @AuraEnabled
        public String DateName;
    
        
        public SObjectDays(Integer keyId, String Name) 
        {
            DateId = keyId;
            DateName = Name;
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<SObjectDayNames> dayNames(Id PrId)
    {
        K1_PLM__Project__c proj = new K1_PLM__Project__c();
        if(Schema.sObjectType.K1_PLM__Project__c.fields.K1_PLM__Start_Date__c.isAccessible() && 
            Schema.sObjectType.K1_PLM__Project__c.fields.K1_PLM__Finish_Date__c.isAccessible()){
                proj= [SELECT K1_PLM__Start_Date__c,Id,K1_PLM__Finish_Date__c FROM K1_PLM__Project__c WHERE Id =:PrId];
        }
        List<K1_PLM__Milestone__c> milestoneList = new List<K1_PLM__Milestone__c>();
        if(Schema.sObjectType.K1_PLM__Milestone__c.fields.Name.isAccessible() && 
            Schema.sObjectType.K1_PLM__Milestone__c.fields.K1_PLM__Start_Date__c.isAccessible() &&
            Schema.sObjectType.K1_PLM__Milestone__c.fields.K1_PLM__End_Date__c.isAccessible() &&
            Schema.sObjectType.K1_PLM__Milestone__c.fields.K1_PLM__Project__c.isAccessible()){
                milestoneList=[SELECT Id,Name,K1_PLM__Start_Date__c,K1_PLM__End_Date__c,K1_PLM__Project__c FROM K1_PLM__Milestone__c WHERE K1_PLM__Project__c=:PrId];
        }
       
        List<SObjectDayNames> DayList=new List<SObjectDayNames>();
        DateTime dateStart = proj.K1_PLM__Start_Date__c;
        DateTime dateEnd = proj.K1_PLM__Finish_Date__c;
        DateTime CurrentDate = dateStart;
    
        Integer uniqueID=1;
        while(CurrentDate<=dateEnd)
        {
            String dayStart = CurrentDate.format('E');
            Datetime NextDate=CurrentDate.addDays(1);
            DayList.add(new SObjectDayNames(uniqueID,dayStart));
            uniqueID=uniqueID+1;
            CurrentDate = NextDate;
        }
        return DayList;
       
    } 
    
    
    public class SObjectDayNames 
    {
        @AuraEnabled
        public Integer DayId;
        @AuraEnabled
        public String DayName;
        
        
        public SObjectDayNames(Integer keyId, String Name) 
        {
            DayId = keyId;
            DayName = Name;
        }
       
    }
    
    
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
        public Decimal Duration { get; set; }
        @AuraEnabled
        public String PercentageComplete { get; set; }
        @AuraEnabled
        public String iconName { get; set; }
        @AuraEnabled
        public String rowStyle { get; set; }
        @AuraEnabled
        public String nameStyle { get; set; }
        @AuraEnabled
        public String colorStyle { get; set; }
        @AuraEnabled
        public String iconStyle { get; set; }
       
    }

    @AuraEnabled(cacheable=true)
    public static List<customStructure> getTreeData(Id currentprojectId) {
        // if (search == '') {
            // if(
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Name__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Number__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Total_Cost__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Bought_Out_Part__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.isAccessible())
            // {
            // mileData = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Total_Working_Days__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c,Completion__c
            //             FROM K1_PLM__Milestone__c
            //             WHERE K1_PLM__Project__c = :currentprojectId ];
             // }
        // }
        // else if (search != null && search.length() > 0) {
        //     String searchingValue = '%' + search + '%';
            //  if(Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Bom_Part_Id__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Name__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__BOM_Part_Number__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.fields.K1_PLM__Total_Cost__c.isAccessible()&&
            // Schema.sObjectType.K1_PLM__MBOM_Association__c.isAccessible())
            // {
            mileData = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Total_Working_Days__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c,Completion__c
            FROM K1_PLM__Milestone__c
            WHERE K1_PLM__Project__c = :currentprojectId];
             // }
        // }
        List<Id> mileId = new List<Id>();
        for(K1_PLM__Milestone__c mile:mileData)
        {
            mileId.add(mile.Id);
        }
        List<ContentDocumentLink> milestoneFiles = new List<ContentDocumentLink>();
        milestoneFiles = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :mileId];

        taskData = [SELECT Id,Name,K1_PLM__Status__c, K1_PLM__Total_Working_Days__c, K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c,Completion__c
        FROM K1_PLM__Task__c
        WHERE K1_PLM__Milestone__c IN :mileId ];

        List<Id> taskId = new List<Id>();
        for(K1_PLM__Task__c task:taskData)
        {
            taskId.add(task.Id);
        }
        List<ContentDocumentLink> taskFiles = new List<ContentDocumentLink>();
        taskFiles = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :taskId];

        subtaskData = [SELECT Id,Name,K1_PLM__Status__c, Total_number_of_days__c, K1_PLM__User__c,K1_PLM__End_Date__c, K1_PLM__Date__c,Completion__c
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
            milestoneStruct.iconName ='standard:account';
           
            milestoneStruct.Level = 'Milestone';
            milestoneStruct.colorStyle= 'color:black';
            milestoneStruct.Duration = milestone.K1_PLM__Total_Working_Days__c;
            milestoneStruct.Stage = milestone.K1_PLM__Status__c;
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
            // milestoneStruct.Duration = '0';
            milestoneStruct.PercentageComplete = milestone.Completion__c;
            milestoneStruct.iconName = 'utility:chevronright';
            milestoneStruct.rowStyle = 'show';
            milestoneStruct.iconStyle ='standard:account';
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
                taskStruct.colorStyle= 'color:orange';
                taskStruct.Stage = task.K1_PLM__Status__c;
                taskStruct.Duration = task.K1_PLM__Total_Working_Days__c;
                
                // taskStruct.Stage = 'Create';
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
                // taskStruct.Duration = '0';
                taskStruct.PercentageComplete = task.Completion__c;
                taskStruct.iconName = 'utility:chevronright';
                taskStruct.rowStyle = 'hidden';
                taskStruct.iconStyle ='';
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
                    subTaskStruct.colorStyle= 'color:green';
                    // subTaskStruct.Stage = 'Create';
                    subTaskStruct.Stage = subtask.K1_PLM__Status__c;
                    subTaskStruct.Duration = subtask.Total_number_of_days__c;
                    
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
                    // subTaskStruct.Duration = '0';
                    subTaskStruct.PercentageComplete = task.Completion__c;
                    // subTaskStruct.iconName = 'utility:chevronright';
                    subTaskStruct.iconName = '';
                    subTaskStruct.rowStyle = 'hidden';
                    subTaskStruct.iconStyle ='';
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
//search function






@AuraEnabled(cacheable=true)   
public static List<SSObjectResult> searchAssignee(Id currentprojectId, String searchKey){
   
    List<SSObjectResult> newmilesList = new List<SSObjectResult>();
    // List<SSObjectResult1> newtasksList = new List<SSObjectResult1>();
    List<K1_PLM__Milestone__c> milesList = new List<K1_PLM__Milestone__c>();
    List<K1_PLM__Task__c> tasksList = new List<K1_PLM__Task__c>(); 
    List<K1_PLM__Sub_task__c> subtasksList = new List<K1_PLM__Sub_task__c>();                               
    
    if ( searchKey != null && searchKey != '' ) {
        String key = '%' + searchKey + '%';
        // if(Schema.sObjectType.User.isAccessible() && Schema.sObjectType.User.fields.Name.isAccessible()&&Schema.sObjectType.UserRole.fields.Name.isAccessible()){
            milesList = [SELECT Id, Name
            FROM K1_PLM__Milestone__c
            WHERE K1_PLM__Project__c = :currentprojectId AND (Name LIKE :key)];
            // milesList = [SELECT Id, Name, K1_PLM__Total_Working_Days__c, K1_PLM__Status__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c,Completion__c
            // FROM K1_PLM__Milestone__c
            // WHERE K1_PLM__Project__c = :currentprojectId AND (Name LIKE :key)];
        system.debug(milesList);
        // }
        list<id> mileid = new list<id>();
        for(K1_PLM__Milestone__c mile:milesList){
            mileid.add(mile.Id);
        }
        system.debug(mileid);

        tasksList = [SELECT Id,Name FROM K1_PLM__Task__c
        WHERE K1_PLM__Milestone__c IN :mileid AND (Name LIKE :key)] ;   
        system.debug(tasksList);
        
        // tasksList = [SELECT Id,Name,K1_PLM__Status__c, K1_PLM__Total_Working_Days__c, K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c,Completion__c FROM K1_PLM__Task__c
        // WHERE K1_PLM__Milestone__c IN :mileid AND (Name LIKE :key)] ;   
        // system.debug(tasksList);
        

        List<Id> taskid = new List<Id>();
        for(K1_PLM__Task__c task:tasksList)
        {
            taskid.add(task.Id);
        }
        subtasksList = [SELECT Id,Name
        FROM K1_PLM__Sub_task__c
        WHERE K1_PLM__Task__c IN :taskid AND (Name LIKE : key) ];

        // subtasksList = [SELECT Id,Name,Total_number_of_days__c,K1_PLM__Status__c,K1_PLM__User__c,K1_PLM__End_Date__c, K1_PLM__Date__c,Completion__c
        // FROM K1_PLM__Sub_task__c
        // WHERE K1_PLM__Task__c IN :taskid AND (Name LIKE : key OR K1_PLM__Status__c LIKE :Key) ];

        system.debug(subtasksList);
    }   
            
    for(K1_PLM__Milestone__c userl:milesList)
    {
       Id RecordId = userl.Id;
       String Name = userl.Name;           
    //    String Status = userl.K1_PLM__Status__c;
    //    String Assignee = userl.K1_PLM__Assignee__c;
    //    Date EndDate = userl.K1_PLM__End_Date__c;
    //    Date StartDate = userl.K1_PLM__Start_Date__c;
    //    Decimal Duration = userl.K1_PLM__Total_Working_Days__c;
    //    String PercentageComplete = userl.Completion__c;
    newmilesList.add(new SSObjectResult(RecordId,Name));
    //    newmilesList.add(new SSObjectResult(RecordId,Name,Status,Assignee,EndDate,StartDate,Duration,PercentageComplete));
    }
   
            for(K1_PLM__Task__c userl1:tasksList)
    {
       Id RecordId = userl1.Id;
       String Name = userl1.Name;           
    //    String Status = userl1.K1_PLM__Status__c;
    //    String Assignee = userl1.K1_PLM__User__c;
    //    Date StartDate = userl1.K1_PLM__Date__c;
    //    Date EndDate = userl1.K1_PLM__End_Date__c;
    //    Decimal Duration = userl1.K1_PLM__Total_Working_Days__c;
    //    String PercentageComplete = userl1.Completion__c;
   
    newmilesList.add(new SSObjectResult(RecordId,Name));
    //  newmilesList.add(new SSObjectResult(RecordId,Name,Status,Assignee,StartDate,EndDate,Duration,PercentageComplete));
    }
    for(K1_PLM__Sub_task__c userl2:subtasksList)
    {
       Id RecordId = userl2.Id;
       String Name = userl2.Name;           
    //    String Status = userl2.K1_PLM__Status__c;
    //   String Assignee = userl2.K1_PLM__User__c;
    //    Date EndDate = userl2.K1_PLM__End_Date__c;
    //   Date StartDate = userl2.K1_PLM__Date__c;
    //   Decimal Duration = userl2.Total_number_of_days__c;
    //   String PercentageComplete = userl2.Completion__c;
    newmilesList.add(new SSObjectResult(RecordId,Name));
    //    newmilesList.add(new SSObjectResult(RecordId,Name,Status,Assignee,EndDate,StartDate,Duration,PercentageComplete));
    }
   
    return newmilesList;
}

public class SSObjectResult 
{
    @AuraEnabled
    public Id Id;
    @AuraEnabled
    public String Name;
    // @AuraEnabled
    // public String Status;
    // @AuraEnabled
    // public String Assignee;
    //   @AuraEnabled
    // public Date EndDate;
    // @AuraEnabled
    // public Date StartDate;
    // // @AuraEnabled
    // // public Date date1;
    // @AuraEnabled
    // public Decimal Duration;
    // @AuraEnabled
    // public String PercentageComplete;
    
   
    
    // public SSObJectResult(Id Id,String NameTemp, String StatusTemp,String AssigneeTemp,Date EnddateTemp,Date StartdateTemp,Decimal DurationTemp,String PercentageCompleteTemp) {
    //     Id = Id;
    public SSObJectResult(Id Id,String NameTemp) {
        Id = Id;
        Name = NameTemp;
        // Status = StatusTemp;
        // Assignee =AssigneeTemp;
        // EndDate =EnddateTemp;
        // StartDate =StartdateTemp;
        // Duration =DurationTemp;
        // PercentageComplete =PercentageCompleteTemp;
        
    }
}
  

    // @AuraEnabled(cacheable=true)   
    // public static List<SSObjectResult> searchAssignee(Id currentprojectId,Id mileId, String searchKey){
       
    //     List<SSObjectResult> newmilesList = new List<SSObjectResult>();
    //     // List<SSObjectResult1> newtasksList = new List<SSObjectResult1>();
    //     List<K1_PLM__Milestone__c> milesList = new List<K1_PLM__Milestone__c>();
    //     List<K1_PLM__Task__c> tasksList = new List<K1_PLM__Task__c>();                               
        
    //     if ( searchKey != null && searchKey != '' ) {
    //         String key = '%' + searchKey + '%';
    //         // if(Schema.sObjectType.User.isAccessible() && Schema.sObjectType.User.fields.Name.isAccessible()&&Schema.sObjectType.UserRole.fields.Name.isAccessible()){
    //             milesList = [SELECT Id, Name, K1_PLM__Status__c, K1_PLM__Assignee__c, K1_PLM__End_Date__c, K1_PLM__Start_Date__c
    //             FROM K1_PLM__Milestone__c
    //             WHERE K1_PLM__Project__c = :currentprojectId AND (Name LIKE :key)];
    //         // }
    //         tasksList = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c FROM K1_PLM__Task__c
    //         WHERE K1_PLM__Milestone__c = :mileId];   
    
    //     }              
    //     for(K1_PLM__Milestone__c userl:milesList)
    //     {
    //        Id Id = userl.Id;
    //        String Name = userl.Name;           
    //        String Status = userl.K1_PLM__Status__c;
    //        String Assignee = userl.K1_PLM__Assignee__c;
    //        Date EndDate = userl.K1_PLM__End_Date__c;
    //        Date StartDate = userl.K1_PLM__Start_Date__c;
    //      // String Assignee = userl.Assignee;
       
    //        newmilesList.add(new SSObjectResult(Id,Name,Status,Assignee,EndDate,StartDate));
    //     }
       
    //             for(K1_PLM__Task__c userl1:tasksList)
    //     {
    //        Id Id = userl1.Id;
    //        String Name = userl1.Name;           
    //        String Status = userl1.K1_PLM__Status__c;
    //        String Assignee = userl1.K1_PLM__User__c;
    //        Date StartDate = userl1.K1_PLM__Date__c;
    //        Date EndDate = userl1.K1_PLM__End_Date__c;
    //      // String Assignee = userl.Assignee;
       
    //      newmilesList.add(new SSObjectResult(Id,Name,Status,Assignee,EndDate,StartDate));
    //     }
    //     return newmilesList;
    // }

    // public class SSObjectResult 
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
       
        
    //     public SSObJectResult(Id Id,String NameTemp, String StatusTemp,String AssigneeTemp,Date EnddateTemp,Date StartdateTemp) {
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

    // @AuraEnabled(cacheable=true)
    // public static Integer getCount() {
    //     return [select count() from K1_PLM__Milestone__c];
    // }


//insert sub row

// @AuraEnabled
//     public static void insertsubrow( Id taskid, Id mileId){
//         List<K1_PLM__Task__c> updateParentId= new List<K1_PLM__Task__c>();
      
//          updateParentId = [SELECT Id,Name FROM K1_PLM__Task__c WHERE K1_PLM__Milestone__c  = :mileId];
//           //AND K1_PLM__Milestone__c = :mileId
//          K1_PLM__Task__c mbomAssoObj = new K1_PLM__Task__c();
                 
//          mbomAssoObj = [SELECT Id,Name  
//         FROM K1_PLM__Task__c WHERE Id =: mileId];
              
//         K1_PLM__Task__c obj = new K1_PLM__Task__c(
//             // Name=BOMPartName,
//             Id=mileId
//             );
//         insert obj;
           
//         System.debug(obj);
//         K1_PLM__Task__c mbomAssociation = new K1_PLM__Task__c();
       
//          mbomAssociation = [SELECT Id,Name FROM K1_PLM__Task__c WHERE Id =: obj.Id];
       
    
//         mbomAssociation.Id = obj.Id;
   
       
//         update mbomAssociation;

//         List<K1_PLM__Task__c> parentIdToUpdate = new List<K1_PLM__Task__c>();

// 		System.debug('New Parent Id '+mbomAssociation.Id);        
//         for(K1_PLM__Task__c parentIdU : updateParentId){
          
//             parentIdU.Id = obj.Id;
         
            
//             parentIdToUpdate.add(parentIdU);
//         }
        
//         update parentIdToUpdate;
      
//         for(Integer i=0; i<parentIdToUpdate.size(); i++){
//             System.debug('Data '+parentIdToUpdate[i]);
//         }
//         System.debug('updated '+mbomAssociation);
//     }
    
//     // taskData = [SELECT Id,Name,K1_PLM__Status__c,K1_PLM__User__c, K1_PLM__Date__c, K1_PLM__End_Date__c
//     // FROM K1_PLM__Task__c
//     // WHERE K1_PLM__Milestone__c IN :mileId ];
	
//     @AuraEnabled
//     public static void insertsubtask( Id taskid){
//         List<K1_PLM__Sub_task__c> updateParentId= new List<K1_PLM__Sub_task__c>();
//         // List<K1_PLM__Sub_task__c> updateParentId1= new List<K1_PLM__Sub_task__c>();
      
//          updateParentId = [SELECT Id,Name FROM K1_PLM__Sub_task__c WHERE K1_PLM__Task__c  = :taskid];
//           //AND K1_PLM__Milestone__c = :mileId
//           K1_PLM__Sub_task__c mbomAssoObj = new K1_PLM__Sub_task__c();
                 
//          mbomAssoObj = [SELECT Id,Name  
//         FROM K1_PLM__Sub_task__c WHERE Id =: taskid];
              
//         K1_PLM__Sub_task__c obj = new K1_PLM__Sub_task__c(
//             // Name=BOMPartName,
//             Id=taskid
//             );
//         insert obj;
           
//         System.debug(obj);
//         K1_PLM__Sub_task__c mbomAssociation = new K1_PLM__Sub_task__c();
       
//          mbomAssociation = [SELECT Id,Name FROM K1_PLM__Sub_task__c WHERE Id =: obj.Id];
       
    
//         mbomAssociation.Id = obj.Id;
   
       
//         update mbomAssociation;

    //     List<K1_PLM__Sub_task__c> parentIdToUpdate = new List<K1_PLM__Sub_task__c>();

	// 	System.debug('New Parent Id '+mbomAssociation.Id);        
    //     for(K1_PLM__Sub_task__c parentIdU : updateParentId){
          
    //         parentIdU.Id = obj.Id;
         
            
    //         parentIdToUpdate.add(parentIdU);
    //     }
        
    //     update parentIdToUpdate;
      
    //     for(Integer i=0; i<parentIdToUpdate.size(); i++){
    //         System.debug('Data '+parentIdToUpdate[i]);
    //     }
    //     System.debug('updated '+mbomAssociation);
    // }
    
}



