import { Component,Input, OnInit, OnDestroy,Inject } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit,OnDestroy {
  
  constructor(private mservice:MainService,public globals:Globals) { }
  private dishes:object;
  private restaurantDeal:object;
  onThemeSetEvent$Subscription: Subscription;
  ngOnInit() {
    if(this.globals.globalRestaurantId){
      this.getMenu();
      this.getDeals();
    } else {
      if(!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.getMenu();
            this.getDeals();
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

  private getMenu(){
    let _currentRestId=this.globals.globalRestaurantId;
    this.mservice.getRestaurantMenu(_currentRestId)
      .subscribe(data =>this.dishes=data.menu);
  }
  private getDeals(){
    let _currentRestId=this.globals.globalRestaurantId;
    this.mservice.getRestaurantDeals(_currentRestId)
      .subscribe(data =>this.restaurantDeal=data);
  }

}
