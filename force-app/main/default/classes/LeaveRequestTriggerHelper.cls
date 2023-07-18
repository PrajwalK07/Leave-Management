public class LeaveRequestTriggerHelper {
    public static final String APPROVED = 'Approved';
    
    public static void updateLeaveCount(list<Leave_Request__c> newLeaveReqList , Map<id ,Leave_Request__c> oldMap){
        set<id> userIdSet = new set<id>();
        list<User_Leaves__c> leaveListToUpdate = new list<User_Leaves__c>();
        
        for(Leave_Request__c leaveRec : newLeaveReqList){
            if(leaveRec.Status__c == APPROVED && leaveRec.Status__c != oldMap.get(leaveRec.id).Status__c){
                userIdSet.add(leaveRec.User__c);
            }
            
        }
        
        Map<id,list<User_Leaves__c>> userVsUserLeaveMap = new Map<id,list<User_Leaves__c>>();
        for(User uRec : [select Id, (select id,Leave_Type__c, Name, Remaining_Leaves__c, Total_Allocated__c, Total_Consumed__c, User__c from User_Leaves__r) from user where id IN:userIdSet]){
            userVsUserLeaveMap.put(urec.id,urec.User_Leaves__r);
        }
        system.debug('userVsUserLeaveMap->'+userVsUserLeaveMap.size());
        for(Leave_Request__c leaveRec : newLeaveReqList){
            Integer noOfDays =0; 
            if(userVsUserLeaveMap.containsKey(leaveRec.User__c)){
                for(User_Leaves__c ul: userVsUserLeaveMap.get(leaveRec.User__c)){
                    noOfDays = leaveRec.From_Date__c.daysBetween(leaveRec.To_Date__c); 
                    system.debug('noOfDays->'+noOfDays);
                    if(leaveRec.Leave_Type__c != ul.Leave_Type__c){
                        continue;
                    }else{
                        system.debug('Inside else leave type found');
                        if(ul.Remaining_Leaves__c > 0 && (ul.Remaining_Leaves__c > noOfDays)){
                            system.debug('condition stisfy');
                            ul.Total_Consumed__c = ul.Total_Consumed__c +noOfDays ;
                            leaveListToUpdate.add(ul);
                        }else{
                            leaverec.addError('User have '+ ul.Remaining_Leaves__c + ' days leaves remaining. And requesting for '+ noOfDays+ ' days.');
                        }
                    }
                }
            }
            
        }
        if(!leaveListToUpdate.isEmpty()){
            system.debug('updating');
            update leaveListToUpdate;
        }
    }
}