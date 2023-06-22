import { LightningElement,wire ,api} from 'lwc';
import getmyLeaveReq from '@salesforce/apex/LeaveRequestController.getmyLeaveReq'
import {refreshApex} from '@salesforce/apex'
import Id from '@salesforce/user/Id'
const COLUMNS = [
    {label: 'Request Id', fieldName: 'Name' ,cellAttributes:{class:{fieldName :'cellClass'}}},
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

export default class LeaveMyLeaves extends LightningElement {
    currentUserId = Id
    columns = COLUMNS
    myLeaveData
    myLeaveRequests=[]
    error
    showSpinner=true
    showModalComponent=false
    objectApiName ='Leave_Request__c'
    recordId=''


    submitHandler(event){
        console.log('inside submit');``
        //event.preventDefault();
        //this.currentUserId
        event.preventDefault();       // stop the form from submitting
        //const fields = [...event.detail.fields];
        const fields = event.detail.fields;
        if(new Date(fields.From_Date__c) > new Date(fields.To_Date__c)){
            this.template.querySelector('c-toast-component').showToast('from date must be samaller than to date','error')
        }else if(new Date() > new Date(fields.From_Date__c)){
            this.template.querySelector('c-toast-component').showToast('from date must be in future','error')
        }else{
            console.log('prevent defaulkt'+this.currentUserId)
            fields.User__c = this.currentUserId;
            console.log('prevent fields'+fields)
            this.template.querySelector('lightning-record-edit-form').submit(fields);
            //or we can usw lwc:refs
            //this.refs.refrenceNnme.submit(fields);
        }
           // fields.User__c = this.currentUserId;
           // this.template.querySelector('lightning-record-edit-form').submit(fields);
        

    }
    createLeaveRecord(){
        console.log('inside createLeaveRecord');
        this.recordId=''
        this.showModalComponent=true
    }
    @api
    refresh(){
        console.log('refreh called')
        return refreshApex(this.myLeaveData);
    }
    handleRowAction(event){
        console.log('inside handle row action')
        //console.log('row id==>'+ event.detail.row.Id)
        this.showModalComponent = true
        this.recordId = event.detail.row.Id
    }
    successHandler(event){
        console.log('successHandler')
        this.showModalComponent = false
        this.template.querySelector('c-toast-component').showToast('Leave Record Edited Successfully','success')
        this.recordId=''
        this.refresh()
        const customRefEvent = new CustomEvent('eventfrommyleaves');
        this.dispatchEvent(customRefEvent);
    }

    get dataNotFound(){
        return this.myLeaveRequests.length == 0 ? true :false
    }
    //showMyLeaveData=false
    @wire(getmyLeaveReq)
    getmyLeaveReq(result){
        this.myLeaveData=result
        if(result.data){
            console.log('getmyLeaveReq--',JSON.stringify(result.data));
            this.myLeaveRequests = result.data.map(a=>(
                {
                    ...a,
                    cellClass: a.Status__c== 'Approved' ? 'slds-theme_success' :a.Status__c=='Rejected' ? 'slds-theme_warning' : '',
                    isEditDisable:a.Status__c != 'Pending'
                }
            ));
            this.showSpinner =false
            //this.showMyLeaveData=true
        }else if(result.error){
            console.error('error');
            this.error=result.error;
        }
    }

    closeModalComp(event){
        console.log('close modal');
        this.showModalComponent = false
    }
}