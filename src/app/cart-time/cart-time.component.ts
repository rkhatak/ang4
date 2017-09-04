import {ElementRef, Component, OnInit,OnDestroy,Input,ViewChild,Renderer } from '@angular/core';
import { MainService } from '../main.service';
import {Subscription} from 'rxjs/Subscription';
import {Globals} from '../globals';

declare var $: any;

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
   this.d1.nativeElement.insertAdjacentHTML('beforeend', this.cartTime);
   
}

changeTime(){
this.timeEdit=false;
this.mservice.editRenderDateTime(this.order_type);
}
dayChange(e){
            let self=this;
            let restId=this.globalObj.globalRestaurantId;
            var orderType = (this.mservice.getStorage('order_type_'+restId)==null)?'takeout':this.mservice.getStorage('order_type_'+restId);
            //console.log(orderType);
            var date = e.currentTarget.value;
            var datekey= orderType ==='delivery'?'delivery_order_date_'+restId:'takeout_order_date_'+restId; 
            this.mservice.setStorage(datekey,date);
            this.mservice.getDefaultTimeSlots(restId,orderType, date).subscribe((data)=>{
             self.mservice.renderTimeSlots(data.timeslots,orderType);
             let currentGlobal=this.globalObj;
             $('.t-order-time').html(currentGlobal.cartTime);
            });
            
        }
 saveDateTime () {
            let self=this;
            let restId=this.globalObj.globalRestaurantId;
            var orderType = (this.mservice.getStorage('order_type_'+restId)==null)?'takeout':this.mservice.getStorage('order_type_'+restId);
            var datekey = orderType === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
            var timekey = orderType === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId;
            var date = $('.t-order-date').val();
            var time = $('.t-order-time').val();
            this.mservice.renderDateTime(orderType);
            setTimeout(function(){
             self.mservice.setStorage(datekey, date);
             self.mservice.setStorage(timekey, time); 
            },1000)
            
            this.date=date;
            this.time=time;
            self.timeEdit = true;
            this.globals.date = date;
            this.globals.time = time;
            this.globals.timeEdit = true;
            this.globals.onCart();            
        };       

}
