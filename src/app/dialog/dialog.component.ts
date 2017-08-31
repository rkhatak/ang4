import { Component, OnInit,OnDestroy} from '@angular/core';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { MainService } from '../main.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {

  constructor(private global:Globals,private mservice: MainService) { }
  public dialogType:string='loader';
  onDialogType$Subscription: Subscription;
  ngOnInit() {
    if (!this.onDialogType$Subscription) {
    this.global.onDialogType.subscribe(()=>{
      this.dialogType=this.global.dialogType;
      this.mservice.showPopUp();
    })
  }  
  }
  closeDialog(){
    this.mservice.hidePopUp();
  }
  ngOnDestroy() {
    if (this.onDialogType$Subscription) {
      this.onDialogType$Subscription.unsubscribe();
    }
  }

}
