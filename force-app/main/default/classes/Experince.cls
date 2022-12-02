public with sharing class Experince {
    @AuraEnabled(cacheable=true)
    public static void Experienceinfo(String companyName, Date fromDate, Date toDate, Boolean workingStatus)
    {
        try {
            Company_Details__c cinfo = new Company_Details__c(Company_Name__c = companyName, From_Date__c = fromDate, To_Date__c = toDate, Currently_Working_Here__c = workingStatus);
            insert cinfo;
        } catch (Exception ex) {
            
        }
    }
    
}
