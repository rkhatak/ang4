import {Component,Inject,OnInit,OnDestroy} from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
    selector: 'header-app',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
headermenu:any='';
public is_login:boolean=false;
public headerLogo:string=''; 
onThemeSetEvent$Subscription: Subscription;
private restaurantAddress: object;
public multipleAddress:boolean=false;
public _currentRestaurant:any;
private lat:any;
private long:any;
public rootId:any;
public rootPage:any;   
constructor(private router:Router,public globals:Globals,private mservice:MainService,@Inject(DOCUMENT) private document: any) {}

 ngOnInit() {
     if(this.globals.globalTheme){
      this.loadTheme();
      this.getContact();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.loadTheme();
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
    this.mservice.getChainRestaurant(_theme)
      .subscribe(
      (data) =>this.setContacts(data),
      (err)=>this.getResError());
  }

  private getResError() :void{
     this.multipleAddress=false;
  }
  private setContacts(d):void{
    let rootId=parseInt(this.mservice.chainRes().rootId);
    let rootPage=this.mservice.chainRes().rootPage;
    this.rootPage=(rootPage)?rootPage:'home';
    if(isNaN(rootId)==true){
     this.multipleAddress=true;
     this.restaurantAddress=d;
    }else{
      this.rootId=`/${rootId}`;
    }
  }
goLocation(id,page){
let url=`/${id}/${page}`;  
this.router.navigate([url]);
location.reload();
}
goHome(){
this.router.navigate(['/home']);
location.reload();
}


//  ngDoCheck(){
//    let rootId=parseInt(this.mservice.chainRes().rootId);
//     let rootPage=this.mservice.chainRes().rootPage;
//     this.rootPage=(rootPage)?rootPage:'home';
//     if(isNaN(rootId)==false){
//      this.rootId=`/${rootId}`;
//     }
//  } 
selectLocation(){
  this.document.querySelector('.multipleAdd').classList.toggle('hide');
}
  loadTheme(){
   let _thime=this.globals.globalTheme;
   this.headerLogo=this.globals.baseThemeImage+_thime+'/images/';
    this.mservice.getThemeDetails(_thime)
      .subscribe(themedata =>this.headermenu=themedata);        
       
  }
  goResponsive(){
      this.document.querySelector('.link_mobilemenu').classList.toggle('active');
      this.document.querySelector('.dropdown_mobile').classList.toggle('active');
  }
  userRegister(){
    this.globals.dialogType="register";
    this.globals.onDialogSet();
  }
  userlogin(){
    this.globals.dialogType="login";
    this.globals.onDialogSet();
  }
}