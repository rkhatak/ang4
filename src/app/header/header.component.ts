import {Component,Inject,OnInit,OnDestroy} from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'header-app',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit,OnDestroy {
headermenu:any='';
public is_login:boolean=false;
public headerLogo:string=''; 
onThemeSetEvent$Subscription: Subscription;   
constructor(public globals:Globals,private mservice:MainService,@Inject(DOCUMENT) private document: any) {}

 ngOnInit() {
     if(this.globals.globalTheme){
      this.loadTheme();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.loadTheme();
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