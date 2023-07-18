public class LeaveMainContainerController {
    @AuraEnabled(cacheable=true)
    public static list<User_Leaves__c> getLeaveData(string userId){
        system.debug('getLeaveData');
        return [select id,Total_Consumed__c,Total_Allocated__c,Remaining_Leaves__c,Leave_Type__c , User__c from User_Leaves__c where User__c ='0052w00000H9IAWAA3'];
    }
}