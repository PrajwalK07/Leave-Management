import { LightningElement } from 'lwc';

export default class LeaveTabsContainer extends LightningElement {
    handleeventFromMyLeaves(event){
        console.log('event from my leave')
        //call api method from all leaves
        this.refs.allLeaveComp.refresh()
    }

    handleeventFromAllLeaves(event){
        console.log('event from alll leave')
        this.refs.myLeaveComp.refresh()
    }
}