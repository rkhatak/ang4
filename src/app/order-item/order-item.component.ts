import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent implements OnInit,OnDestroy {

  constructor(private mservice:MainService,private globals:Globals) { 
    this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe((data:any)=>{
      this.cartCount=data.cartCount;
    });
  }
  onThemeSetEvent$Subscription: Subscription;
  cartCount:any;
  @Input()
  cartItems:any;
  ngOnInit() {
    this.cartItems=this.cartItems;
    this.mservice.cartCalution();
  }
  ngOnDestroy() {
    if (this.onThemeSetEvent$Subscription) {
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
    
  }
  deleteOrder(e:any) {
            var id = $(e.currentTarget).attr('data-id');
            var itemname = $(e.currentTarget).attr('data-name');
            $('.tooltip').addClass('hide');
            $('.t-tooltip_' + id).removeClass('hide');
            $('.itemName_' + id).html(itemname);
        }
  confirmDeleteOrder(e:any) {
            let self=this;
            let restId = self.globals.globalRestaurantId;
             var cartCount = 0;
            var set_order_items =JSON.parse(self.mservice.getStorage('order_items_' + restId));
            $.each(set_order_items, function (index, item) {
                cartCount = (cartCount + parseInt(item.quantity));
            });
            self.cartCount = cartCount;
            var id = $(e.currentTarget).attr('data-id');
            var order_items = JSON.parse(self.mservice.getStorage('order_items_' + restId));
            $('.t-tooltip_' + id).addClass('hide');
            order_items = _.reject(order_items, function (el:any) {
                return el.uid === id;
            });
            self.mservice.setStorage('order_items_' + restId,JSON.stringify(order_items));
            self.cartItems = order_items;
            self.mservice.cartCalution();
        }

}
