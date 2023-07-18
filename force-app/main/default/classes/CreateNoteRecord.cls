public with sharing class CreateNoteRecord {
    @AuraEnabled
    public static boolean createNote(String title , String desciption){
        try {
            if(!String.isBlank(title)){
                My_Notes__c note = new My_Notes__c();
                note.Note_Description__c = desciption;
                note.Name = title;
                insert note;
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<My_Notes__c > getNotes(){
        try {
            return [select id ,Note_Description__c,Name,CreatedDate From My_Notes__c order by CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static boolean updateNote(String recId ,String title,string description){
        try {
            if(String.isBlank(recId)){
                My_Notes__c noterec= [select id ,Note_Description__c,Name,CreatedDate From My_Notes__c where id=:recId];
                noterec.Name=title;
                noterec.Note_Description__c = description;
                update noterec;
                return true;
            }
            return false;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }
    @AuraEnabled
    public static boolean callApexToDelete(string recId){
        try {
            if(!String.isBlank(recId)){
                My_Notes__c noterec= [select id ,Note_Description__c,Name,CreatedDate From My_Notes__c where id=:recId];
            delete noterec;
            return true;
            }
            return false;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}