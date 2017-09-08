import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { DomSanitizer } from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private mservice:MainService,public globals:Globals,public sanitizer: DomSanitizer) { }
  public homeVideo:any='';
  public homeImage:string='';
  public homeTitle:string='';
  public homeNext:string='';
  onThemeSetEvent$Subscription: Subscription;
  public videoUrl;
  ngOnInit() {
    if(this.globals.globalTheme){
      this.getHomeDetail();
    }else{
    if(!this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
        () => {
           this.getHomeDetail();
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
  loadHomeDetails(d){
    this.homeVideo=d.home.video;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.homeVideo);
    this.homeImage=d.home.homebg;
    this.homeTitle=d.home.title;
    this.homeNext=d.home.nextpage;
  } 
  private getHomeDetail(){
    let _thime=this.globals.globalTheme;
    this.mservice.getThemeDetails(_thime)
    .subscribe(themedata =>this.loadHomeDetails(themedata));
  }

   loadVideo(){
    this.globals.dialogType="video";
    this.globals.onDialogSet();
  }

}
