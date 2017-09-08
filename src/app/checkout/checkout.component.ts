import { Component, OnInit, OnDestroy } from '@angular/core';
import { Globals } from '../globals';
import { MainService } from '../main.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  onThemeSetEvent$Subscription: Subscription;
  cartItem: any;
  cartTotal: any;
  cartSubTotal: any;
  cartTax: any;
  cartTip: any;
  cartType: any;
  date: any;
  time: any;
  currentUser: any;
  currentRestaurant: any;
  cartOrderType: any;
  formData = {
    name: "",
    lastName: "",
    email: "",
    phone: "",
    specialIns: "",
    cardname: "",
    cardNo: "",
    cvv: "",
    pin: ""
  }
  varWhatsThisShow: boolean = false;
  pointRedeem: any;
  showPayment: boolean;
  payViaCard: any;
  payViaPoint: any;
  years:any;
  months:any = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  constructor(public router: Router, public globals: Globals, private mservice: MainService) { }

  ngOnInit() {
    if (this.globals.globalRestaurantId) {
      this.getCheckout();
    } else {
      if (!this.onThemeSetEvent$Subscription) {
        this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          (data) => {
            this.getCheckout();
          }
        );
      }
    }
  }
  onlyNumber(event) {
    var key = event.which;
    if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) {
      return true;
    }
    var value = $(event.currentTarget).val().replace(/[^-0-9 !@#$%^&*()+,:;.",]/g, "");
    value = value.replace(/\./g, '');
    $(event.currentTarget).val(value);
  }
  changePaymentType(e) {
    var typeOfPayment = e.currentTarget.value;
    this.switchPaymentMethod(typeOfPayment, this.currentUser);
  }
  validateCardName() {
    var hasError = false,
      cardName = $("input[name=card_name]");

    if ($.trim(cardName.val()) === "") {
      cardName.closest("div").find(".error-message").removeClass("hide");
      hasError = true;
    } else {
      cardName.closest("div").find(".error-message").addClass("hide");
    }
    return hasError;
  };
  validateCardNumber() {
    var hasError = false,
      cardNumber = $("input[name=card_number]");
    if ($.trim(cardNumber.val()) === "") {
      cardNumber.closest("div").find(".error-message").removeClass("hide").html('Try rubbing your fingers over the numbers, that helps us get \'em right');
      hasError = true;
    } else {
      if (!this.isValidCardNumber(cardNumber)) {
        cardNumber.closest("div").find(".error-message").removeClass("hide").html("We need all of the numbers on the card. All of \'em");
        hasError = true;
      } else {
        cardNumber.closest("div").find(".error-message").addClass("hide");
      }
    }
    return hasError;
  };
  isValidCardNumber(element) {
    var cardNumber = element.val();
    cardNumber = cardNumber.replace(/ /g, '');
    return cardNumber.length > 13 && cardNumber.length < 19 && this.getCardType(cardNumber);
  };
  detectCardType(event) {
    this.cardNumberFormat(event);
    var $element = $("input[name=card_number]");
    var value = $element.val();
    var cardType = this.getCardType(value);
    $("ul.credit_cards li").removeClass('correct');
    if (cardType) {
      $("ul.credit_cards li[data-type='" + cardType + "']").addClass('correct');
    }
  };
  cardNumberFormat(event) {
    var key = event.which;
    if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) {
      return true;
    }
    this.onlyNumber(event);
    var valc = $(event.currentTarget).val().split(" ").join("");
    if (valc.length > 16) {
      valc = valc.substr(0, 16);
    }
    if (valc.length > 0) {
      valc = valc.match(new RegExp('.{1,4}', 'g')).join(" ");
    }
    $(event.currentTarget).val(valc);
  };
  getCardType(card_no) {
    var card_number = card_no.replace(/ /g, '');
    try {
      var intCardNumber4 = parseInt(card_number.substr(0, 4), 10);
      var intCardNumber6 = parseInt(card_number.substr(0, 6), 10);
      var strCardNumber = card_number + "";
    } catch (ex) {
      var intCardNumber4 = 0;
      var intCardNumber6 = 0;
      var strCardNumber = "";
    }
    var isVISA = (new RegExp("^4.*")).test(strCardNumber);
    var isMASTER = (new RegExp("^(51|52|53|54|55).*")).test(strCardNumber);
    var isAMEX = (new RegExp("^(34|37).*")).test(strCardNumber);
    var isDISC = (((new RegExp("^(6011|644|645|646|647|648|649|65).*")).test(strCardNumber)) || (intCardNumber6 > 622127 && intCardNumber6 < 622925));
    var isDINN = (new RegExp("^(54|36|38|300|301|302|303|304|305).*")).test(strCardNumber);
    var isJCB = intCardNumber4 >= 3528 && intCardNumber4 <= 3589;
    if (isVISA) {
      return "visa";
    }
    if (isMASTER) {
      return "master";
    }
    if (isAMEX) {
      return "amex";
    }
    if (isDISC) {
      return "disc";
    }
    if (isDINN) {
      return "dinn";
    }
    if (isJCB) {
      return "jcb";
    }
    return false;
  };
  
  switchPaymentMethod(payMethod, currentUser) {
    let self = this;
    var restId = self.globals.globalRestaurantId;
    if (payMethod === 'Mix') {
      $(".stripe-error .error-message").addClass('hide').html('');
      $('.y_point_detail').removeClass('hide');
      var total = parseFloat($.jStorage.get('order_total_' + restId));
      var points = currentUser.points;
      let pointsInCash: any = self.mservice.getNumber((points * 0.01), 2);
      let remain: any = '';
      self.pointRedeem = points;
      $('.cashEarned').html(pointsInCash);
      if (pointsInCash >= total) {
        if (total < 0.5) {
          self.pointRedeem = 0;
          self.showPayment = false;
          self.payViaCard = 0;
          self.payViaPoint = 0;
        } else {
          remain = self.mservice.getNumber((pointsInCash - total), 2);
          self.pointRedeem = self.mservice.getNumber((total * 100), 2);
          $('.pointsRedeemed').html(self.pointRedeem);
          $('.cashEarned').html(total);
          $('.pointsBalance').html(self.mservice.getNumber((remain * 100), 2));
          $('.y_full_point_pay').removeClass('hide');
          $('.y_txt_pay').addClass('hide');
          $('.y_payment_detail').addClass('hide');
          self.showPayment = false;
          self.payViaCard = 0;
          self.payViaPoint = total;
        }
      } else {
        remain = self.mservice.getNumber((total - pointsInCash), 2);
        if (remain < 0.5) {
          self.showPayment = false;
          $('.y_txt_pay').addClass('hide');
          $('.y_full_point_pay').removeClass('hide');
          $('.y_payment_detail').addClass('hide');
          self.payViaCard = 0;
          self.payViaPoint = total;
        } else {
          self.showPayment = true;
          $('.y_remaining_card_balace').removeClass('hide');
          $('.y_card_pay').addClass('hide');
          $('.remain').html(remain);
          $('.y_payment_detail').removeClass('hide');
          $('.y_txt_pay').removeClass('hide');
          self.payViaCard = remain;
          self.payViaPoint = pointsInCash;
        }
      }
    } else {
      self.showPayment = true;
      $('.y_remaining_card_balace').addClass('hide');
      $('.y_point_detail').addClass('hide');
      $('.y_card_pay').removeClass('hide');
      self.payViaCard = 0;
      self.payViaPoint = 0;
      self.pointRedeem = 0;
      if (currentUser['bp_status'] != 1) {
        $('.y_payment_detail').removeClass('hide');
        self.payViaCard = total;
      }
      $('.y_full_point_pay').addClass('hide');
    }
  };
  validateCVVCode() {
    var hasError = false,
      cvv = $("input[name=cvv_code]");
    if ($.trim(cvv.val()) === "") {
      cvv.closest("div").find(".error-message").removeClass("hide").html('It would be irresponsible of us not to require this.');
      hasError = true;
    } else {
      if (!this.isValidCVVCode(cvv)) {
        cvv.closest("div").find(".error-message").removeClass("hide").html("Hmm, that\'s not it. Try looking a little closer at the card  or maybe your card  number is wrong.");
        hasError = true;
      } else {
        cvv.closest("div").find(".error-message").addClass("hide");
      }
    }
    return hasError;
  };
  isValidCVVCode(element) {
    var cvvCode = element.val();
    return (isNaN(cvvCode) === true || cvvCode.length < 3 || cvvCode.length > 4) ? false : true;
  };
  validateZipCode() {
    var hasError = false;
    var zip = $("input[name=zip]");
    if ($.trim(zip.val()) === "") {
      zip.closest("div").find(".error-message").removeClass("hide");
      hasError = true;
    } else if ($.trim(zip.val()).length < 5) {
      zip.closest("div").find(".error-message").removeClass("hide").html('Billing zip should be 5 digits.');
      hasError = true;
    } else {
      zip.closest("div").find(".error-message").addClass("hide");
      hasError = false;
    }
    return hasError;
  };
  whatsThisShow() {
    this.varWhatsThisShow = true;
  }
  whatsThisHide() {
    this.varWhatsThisShow = false;
  }
  currentMonth:any;
  currentYear:any;
  private getCheckout() {
    let self = this;
    let restId = self.globals.globalRestaurantId;
    this.currentRestaurant = self.globals.currentRestaurantDetail;
    this.currentUser = self.globals.currentUser;
    this.currentUser.points = 0;
    console.log(this.currentUser);
    let cartItem = this.cartItem = JSON.parse(self.mservice.getStorage('order_items_' + restId));
    let cartTotal = this.cartTotal = self.mservice.getStorage('order_total_' + restId);
    let cartSubTotal = this.cartSubTotal = self.mservice.getStorage('order_subtotal_' + restId);
    let cartTax = this.cartTax = self.mservice.getStorage('order_tax_' + restId);
    let cartTip = this.cartTip = self.mservice.getStorage('order_tip_' + restId);
    let cartType = this.cartType = self.mservice.getStorage('order_type_' + restId);
    let datekey = cartType === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
    let timekey = cartType === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId;
    this.date = self.mservice.getStorage(datekey);
    this.time = self.mservice.getStorage(timekey);
    this.cartOrderType = (self.mservice.getStorage('order_type_' + restId) == 'takeout') ? 'pick up' : 'delivery';
    //console.log(cartItem);
    this.setDeliveryTakeoutTime();
    var year = new Date().getFullYear();
    var range = [];
    range.push(year);
    for (var i = 1; i < 10; i++) {
        range.push(year + i);
    }
    self.years = range;
    var d = new Date();
            if (self.currentRestaurant) {
                d = self.mservice.parseDate(self.currentRestaurant.current_dateTime);
            }
    var currentMonth = d.getMonth() + 1;
    self.currentMonth = currentMonth;
    self.currentYear = year;




  }
  setDeliveryTakeoutTime() {
    let self = this;
    let restId = self.globals.globalRestaurantId;
    if (self.mservice.getStorage('order_type_' + restId) === 'delivery') {
      var dt = self.mservice.parseDate(self.mservice.getStorage('delivery_order_date_' + restId));
      var dayArray = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
      var day = dayArray[dt.getDay()];
      var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var bookDate = dt.getDate();
      var month = monthArray[dt.getMonth()];
      var year = dt.getFullYear();

      var _var = day + ', ' + month + ' ' + bookDate + " at ";

      var dt = self.mservice.parseDate(self.mservice.getStorage('delivery_order_date_' + restId));
      $('.y-expectedTime').html(_var + self.mservice.get12HourTime(self.mservice.getStorage('delivery_order_time_' + restId)));
    } else {
      var dt = self.mservice.parseDate(self.mservice.getStorage('takeout_order_date_' + restId));
      var dayArray = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
      var day = dayArray[dt.getDay()];
      var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var bookDate = dt.getDate();
      var month = monthArray[dt.getMonth()];
      var year = dt.getFullYear();
      var _var = day + ', ' + month + ' ' + bookDate + " at ";
      $('.y-expectedTime').html(_var + self.mservice.get12HourTime(self.mservice.getStorage('takeout_order_time_' + restId)));
    }
    var newDt = self.mservice.parseDate(this.currentRestaurant.current_dateTime);
    var dayArray = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
    var day = dayArray[newDt.getDay()];
    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var bookDate = newDt.getDate();
    var month = monthArray[newDt.getMonth()];
    var year = newDt.getFullYear();
    var _var = day + ', ' + month + ' ' + bookDate + " at ";
    $('.y-timeOfOrder').html(_var + self.mservice.get12HourTime(newDt.getHours() + ":" + newDt.getMinutes()));

  }
  nameFormat(event) {
    var key = event.which;
    if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) {
      return true;
    }
    var value = $(event.currentTarget).val().replace(/[^A-Za-z0-9._\s'-]/gi, "");
    if (value.substr(0, 1).match(/[A-Za-z]/) === null) {
      value = '';
    }
    $(event.currentTarget).val(value);
  };
  validateFirstName() {
    var hasError = false;
    var firstName = $("input[name=first_name]");
    var errorMessage = firstName.closest("div").find(".error-message");
    if ($.trim(firstName.val()) === "") {
      errorMessage.removeClass("hide");
      hasError = true;
    } else {
      errorMessage.addClass("hide");
    }
    var value = $.trim(firstName.val());
    $("input[name=first_name]").val(value);
    return hasError;
  };
  validatePhoneR() {
    var hasError = false,
      phoneNo = $("input[name=phone_no_r]"),
      phoneVal = $.trim(phoneNo.val().replace(/([*()'-\/ ])/g, ''));
    if (phoneVal === '') {
      $(".y_error_phone").html("We promise; No prank calls").fadeIn("slow").removeClass("hide");
      hasError = true;
    } else if (phoneVal.length < 10) {
      $(".y_error_phone").html('You know, there\'s a cadence to phone numbers. They usually go xxx-xxx-xxxx').fadeIn("slow").removeClass("hide");
      hasError = true;
    } else {
      $(".y_error_phone").html("").fadeOut("slow").addClass("hide");
    }
    return hasError;
  }
  phoneNumberFormat(event) {
    var key = event.which;
    if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) {
      return true;
    }
    var value = $(event.currentTarget).val().replace(/[^-0-9 !@#$%^&*()+,:;.",]/g, "");
    value = $.trim(value).replace(/\./g, '');
    if (value.length > 11) {
      $(event.currentTarget).val(value.substr(0, 11));
    } else {
      $(event.currentTarget).val(value);
    }
  };
  validateEmail() {
    var hasError = false,
      email = $("input[name=email]");
    var emailFormat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if ($.trim(email.val()) === "") {
      email.closest("div").find(".error-message").removeClass("hide").html('Hey, you forgot something');
      hasError = true;
    } else {
      if (!emailFormat.test(email.val())) {
        email.closest("div").find(".error-message").removeClass("hide").html('That don\'t look like any e-mail I ever seen. Maybe the "@" or the "." are in the wrong spot. This isn\'t cubism, put things where they belong!');
        hasError = true;
      } else {
        email.closest("div").find(".error-message").addClass("hide");
      }
    }
    return hasError;
  };
  cartEditOrder() {
    this.router.navigate(['/menu']);
  }
  ngOnDestroy() {
    if (this.onThemeSetEvent$Subscription) {
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }

}
