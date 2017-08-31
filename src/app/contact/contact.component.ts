import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer,SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy {

  constructor(private mservice: MainService, public globals: Globals, public sanitizer: DomSanitizer) { }
  private restaurantAddress: object;
  public multipleAddress:boolean=false;
  public _currentRestaurant:any;
  private lat:any;
  private long:any;
  onThemeSetEvent$Subscription: Subscription;

 ngOnInit() {
    if(this.globals.globalTheme){
      this.getContact();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.getContact();
        }
      );
    }
    }

  }
   ngOnDestroy() {
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }

  private getContact(): void {
    let _theme = this.globals.globalTheme;
    this._currentRestaurant=this.globals.currentRestaurantDetail;
    this.lat=parseFloat(this._currentRestaurant.latitude);
    this.long=parseFloat(this._currentRestaurant.longitude);
    console.log(this.lat+'....'+this.long);
    this.mservice.getChainRestaurant(_theme)
      .subscribe(
      (data) =>this.setContacts(data),
      (err)=>this.getResError());
  }

  private getResError() :void{
     this.multipleAddress=false;
  }
  private setContacts(d):void{
    this.multipleAddress=true;
    this.restaurantAddress=d;
  }

}
