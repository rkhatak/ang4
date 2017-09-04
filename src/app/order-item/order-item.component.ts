import { Component, OnInit, Input, OnDestroy,EventEmitter,Output} from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit, OnDestroy {

  constructor(private mservice: MainService, private globals: Globals) {
    this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe((data: any) => {
      this.cartCount = data.cartCount;
    });
  }
  onThemeSetEvent$Subscription: Subscription;
   @Output() updateCart = new EventEmitter<any>();
  cartCount: any;
  @Input()
  cartItems: any;
  ngOnInit() {
    this.cartItems = this.cartItems;
    this.mservice.cartCalution();
  }
  ngOnDestroy() {
    if (this.onThemeSetEvent$Subscription) {
      this.onThemeSetEvent$Subscription.unsubscribe();
    }

  }
  deleteOrder(e: any) {
    var id = $(e.currentTarget).attr('data-id');
    var itemname = $(e.currentTarget).attr('data-name');
    $('.tooltip').addClass('hide');
    $('.t-tooltip_' + id).removeClass('hide');
    $('.itemName_' + id).html(itemname);
  }
  cancelDeleteOrder(e) {
    var id = $(e.currentTarget).attr('data-id');
    $('.t-tooltip_' + id).addClass('hide');
  }
  confirmDeleteOrder(e: any) {
    let self = this;
    let restId = self.globals.globalRestaurantId;
    var cartCount = 0;
    var set_order_items = JSON.parse(self.mservice.getStorage('order_items_' + restId));
    $.each(set_order_items, function (index, item) {
      cartCount = (cartCount + parseInt(item.quantity));
    });
    self.cartCount = cartCount;
    var id = $(e.currentTarget).attr('data-id');
    var order_items = JSON.parse(self.mservice.getStorage('order_items_' + restId));
    $('.t-tooltip_' + id).addClass('hide');
    order_items = _.reject(order_items, function (el: any) {
      return el.uid === id;
    });
    self.mservice.setStorage('order_items_' + restId, JSON.stringify(order_items));
    self.cartItems = order_items;
    self.mservice.cartCalution();
  }

  editOrder(e){
    let self = this;
    let restId = self.globals.globalRestaurantId;
    var radioValidated = true;
        var i=0;
        _.each($(".addon-collection[data-selection-type=0]"),function(addonGroup){
            var parent = $(addonGroup);
            if(!$(":checked",parent).length) {
                $(".addon-error-message",parent).removeClass("hide");                   
                if(i===0){                   
                    var container = $('.a_area'),
                    scrollTo = $(".addon-error-message",parent);
                    container.stop().animate({
                        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()-50
                    });
                    i++;                        
                }                    
                radioValidated = false;
            }else{
                $(".addon-error-message",parent).addClass("hide");                    
            }
        });

        if(!radioValidated) {
            return false;
        }

        var id = $(e.currentTarget).attr('data-id');
           
            var order_items =JSON.parse(this.mservice.getStorage('order_items_' +restId));
            var model = _.find(order_items, function (el:any) {
                 return el.uid == id;
            });

            model.prices = [{id: model.price_id, value: model.item_price}];
            this.updateCart.emit(model);
            //this.cartItems=model;
            
  }

}
