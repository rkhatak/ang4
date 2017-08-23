import { Component,Input, OnInit, OnDestroy,Inject } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import {Subscription} from 'rxjs/Subscription';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  public overview:any='';
  showStory:boolean=false;
  onThemeSetEvent$Subscription: Subscription;
  constructor(private mservice:MainService,public globals:Globals,@Inject(DOCUMENT) private document: any,private pageScrollService: PageScrollService) { }

  ngOnInit() {
    if(this.globals.globalRestaurantId){
      this.getRestaurantOverview();
    } else {
      if(!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.getRestaurantOverview();
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

  getIcon(features_key) {                   
                   return "greenP_"+features_key.replace(/[- \/&]/g,'_')+"_Icon" ;               
  };

  readStory(e){
    let self=this;
    e.preventDefault();
    e.currentTarget.style.display="none";
    this.showStory =true;
    setTimeout(function(){
        let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(self.document, '#story');
        self.pageScrollService.start(pageScrollInstance);
    },500);
  }

  private getRestaurantOverview(){
    let _currentRestId=this.globals.globalRestaurantId;
    this.mservice.getRestaurantOverview(_currentRestId)
      .subscribe(overviewdata =>this.overview=overviewdata);
  }

}
