import { LightningElement ,wire} from 'lwc';
import Id from '@salesforce/user/Id'
import getLeaveData from '@salesforce/apex/LeaveMainContainerController.getLeaveData'

export default class LeaveMainContainer extends LightningElement {
    userId = Id
    unpaidData
    plannedData
    sickData
    
    //------------------
    plannedDataConsumed=''
    plannedDataRem=''
    plannedDataAllocated=''
    //-----------------
    sickDataConsumed=''
    sickDataRem=''
    sickDataAllocated=''
    //-------------------
    unpaidDataConsumed=''
    unpaidDataRem=''
    unpaidDataAllocated=''

    @wire(getLeaveData , {userId : '$userId'})
    getLeaveData(result){
        if(result.data){
            console.log('Data in my leaves-'+JSON.stringify(result.data))
            result.data.forEach(item => {
                if(item.Leave_Type__c == 'Planned Leave'){
                    this.plannedData=item
                    this.plannedDataConsumed = item.Total_Consumed__c;
                    this.plannedDataAllocated = item.Total_Allocated__c;
                    this.plannedDataRem = item.Remaining_Leaves__c;
                }
                if(item.Leave_Type__c =='Sick Leave'){
                    this.sickData = item;
                    this.sickDataConsumed=item.Total_Consumed__c;
                    this.sickDataRem=item.Total_Allocated__c;
                    this.sickDataAllocated=item.Remaining_Leaves__c;

                }
                if(item.Leave_Type__c =='Unpaid Leave'){
                    this.unpaidData = item;
                    this.unpaidDataConsumed=item.Total_Consumed__c;
                    this.unpaidDataRem=item.Remaining_Leaves__c;
                    this.unpaidDataAllocated=item.Total_Allocated__c;
                }

            }
        )
            
            
            
        }else if(result.error){
            console.log('error'+JSON.stringify(result.error) )
        }
    }

}