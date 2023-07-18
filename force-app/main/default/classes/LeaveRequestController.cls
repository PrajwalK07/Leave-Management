public class LeaveRequestController {

    @AuraEnabled(cacheable=true)
    public static list<Leave_Request__c> getmyLeaveReq(){
        list<Leave_Request__c> leaveList = [select id ,Name,From_Date__c,Manager_Comment__c,Reason__c,Status__c,
                                            To_Date__c ,User__c,Leave_Type__c 
                                            From Leave_Request__c
                                           	where User__c=:userInfo.getUserId() 
                                            
                                           	ORDER BY CreatedDate DESC];
        return leaveList;
    }
    
    @AuraEnabled(cacheable=true)
    public static list<Leave_Request__c> getAllLeaveReq(){
        list<Leave_Request__c> leaveList = [select Id ,Name,From_Date__c,Manager_Comment__c,Reason__c,Status__c,
                                            To_Date__c ,User__c,Leave_Type__c , User__r.ManagerId , User__r.Name
                                            From Leave_Request__c
                                           	 where User__r.ManagerId =:userInfo.getUserId() 
                                           	ORDER BY CreatedDate DESC];
        return leaveList;
    }
    
    
}