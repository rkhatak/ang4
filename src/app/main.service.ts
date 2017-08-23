import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions,Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/do';
import {Globals} from './globals';

@Injectable()
export class MainService {
 constructor(private _http: Http,public globals:Globals){}
   postToken(): Observable<any> {
     let self=this;
     let apiUrl=self.globals.apiBaseUrl+'auth/token';
      let headers = new Headers();
             headers.append('content-type', 'application/json');
             let options = new RequestOptions({ headers: headers });
             let data=JSON.stringify({});

      return self._http.post(apiUrl,data,options) 
      .map((response: Response) => <any> response.json());
   }

   getApiUrl = function (myUrl) {
            let self=this;
            if (myUrl.indexOf('token=') == -1) {
                myUrl += ((myUrl.indexOf('?') == -1) ? '?' : '&');
                myUrl += "token=" + this.getStorage('oauth.token');
            }
            return self.globals.apiBaseUrl + myUrl;
           
   };

   getToken(): Observable<any> {
     let self=this;
     let authToken = this.getStorage('oauth.token');
     let apiUrl=self.globals.apiBaseUrl+'auth/token/'+authToken;
      return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }

   getTheme(){
     let themeUrl='assets/theme.require.json'
     let self=this;
     return self._http.get(themeUrl) 
      .map((response: Response) => <any> response.json())
      .do(data => console.log(JSON.stringify(data)));
   }

   getRestaurantDetails(resid){
      let self=this;
      let apiUrl=self.getApiUrl('restaurant/details/'+resid);     
     return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }

   getRestaurantOverview(resid){
      let self=this;
      let apiUrl=self.getApiUrl('restaurant/overview/'+resid);     
     return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }
   getRestaurantMenu(resid){
      let self=this;
      let apiUrl=self.getApiUrl('restaurant/menu/'+resid);     
     return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }
   getRestaurantDeals(resid){
      let self=this;
      let apiUrl=self.getApiUrl('restaurant/deals-coupons/'+resid);     
     return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }
   getRestaurantGallery(resid){
      let self=this;
      let apiUrl=self.getApiUrl('restaurant/gallery/'+resid);     
     return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }
   getRestaurantStory(resid){
      let self=this;
      let apiUrl=self.getApiUrl('restaurant/story/'+resid);     
     return self._http.get(apiUrl) 
      .map((response: Response) => <any> response.json());
   }

   getThemeDetails(theme){
     let themeUrl='assets/data/'+theme+'.json'
     let self=this;
     return self._http.get(themeUrl) 
      .map((response: Response) => <any> response.json());
   }

   setStorage(key,value){
   localStorage.setItem(key,value);
   }

   getStorage(key){
    return localStorage.getItem(key);
   }

}
