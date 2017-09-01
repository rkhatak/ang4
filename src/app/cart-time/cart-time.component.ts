import {ElementRef, Component, OnInit,OnDestroy,Input,ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import {Subscription} from 'rxjs/Subscription';
import {Globals} from '../globals';

@Component({
  selector: 'app-cart-time',
  templateUrl: './cart-time.component.html',
  styleUrls: ['./cart-time.component.css']
})
export class CartTimeComponent implements OnInit {

  constructor(private mservice: MainService,private globals:Globals) { 
    
  }
  @ViewChild('cartTime') d1:ElementRef;


  cartTime:any;
  dates:any;
  order_type:any;
  date:any;
  time:any;
  timeEdit:boolean=false;
  cartTimeEdit:any;
  @Input()
  globalObj:any;
  ngOnInit() {
    let restId=this.globalObj.globalRestaurantId;
    this.order_type=this.globalObj.order_type; 
    var datekey = this.order_type === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
    var timekey = this.order_type === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId; 
    this.date=this.mservice.getStorage(datekey);
    this.time=this.mservice.getStorage(timekey);
    this.cartTimeEdit=this.globalObj.cartTimeEdit; 
    if(this.date!='' && this.time!=''){
      this.timeEdit=true;
      
    }
    this.cartTime=this.globalObj.cartTime; 
    this.dates=this.globalObj.dates; 
    
  }
  dateText(d) {
    return this.mservice.getFormattedDateText(d);
  }

  hourTime(t) {
    return this.mservice.get12HourTime(t);
  }

  ngAfterViewInit() {
  if(this.timeEdit==false){ 
   this.d1.nativeElement.insertAdjacentHTML('beforeend', this.cartTime);
  }  
}

}
