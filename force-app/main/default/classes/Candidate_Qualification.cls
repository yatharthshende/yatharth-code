public class Candidate_Qualification {
    public static Candidate_Information__c CandidateInfo(String fname, string mname, string lname, string email, string phone,
                                     string pan, string address){
                                         try{
                                             Candidate_Information__c cinfo = new Candidate_Information__c (First_Name__c = fname, Middle_Name__c = mname, Last_Name__c = lname, Email__c = email,
                                                                                                        Phone__c = phone, Pan_Number__c = pan, Address__c = address);
                                         insert cinfo;
                                             Return cinfo;
                                         }
                                         catch(Exception e){
                                             throw new AuraHandledException(e.getMessage());
                                         }
                                         
                                     }
    
}