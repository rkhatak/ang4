import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { Globals } from '../globals';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';
import { MainService } from '../main.service';
import * as _ from 'underscore';

declare var $: any;

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.css']
})
export class CardItemComponent implements OnInit, OnDestroy {

  cart: any;
  addonsDisplay: boolean;
  sub_total = 0;
  total = 0;
  items: any;
  addonSelected: any;
  cartItems: any;
  cartItemDisplay: boolean = false;
  date: any;
  time: any;
  selectedDate: any;
  selectedTime: any;
  dates: any;
  timeEdit: boolean;
  order_type: string = 'takeout';
  private onCartChange$Subscription: Subscription;
  constructor(public mservice: MainService, private globals: Globals, @Inject(DOCUMENT) private document: any) {
    this.onCartChange$Subscription = this.globals.onCartChange.subscribe(() => {
      this.cart = this.globals.cart;
      this.items = this.globals.items;
      this.addonsDisplay = this.globals.addonsDisplay;
      this.sub_total = this.cart.sub_total ? this.cart.sub_total : this.cart.prices[0].value;
      console.log(this.sub_total);
      this.total = this.sub_total * this.cart.quantity;
      this.total = (100 * this.total / 100);
    })
  }
  ngOnInit() {
    this.cart = this.globals.cart;
    this.addonsDisplay = this.globals.addonsDisplay;
    this.items = this.globals.items;
  }

  addMulti() {
    this.cart.quantity = parseInt(this.cart.quantity) + 1;
    this.total = this.sub_total * this.cart.quantity;
    this.total = (100 * this.total / 100);
  }

  addToCart() {
    let self = this;
    let order_items = <any[]>[];
    let radioValidated = true;
    let i = 0;
    let addCollec = this.document.getElementsByClassName('addon-collection[data-selection-type=0]');

    for (let i = 0; i <= addCollec.length; i++) {
      var parent = addCollec[i];
      if (!$(":checked", parent).length) {
        $(".addon-error-message", parent).removeClass("hide");
        if (i === 0) {
          var container = $('.a_area'),
            scrollTo = $(".addon-error-message", parent);
          container.stop().animate({
            scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() - 50
          });
          i++;
        }
        radioValidated = false;
      } else {
        $(".addon-error-message", parent).addClass("hide");
      }
    }
    if (!radioValidated) {
      return false;
    }
    let restId = this.globals.globalRestaurantId;

    if (this.mservice.getStorage('order_items_' + restId) !== null) {
      if (this.mservice.getStorage('order_items_' + restId).length > 0) {
        order_items = JSON.parse(this.mservice.getStorage('order_items_' + restId));
      }
    }
  
    let uid = $('#uid').val();
    let model: any = _.find(order_items, function (el: any) {
      return el.uid == uid;
    });
    if (model) {
      model.quantity = $('#quantity').val();
      model.sub_total = $('.sub-total').html();
      model.total_item_price = $('.total').html();
      model.special_instruction = $('.menu_special_instruction_item').val();
      var addons = [];
      if (self.addonSelected) {
        addons = self.addonSelected;
      }
      model.addons = addons;
      self.addonSelected = [];
      this.mservice.setStorage('order_items_' + restId, JSON.stringify(order_items));
    } else {
      var addons = [];
      if (self.addonSelected) {
        addons = self.addonSelected;
      }
      var items = {
        "uid": $('#uid').val(),
        "id": order_items.length,
        "item_id": $('#item_id').val(),
        "item_image_url": $('#item_image_url').val(),
        "item_name": $('#item_name').val(),
        "item_desc": $('#item_desc').val(),
        "quantity": $('#quantity').val(),
        "price_id": $('#price_id').val(),
        "item_price": $('#item_price').val(),
        "sub_total": $('.sub-total').html(),
        "total_item_price": $('.total').html(),
        "special_instruction": $('.menu_special_instruction_item').val(),
        "addons": addons
      };
      order_items.push(items);
      this.mservice.setStorage('order_items_' + restId, JSON.stringify(order_items));
      this.showTooltip(items.item_name);
    }
    self.cartItems = order_items;
    self.globals.cartItems=order_items;
    this.mservice.setStorage('order_type_' + restId, $('input[name=munchservices]:checked').val());
    this.mservice.hidePopUp();
    self.cartItemDisplay = true;
    self.globals.cartItemDisplay = self.cartItemDisplay;
    self.globals.cartCount = 0;
    var cartCount = 0;
    var set_order_items = JSON.parse(self.mservice.getStorage('order_items_' + restId));
    if (set_order_items) {
      $.each(set_order_items, function (index, item) {
        cartCount = (cartCount + parseInt(item.quantity));
      });
    }
    self.globals.cartCount = cartCount;
    self.globals.cartLenth = true;
    if (self.mservice.getStorage('order_type_' + restId) == null || self.mservice.getStorage('order_type_' + restId) == '') {
      self.mservice.setStorage('order_type_' + restId, 'takeout');
    }
    self.globals.order_type = (self.mservice.getStorage('order_type_' + restId)) ? self.mservice.getStorage('order_type_' + restId) : 'takeout';
    self.mservice.renderDateTime(self.globals.order_type);
    self.globals.onCartItem();
    
    //ga('send', 'event', 'Menu Item', "Add to Order" , "Click_on_Add_to_Order_Button", 1, true);
  }

  showTooltip(item) {
    $('.y_tooltip').removeClass('hide');
    $('.added_item').html(item);
    setTimeout(function () {
      $('.y_tooltip').addClass('hide');
      $('.added_item').html('');
    }, 5000);
  };

  subMulti() {
    if (this.cart.quantity > 1) {
      this.cart.quantity = parseInt(this.cart.quantity) - 1;
      this.total = this.sub_total * this.cart.quantity;
      this.total = (100 * this.total / 100);
    }
  }
  selectSubTotal(s) {
    this.sub_total = s.subtotal;
    this.total = this.sub_total * this.cart.quantity;
    this.total = (100 * this.total / 100);
    this.addonSelected = s.addonSelected;
  }


  ngOnDestroy() {
    if (this.onCartChange$Subscription) {
      this.onCartChange$Subscription.unsubscribe();
    }
  }

}
