import {Component,Inject} from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: 'header-app',
    templateUrl: './header.component.html',
})
export class HeaderComponent {
headermenu:any='';
public is_login:boolean=false;
public headerLogo:string='';    
constructor(public globals:Globals,private mservice:MainService,@Inject(DOCUMENT) private document: any) {}

 ngOnInit() {
   this.mservice.getTheme()
      .subscribe(data =>this.loadTheme());
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
}