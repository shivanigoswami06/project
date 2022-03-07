public with sharing class projecthpanel {
    @AuraEnabled(cacheable=true)
    public static String CreatedbyName(Id projid)
    {
        K1_PLM__Project__c pro = new K1_PLM__Project__c ();
      if (Schema.sObjectType.K1_PLM__Project__c.isAccessible()){
         pro= [SELECT Id,CreatedById  FROM K1_PLM__Project__c where Id=:projid];
      }
      
      User userRec = new User();
      if (Schema.sObjectType.User.fields.Name.isAccessible()&&Schema.sObjectType.User.isAccessible()){
    
         userRec=[select Id,Name from User where Id=:pro.CreatedById];
      }
        String userName=userRec.Name;
      
        return userName;

    }
}
