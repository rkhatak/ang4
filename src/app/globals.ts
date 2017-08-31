import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class Globals {
    apiBaseUrl :string='http://api.munchado.in/wapi/'; 
    globalRestaurantId :number=0;
    globalTheme :string='';
    baseThemeImage :string='assets/template/themes/';
    currentRestaurantDetail :any=''; 
    dialogType :string='loader';
    cart :any; 
    addons :any; 
    addonsDisplay:boolean;
    items :any;
    cartItemDisplay:boolean;
    cartCount:number=0;
    cartLenth:boolean;
    order_type:any;
    date:any;
    time:any;
    selectedDate:any;
    selectedTime:any;
    dates:any;
    timeEdit:boolean;
    cartItems:any;
    onThemeSetEvent = new Subject<object>()
    onDialogType = new Subject<object>()
    onCartChange = new Subject<any>()
    onCartItemChange = new Subject<any>()

    public onThemeSet(){
        this.onThemeSetEvent.next();
    }
    public onDialogSet(){
        this.onDialogType.next();
    }
    public onCart(){
        this.onCartChange.next();
    }
    public onCartItem(){
        this.onCartItemChange.next();
    }
}
