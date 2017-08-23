import { Component,Input, OnInit, OnDestroy,Inject } from '@angular/core';
import {MainService} from '../main.service';
import {Globals} from '../globals';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor(private mservice:MainService,public globals:Globals) { }
  private galleries:object;
  onThemeSetEvent$Subscription: Subscription;

  ngOnInit() {
    if(this.globals.globalRestaurantId){
      this.getGallery();
    } else {
      if(!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.getGallery();
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

  private getGallery() : void {
    let _currentRestId=this.globals.globalRestaurantId;
    this.mservice.getRestaurantGallery(_currentRestId)
      .subscribe(data =>this.setGalleryImage(data));
  }

  setGalleryImage(d) : any{
    let restaurant_images = d.restaurant_images.images;
    let images_path = d.restaurant_images.base_url+this.globals.currentRestaurantDetail.res_code+"/";
    let gallery = []; 
    for(let i=1;i<=restaurant_images.length;i++){
      if(i<11){
        gallery.push({id:i,imgurl:images_path+restaurant_images[i].image,title:restaurant_images[i].title});
       }
    }
    this.galleries = gallery;     
  }
}
