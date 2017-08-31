import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer,SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor(private mservice: MainService, public globals: Globals, public sanitizer: DomSanitizer) { }
  private galleries: object;
  onThemeSetEvent$Subscription: Subscription;
  public pageNumber : number = 0;
    public pageCount : number = 0;
  public pages = [
        {title: "Page 1", color: "red"},
        {title: "Page 2", color: "green"}
    ];
  ngOnInit() {
    if (this.globals.globalRestaurantId) {
      this.getGallery();
    } else {
      if (!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.getGallery();
          }
        );
      }
    }
  }


  ngOnDestroy() {
    if (this.onThemeSetEvent$Subscription) {
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }

  private getGallery(): void {
    let _currentRestId = this.globals.globalRestaurantId;
    this.mservice.getRestaurantGallery(_currentRestId)
      .subscribe(data => this.setGalleryImage(data));
  }

  setGalleryImage(d): any {
    let self = this;
    let restaurant_images = d.restaurant_images.images;
    let images_path = d.restaurant_images.base_url + this.globals.currentRestaurantDetail.res_code + "/";
    let gallery = [];
    for (let i = 1; i <= restaurant_images.length; i++) {
      if (i < 11) {
        let sImage = images_path + restaurant_images[i].image;
        gallery.push({
          id: i, imgurl:sImage,
          title: restaurant_images[i].title
        });
      }
    }
    this.galleries = gallery;
  }

  backImage (image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image}) no-repeat center center`); 
  }
}
