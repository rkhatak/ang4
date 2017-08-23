import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class Globals {
    apiBaseUrl :string='http://api.munchado.in/wapi/'; 
    globalRestaurantId :number=0;
    globalTheme :string='';
    baseThemeImage :string='assets/template/themes/';
    currentRestaurantDetail :any=''; 
    onThemeSetEvent = new Subject<object>()

    public onThemeSet(){
        this.onThemeSetEvent.next();
    }
}
