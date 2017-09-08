import { Component, OnInit } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import { DomSanitizer } from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-video-source',
  templateUrl: './video-source.component.html',
  styleUrls: ['./video-source.component.css']
})
export class VideoSourceComponent implements OnInit {

  constructor(private mservice:MainService,public globals:Globals,public sanitizer: DomSanitizer) { }
  public homeVideo:any='';
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
  } 
  private getHomeDetail(){
    let _thime=this.globals.globalTheme;
    this.mservice.getThemeDetails(_thime)
    .subscribe(themedata =>this.loadHomeDetails(themedata));
  }

}