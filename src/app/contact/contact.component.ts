import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';
import { DomSanitizer,SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var google: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit,OnDestroy {

  constructor( @Inject(DOCUMENT) private document: any,private mservice: MainService, public globals: Globals, public sanitizer: DomSanitizer) { }
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
    this.renderMap(this._currentRestaurant);
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

  renderMap(res) {
            var myLatLong = new google.maps.LatLng(res.latitude, res.longitude),
                    mapOptions = {
                        zoom: 17,
                        draggable: true,
                        scrollwheel: true,
                        disableDefaultUI: true,
                        zoomControl: true,
                        disableDoubleClickZoom: true,
                        center: myLatLong,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
            var map = new google.maps.Map(this.document.getElementById('viewmap'), mapOptions);
            var marker = new google.maps.Marker({
                position: myLatLong,
                title: res.name
            });
            marker.setMap(map);
            var infowindow = new google.maps.InfoWindow({
                content: '<div><strong>' + res.name + '</strong><br>' + res.address + '</div>'
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
            setTimeout(function(){
                map.setCenter(myLatLong);
                infowindow.open(map, marker);
            },5000);
        }

}
