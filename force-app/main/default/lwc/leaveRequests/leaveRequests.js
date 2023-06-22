import { LightningElement, wire,api} from 'lwc';
import {refreshApex} from '@salesforce/apex'
import Id from '@salesforce/user/Id'
import getAllLeaveReq from '@salesforce/apex/LeaveRequestController.getAllLeaveReq'
const COLUMNS = [
    {label: 'Request Id', fieldName: 'Name' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'Requester', fieldName: 'User__r.Name' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'Leave Type', fieldName: 'Leave_Type__c' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'From Date', fieldName: 'From_Date__c' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'To Date', fieldName: 'To_Date__c' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'Reason', fieldName: 'Reason__c' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'Status', fieldName: 'Status__c' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {label: 'Manager Comment', fieldName: 'Manager_Comment__c' ,cellAttributes:{class:{fieldName :'cellClass'}}},
    {
        type: "button",
        typeAttributes:{
            label : 'Edit',
            name : 'Edit',
            title : 'Edit',
            value : 'Edit',
            disabled: {fieldName : 'isEditDisable'}

        },cellAttributes:{class:{fieldName :'cellClass'}}
    }
]
export default class LeaveRequests extends LightningElement {
    leaveRequestData
    columns= COLUMNS
    allLeaveData=[]
    showModalComponent=false
    showSpinner=true
    recordId=''
    objectApiName ='Leave_Request__c'
    @wire(getAllLeaveReq)
    getAllLeaveReq(result){
        this.leaveRequestData = result
        if(result.data){
            console.log('all data if ur manager');
            this.allLeaveData=result.data.map(a=>(
                {
                    ...a,
                    cellClass: a.Status__c== 'Approved' ? 'slds-theme_success' :a.Status__c=='Rejected' ? 'slds-theme_warning' : '',
                    isEditDisable:a.Status__c != 'Pending'
                }
            )

            )
            this.showSpinner=false
        }else if(result.error){
            console.error('error manager');

        }
    }

    get dataNotFound(){
        return this.allLeaveData.length == 0 ? true :false
    }

    handleRowAction(event){
        console.log('inside handle row action')
        //console.log('row id==>'+ event.detail.row.Id)
        this.showModalComponent = true
        this.recordId = event.detail.row.Id
    }
    closeModalComp(event){
        this.showModalComponent = false
    }
    successHandler(event){
        console.log('showToast')
        this.showModalComponent = false
        this.template.querySelector('c-toast-component').showToast('Leave Record Edited Successfully','success')
        this.recordId=''
        this.refresh()
        const customRefEvent = new CustomEvent('eventfromallleaves');
        this.dispatchEvent(customRefEvent);
    }
    @api
    refresh(){
        console.log('refreh called')
        return refreshApex(this.leaveRequestData);
    }
}