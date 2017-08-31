import { Component, Inject, Renderer } from '@angular/core';
import { MainService } from './main.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Globals } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tokenVarify: any = '';
  thememenu: any = '';
  constructor(public globals: Globals, private mservice: MainService, @Inject(DOCUMENT) private document: any, private renderer: Renderer) {
    this.tokenVarify = false;
  }

  ngOnInit() {
    let authToken = this.mservice.getStorage('oauth.token');
    if (authToken == null) {
      this.postToken();
    } else {
      this.mservice.getToken()
        .subscribe(data => this.flowVerified(data));
    }
  }

  postToken() {
    this.mservice.postToken()
      .subscribe(data => this.flowPostVerified(data.token));
  }

  flowVerified(data) {
    if (data.valid) {
       this.tokenVarify = true;
       this.mservice.getTheme()
        .subscribe(data => this.loadTheme(data));
    } else {
      this.postToken();
      this.tokenVarify = false;
    }
  }

  loadTheme(data) {
    let _host = document.location.host;
    let _thime = data[_host].theme;
    let _restaurant = data[_host].restaurant_id;
    //assign theme & restaurant id to global 
    this.globals.globalRestaurantId = _restaurant;
    this.globals.globalTheme = _thime;
    let _themeCss = 'assets/template/themes/' + _thime + '/css/app.css';
    this.mservice.getThemeDetails(_thime)
      .subscribe(themedata => this.thememenu = themedata);
    this.mservice.getRestaurantDetails(_restaurant)
      .subscribe(
      (resdata) => this.setRestaurantDetails(resdata),
      (err) => this.themeNotFound());

    this.document.getElementById('appCSS').setAttribute("href", _themeCss);
  }

  themeNotFound() {
    this.tokenVarify = false;
  }

  setRestaurantDetails(d) {
    this.globals.currentRestaurantDetail = d;
    this.globals.onThemeSet();
  }

  flowPostVerified(token) {
    this.mservice.setStorage('oauth.token', token);
    this.tokenVarify = true;
    this.mservice.getTheme()
      .subscribe(data => this.loadTheme(data));
  }


}