import {ElementRef, Component, OnInit,OnDestroy,Input,ViewChild,Renderer,Inject } from '@angular/core';
import { MainService } from '../main.service';
import {Subscription} from 'rxjs/Subscription';
import {Globals} from '../globals';
import { DOCUMENT } from '@angular/platform-browser';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

declare var $: any;

@Component({
  selector: 'app-cart-time',
  templateUrl: './cart-time.component.html',
  styleUrls: ['./cart-time.component.css'],
  inputs: ['globalObj']
})
export class CartTimeComponent implements OnInit {

  constructor(private mservice: MainService,private globals:Globals, @Inject(DOCUMENT) private document: any,private pageScrollService: PageScrollService) {}
  @ViewChild('cartTime') d1:ElementRef;


  cartTime:any;
  dates:any;
  order_type:any;
  date:any;
  time:any;
  timeEdit:boolean=false;
  cartTimeEdit:any;
  globalObj1:any;
  tooltipselect:boolean;
  public set globalObj(values) {
      if (!values)
        return;
      this.globalObj1=values;
      //console.log('items values: ' + JSON.stringify(this.items1));
    }
  ngOnInit() {
    
    let restId=this.globalObj1.globalRestaurantId;
    this.order_type=this.mservice.getStorage('order_type_'+restId); 
    var datekey = this.order_type === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
    var timekey = this.order_type === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId; 
    this.date=this.mservice.getStorage(datekey);
    this.time=this.mservice.getStorage(timekey);
    this.cartTimeEdit=this.globalObj1.cartTimeEdit; 
    if(this.date!='' && this.time!=''){
      this.timeEdit=true;
    }
    this.tooltipselect=this.globalObj1.tooltipselecttime; 
    this.cartTime=this.globalObj1.cartTime; 
    this.dates=this.globalObj1.dates; 
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
//this.mservice.editRenderDateTime(this.order_type);
}
ngDoCheck(){
let restId=this.globalObj1.globalRestaurantId;
    this.order_type=this.mservice.getStorage('order_type_'+restId); 
    var datekey = this.order_type === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
    var timekey = this.order_type === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId; 
    this.date=this.mservice.getStorage(datekey);
    this.time=this.mservice.getStorage(timekey);
    this.cartTimeEdit=this.globalObj1.cartTimeEdit; 
    this.cartTime=this.globalObj1.cartTime; 
    this.dates=this.globalObj1.dates;
}
toolTipOpen(){
let self=this;  
this.tooltipselect=true;
setTimeout(function(){
let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(self.document, '#r_tooltipselecttime');
self.pageScrollService.start(pageScrollInstance);
},1000);
}

hideToolTip(){
           this.tooltipselect=false;
}
dayChange(e){
            let self=this;
            let restId=this.globalObj1.globalRestaurantId;
            var orderType = (this.mservice.getStorage('order_type_'+restId)==null)?'takeout':this.mservice.getStorage('order_type_'+restId);
            //console.log(orderType);
            var date = e.currentTarget.value;
            var datekey= orderType ==='delivery'?'delivery_order_date_'+restId:'takeout_order_date_'+restId; 
            this.mservice.setStorage(datekey,date);
            this.mservice.getDefaultTimeSlots(restId,orderType, date).subscribe((data)=>{
             self.mservice.renderTimeSlots(data.timeslots,orderType);
             let currentGlobal=this.globalObj1;
             $('.t-order-time').html(currentGlobal.cartTime);
            });
            
        }
 saveDateTime () {
            let self=this;
            let restId=this.globalObj1.globalRestaurantId;
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
