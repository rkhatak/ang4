import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  constructor(private mservice: MainService, public globals: Globals, @Inject(DOCUMENT) private document: any, public sanitizer: DomSanitizer) {
   
       this.onCartItemChange$Subscription = this.globals.onCartItemChange.subscribe(
          () => {
          this.cartItemDisplay= this.globals.cartItemDisplay;
          this.cartItems=this.globals.cartItems;
          }
        );
    
   }
  private dishes: any;
  private restaurantDeal: object;
  public order_type: any;
  public deliveryOrderCart: boolean = false;
  setDeliveryAddress = 0;
  addonsDisplay = false;
  addcart = false;
  private imagePath: string;
  cart:any;
  items:any;
  onThemeSetEvent$Subscription: Subscription;
  onCartItemChange$Subscription:Subscription;
  cartItems:any;
  cartItemDisplay:boolean;
  cartLenth:boolean;
  ngOnInit() {
    if (this.globals.globalRestaurantId) {
      this.getMenu();
      this.getDeals();
    } else {
      if (!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.getMenu();
            this.getDeals();
            
          }
        );
      }
    }
  }

  ngOnDestroy() {
    if (this.onThemeSetEvent$Subscription) {
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
    if(this.onCartItemChange$Subscription){
      this.onCartItemChange$Subscription.unsubscribe();
    }
  }

  private getMenu() {
    let _currentRestId = this.globals.globalRestaurantId;
    this.cartItems=(this.cartItems)?this.cartItems:JSON.parse(this.mservice.getStorage('order_items_'+_currentRestId));
    if(Object.keys(this.cartItems).length>0){
      this.cartItems=this.cartItems;
      this.cartItemDisplay=true;
      this.cartLenth=true;
    }else{
      this.cartItemDisplay=false;
      this.cartLenth=false;
    }
    
    this.mservice.setStorage('order_type_' + _currentRestId, 'takeout');
    this.mservice.getRestaurantMenu(_currentRestId)
      .subscribe(data => this.prepareMenu(data.menu));
  }

  private prepareMenu(m): void {
    this.dishes = m;
    this.dishes.minDelivery = this.globals.currentRestaurantDetail.minimum_delivery;
    this.order_type = this.mservice.getStorage('order_type_' + this.globals.globalRestaurantId);
    this.imagePath = this.globals.currentRestaurantDetail.base_url + this.globals.currentRestaurantDetail.res_code + "/thumb/";
    if (this.order_type == 'takeout') {
      this.getCheckTakeout();
    } else if (this.order_type == 'delivery') {
      this.getCheckDelivery();
    }
    setTimeout(function(){
    var el = this.document.querySelectorAll('.r_menu_navbar>li');
    el[0].classList.add('active');
    },1000);
   
  }
  getCheckDelivery() {

  }
  getCheckTakeout() {
    let self = this;
    let restId = this.globals.globalRestaurantId;
    let myServive = this.mservice;
    myServive.setStorage('order_type_' + restId, 'takeout');
    myServive.setStorage('select_delivery_' + restId, 'takeout');
    if (self.document.getElementById("t_delivery")) {
      self.document.getElementById("t_delivery").checked = false;
      self.document.getElementById("t_takeout").checked = true;
    }
    this.deliveryOrderCart = false;

    this.renderDateTime('takeout');
    //serverUtilityService.popuphide();
    //serverUtilityService.cartCalution();
    if (myServive.getStorage('addtoOrder_' + restId) && myServive.getStorage('addtoOrder_' + restId) !== '') {
      myServive.setStorage('addtoOrder_' + restId, '');
    }
    if (myServive.getStorage('select_delivery_' + restId) && myServive.getStorage('select_delivery_' + restId) !== '') {
      myServive.setStorage('select_delivery_' + restId, '');
    }
    // ga('send', 'event', 'Order Summary', "Order Takeout" , "Click_on_order_takeout_Button", 1, true);
  }
  renderDateTime = function (orderType) {
    // let restId = this.globals.globalRestaurantId;
    // let timeslots = serverUtilityService.getDateSlot(orderType);


    // if (timeslots.length > 0) {
    //     var date = $.jStorage.get('delivery_order_date_' + restId) ? $.jStorage.get('delivery_order_date_' + restId) : '';
    //     var time = $.jStorage.get('delivery_order_time_' + restId) ? $.jStorage.get('delivery_order_time_' + restId) : '';
    //     //var hours = $rootScope.currentRestaurant.delivery_hours;
    //     if (orderType == 'takeout') {
    //         date = $.jStorage.get('takeout_order_date_' + restId) ? $.jStorage.get('takeout_order_date_' + restId) : '';
    //         time = $.jStorage.get('takeout_order_time_' + restId) ? $.jStorage.get('takeout_order_time_' + restId) : '';
    //         $('#t_delivery').removeAttr("checked");
    //         $('#t_takeout').prop('checked', 'checked');
    //         //hours = $rootScope.currentRestaurant.takeout_hours;
    //     } else {
    //         $('#t_takeout').removeAttr("checked");
    //         $('#t_delivery').prop('checked', 'checked');
    //     }

    //     $rootScope.order_type = orderType;
    //     $rootScope.date = date;
    //     $rootScope.time = time;
    //     $rootScope.selectedDate =(date=='')?timeslots[0].value:date;
    //     $rootScope.selectedTime = time;
    //     $rootScope.dates = timeslots;
    //     $rootScope.timeEdit = false;
    //     //$rootScope.hours=hours;
    //     if (typeof date != "undefined" && typeof time != "undefined" && !_.isEmpty(date) && !_.isEmpty(time)) {
    //         $rootScope.timeEdit = true;
    //     } else {
    //         if (date === '') {
    //             var firstSlot = _.first(timeslots);
    //             date = firstSlot.value;
    //         }
    //         serverUtilityService.getDefaultTimeSlots(orderType, date);
    //     }

    //     serverUtilityService.getOperationsSlots(date);
    //     serverUtilityService.cartCalution();
    //    // serverUtilityService.getTipOptions()

    // }
  };


  private getDeals() {
    let _currentRestId = this.globals.globalRestaurantId;
    this.mservice.getRestaurantDeals(_currentRestId)
      .subscribe(data => this.restaurantDeal = data);
  }

  isDMDeal(title) {
    if (title === "Dine & More Specials") {
      return "dmdeal";
    }
    return "";
  }
  startDate(date) {
    if (typeof date === 'string') {
      date = date.replace(/\-/g, '/');
    }
    var dateOut = new Date(date);
    return dateOut.getDate() + '/' + (dateOut.getMonth() + 1) + '/' + dateOut.getFullYear();
  }
  showTab(cid, cName) {
    var el = this.document.getElementsByClassName('tabs');
    for (var i = 0; i < el.length; i++) {
      el[i].classList.remove('deactive');
      el[i].classList.remove('active');
    }
    this.document.querySelector('.tab_' + cid).classList.add('active');
    var ml = this.document.getElementsByClassName('menu_container');
    for (var i = 0; i < ml.length; i++) {
      ml[i].style.display = "none";
    }
    this.document.querySelector('.menu_' + cid).style.display = "block";
  }

  menuImageSafe(url, image) {
    let imageFullPath = url + image;
    return this.sanitizer.bypassSecurityTrustStyle(`url('${imageFullPath}')`);
  }

  addToOrder(model){
    this.addonsDisplay = false;
    if (model.online_order_allowed == 0) {
        return false;
    }
    this.addcart = true;
    let restId = this.globals.globalRestaurantId;
    let order_items = <any>[];
    if (this.mservice.getStorage('order_items_' + restId) !== null) {
                if (this.mservice.getStorage('order_items_' + restId).length > 0) {
                    order_items = this.mservice.getStorage('order_items_' + restId);
                }
            }
    this.cart = model;
    this.cart.imagePath = this.imagePath;
    this.cart.quantity = 1;
    this.cart.special_instruction = "";
    this.cart.uid = model.item_id + "_" + order_items.length;
    this.cart.sub_total = 0;
    this.cart.menuPrices = model.prices[0].value;
    this.addons(model.item_id, model.prices[0].id, []);
    this.globals.cart=this.cart;
    this.globals.onCart();
    this.globals.dialogType="addtocart";
    this.globals.onDialogSet();
  }
  addons(menuId, menuPriceId, addons){
    this.mservice.getRestaurantMenuAddons(menuId).subscribe((data)=>{
      if (data.length) {
      let dataSort= data.filter(el => el.menu_price_id == menuPriceId);
      var items = dataSort[0];
      items['selected_options'] = addons;
      this.items = items;
      this.globals.items=this.items;
      this.addonsDisplay = true;
      this.globals.addonsDisplay=true;
      this.globals.onCart();
    }else{
      this.globals.items=[];
      this.globals.addonsDisplay=false;
      this.globals.onCart();
    }
    },(err)=>{
      this.globals.items=[];
      this.globals.addonsDisplay=false;
      this.globals.onCart();
    })

  }
}
