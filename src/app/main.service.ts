import { Injectable, Inject, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Globals } from './globals';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'underscore';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Injectable()
export class MainService implements OnDestroy {
    constructor(private _http: Http, public globals: Globals, @Inject(DOCUMENT) private document: any) {
        this.onCartChange$Subscription = this.globals.onCartChange.subscribe(() => {
            this.cart = this.globals.cart;
            this.items = this.globals.items;
        })
    }
    cart: any;
    items: any;
    restaurantDeal: any;
    selectedDeal: any = false;
    promocode: any;
    date: any;
    time: any;
    selectedDate: any;
    selectedTime: any;
    dates: any;
    timeEdit: boolean;
    order_type: string = 'takeout';
    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    private onCartChange$Subscription: Subscription;


    postToken(): Observable<any> {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'auth/token';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify({});

        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());
    }

    getApiUrl(myUrl) {
        let self = this;
        if (myUrl.indexOf('token=') == -1) {
            myUrl += ((myUrl.indexOf('?') == -1) ? '?' : '&');
            myUrl += "token=" + this.getStorage('oauth.token');
        }
        return self.globals.apiBaseUrl + myUrl;

    };

    getToken(): Observable<any> {
        let self = this;
        let authToken = this.getStorage('oauth.token');
        let apiUrl = self.globals.apiBaseUrl + 'auth/token/' + authToken;
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }

    getTheme() {
        let themeUrl = 'assets/theme.require.json'
        let self = this;
        return self._http.get(themeUrl)
            .map((response: Response) => <any>response.json())
            .do(data => console.log(JSON.stringify(data)));
    }

    getRestaurantDetails(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/details/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }

    getRestaurantOverview(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/overview/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantMenu(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/menu/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantMenuAddons(menuId) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/menu-addons/' + menuId);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantDeals(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/deals-coupons/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantGallery(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/gallery/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantStory(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/story/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }

    getThemeDetails(theme) {
        let themeUrl = 'assets/data/' + theme + '.json'
        let self = this;
        return self._http.get(themeUrl)
            .map((response: Response) => <any>response.json());
    }
    getChainRestaurant(_theme) {
        let themeUrl = 'assets/data/' + _theme + '.restaurant.json'
        let self = this;
        return self._http.get(themeUrl)
            .map((response: Response) => <any>response.json());
    }

    setStorage(key, value) {
        localStorage.setItem(key, value);
    }

    getStorage(key) {
        return localStorage.getItem(key);
    }
    showPopUp() {
        this.document.querySelector('.a_modal').classList.remove('hide');
    }
    hidePopUp() {
        this.document.querySelector('.a_modal').classList.add('hide');
    }

    getDefaultTimeSlots(restId, orderType, orderDate) {
        var self = this;
        let apiUrl = self.getApiUrl('restaurant/timeslot/' + restId + '?date=' + orderDate + '&type=' + orderType);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());

    };

    digitToString(digit) {
        digit = parseInt(digit, 10);
        var string = "";
        switch (digit) {
            case 1:
                string = "one";
                break;
            case 2:
                string = "two";
                break;
            case 3:
                string = "three";
                break;
            case 4:
                string = "four";
                break;
            case 5:
                string = "five";
                break;
            case 6:
                string = "six";
                break;
            case 7:
                string = "seven";
                break;
            case 8:
                string = "eight";
                break;
            case 9:
                string = "nine";
                break;
            case 10:
                string = "ten";
                break;
        }
        return string;
    };

    parseDate(date) {
        if (typeof date === 'string') {
            date = date.replace(/\-/g, '/');
        }
        var dummyDate = new Date(date);
        if (Object.prototype.toString.call(dummyDate) === "[object Date]" && !isNaN(dummyDate.getTime())) {
            return dummyDate;
        }
        return new Date(date);
    }
    get12HourTime(time) {
        var date = this.parseDate('1970-01-01 ' + time);
        let hours: any = date.getHours();
        var isAM = hours >= 12 ? false : true;
        hours = hours > 12 ? hours - 12 : hours;
        hours = parseInt(hours, 10) === 0 ? 12 : hours;
        return this.paddLeft(hours, 0, 2) + ":" + this.paddLeft(date.getMinutes(), 0, 2) + " " + (isAM ? "AM" : "PM");
    };

    paddLeft(str, char, length) {
        if (str.length >= length)
            return str;
        var padding = char + "";
        for (var i = 1; i < length; i++) {
            padding += char;
        }
        var a = padding + str;
        return a.slice(-length);
    };
    getOperationsSlots(restId, date) {
        var self = this;
        let apiUrl = self.getApiUrl('restaurant/operations/' + restId + '?date=' + date);
        return self._http.get(apiUrl)
            .map((response) => <any>response.json());
    }
    candeliver(restId,lat,lng){
        var self = this;
        let apiUrl = self.getApiUrl(`restaurant/candeliver/${restId}?lat=${lat}&lng=${lng}`);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }


    cartCalution() {
        var self = this;
        let restId = self.globals.globalRestaurantId;
        let order_items = JSON.parse(this.getStorage('order_items_' + restId));
        let orderType = this.getStorage('order_type_' + restId);
        let tax: any = 0, subtotal: any = 0, total: any = 0;
        let delCharge: any = parseFloat(self.globals.currentRestaurantDetail.delivery_charge);
        if (!order_items) {
            order_items = [];
            this.setStorage('order_items_' + restId, JSON.stringify(order_items));
        }
        _.each(order_items, function (item: any) {
            subtotal = parseFloat(subtotal) + parseFloat(item.total_item_price);
        });
        subtotal = (Math.round(subtotal * 100) / 100).toFixed(2);
        this.getApplicableDeal(orderType, subtotal);
        let discount: any = 0;
        let promoDiscount: any = 0;
        if (self.selectedDeal) {
            if (self.selectedDeal.discount_type === 'flat') {
                discount = this.getNumber(self.selectedDeal.discount, 2);
            } else {
                discount = this.getNumber((subtotal * parseInt(self.selectedDeal.discount)) / 100, 2);
            }
        }
        if (self.promocode) {
            if (subtotal >= parseFloat(self.promocode.minimum_order_amount)) {
                if (self.promocode.discount_type === 'flat') {
                    promoDiscount = this.getNumber(self.promocode.discount, 2);
                } else {
                    promoDiscount = this.getNumber((subtotal * parseInt(self.promocode.discount)) / 100, 2);
                }
                this.setStorage("promocode_status", "valid");
            } else {
                this.setStorage("promocode_status", "invalid");
                $('.promo_code .error-message').removeClass('hide').html(`Minimum order must exceed ${self.promocode.minimum_order_amount}to redeem this Promo Code`);
            }
        }


        if (discount > 0) {
            $('.y-discount').removeClass('hide');
            $('.discount_amount').html(discount);
            $('.y-dealtext').removeClass('hide').html(self.selectedDeal.title);
        } else {
            $('.y-discount').addClass('hide');
            $('.discount_amount').html('');
            $('.y-dealtext').addClass('hide').html('');
        }
        if (promoDiscount > 0) {
            $('.y-promocode-apply, .t_promocode').removeClass('hide');
            $('.y-promocode, .promo_code .error-message').addClass('hide');

            $('.y-promocode-amount').html(promoDiscount);
            $('.y-promocode-coupan').html(this.getStorage("promocode"));

            $('.y-dealtext').removeClass('hide').html(self.promocode.title);
        } else {
            $('.y-promocode-apply, .t_promocode').addClass('hide');
            $('.y-promocode').removeClass('hide');
            $('#promocode').val('')
            $('.y-promocode-amount').html('');
            $('.y-promocode-coupan').html('');
            $('.y-dealtext').addClass('hide').html('');
        }
        var taxRate = 8.875;
        if (self.globals.currentRestaurantDetail) {
            taxRate = self.globals.currentRestaurantDetail.sales_tax;
        }
        this.setStorage('order_subtotal_' + restId, subtotal);
        tax = (subtotal * taxRate) / 100;
        tax = (Math.round(tax * 100) / 100).toFixed(2);
        total = parseFloat(subtotal) + parseFloat(tax);
        var tipAmount = "0.00";
        if (orderType == 'delivery') {
            this.getTipOptions();
            $('.y-tip,.y-tip-desc').removeClass('hide');
            var tip = self.getStorage('tip_' + restId);
            if (tip !== '') {
                tipAmount = this.getNumber((subtotal * parseInt(tip)) / 100, 2);
                total += parseFloat(tipAmount);
            }
            $(".default_tip").html('$' + tipAmount);
            self.setStorage('order_tip_' + restId, tipAmount);
            $('.t-deliverycharge').removeClass('hide');

            if (delCharge) {
                total += parseFloat(delCharge);
            }
        } else {
            $('.y-tip,.y-tip-desc').addClass('hide');
            $('.t-deliverycharge').addClass('hide');
        }
        total = (total - discount);
        total = (total - promoDiscount);
        total = (Math.round(total * 100) / 100).toFixed(2);
        $('.order_subtotal').html(subtotal);

        $('.order_tax').html(tax);
        if (delCharge < 1) {
            $('.t-deliverycharge').addClass('hide');
        } else {
            $('.deliverycharge_amount').html(self.globals.currentRestaurantDetail.delivery_charge);
        }
        $('.order_total').html(total);
        self.setStorage('order_tax_' + restId, tax);
        self.setStorage('order_total_' + restId, total);
        var min_order = 5;
        if (self.globals.currentRestaurantDetail) {
            min_order = parseFloat(self.globals.currentRestaurantDetail.minimum_delivery);
        }
        if ((min_order > 0) && (orderType === 'delivery')) {
            if (subtotal < min_order) {
                $('.t-min-order').removeClass('hide');
                $('.t_min_order').html(min_order);
            } else {
                $('.t-min-order').addClass('hide');
            }
        } else {
            $('.t-min-order').addClass('hide');
        }
        if (order_items.length > 0) {
            $('.t-no-order').addClass('hide');
        } else {
            if ((orderType === 'delivery') && (min_order > 0)) {
                $('.t-min-order').removeClass('hide');
            }
            $('.t-no-order').removeClass('hide');
        }

    }
    getTipOptions() {
        let self = this;
        var restId = self.globals.globalRestaurantId;
        var text = '<option value="0">No Tip</option>';
        var tips = this.getAllTips();
        let tip: any = self.getStorage('tip_' + restId);
        $.each(tips, function (per, value) {
            text += '<option value="' + per + '" ' + (tip == per ? "selected" : "") + '>' + per + '% ($' + value + ')</option>';
        });
        setTimeout(function () {
            $("select.t-tip-percent").html(text);
        }, 1000)

        var defaultTipText = "No Tip";
        if (tip != 0) {
            defaultTipText = tip + '% ($' + parseFloat(this.getNumber(((JSON.parse(self.getStorage('order_subtotal_' + restId)) * tip) / 100), 2)) + ')';
        }
        $(".default-tip").html(defaultTipText);
        //    $("select.t-tip-percent").off('change');
        //    $("select.t-tip-percent").on('change', $.proxy(App.updateTipPercent,App));
    }
    getAllTips() {
        return {
            "10": this.getTipAmount(10),
            "15": this.getTipAmount(15),
            "20": this.getTipAmount(20),
            "25": this.getTipAmount(25),
            "30": this.getTipAmount(30)
        };
    };
    getTipAmount(tip) {
        let self = this;
        var restId = self.globals.globalRestaurantId;
        if (JSON.parse(self.getStorage('order_subtotal_' + restId)) > 0) {
            return parseFloat(this.getNumber(((JSON.parse(self.getStorage('order_subtotal_' + restId)) * tip) / 100), 2));
        } else {
            return "0.00";
        }
    };

    restaurantDealFun() {
        let self = this;
        let restId = self.globals.globalRestaurantId;
        let apiUrl = self.getApiUrl('restaurant/deals-coupons/' + restId);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json()).subscribe((data) => {
                self.restaurantDeal = data;
            });
    };
    getApplicableDeal(orderType, subTotal) {
        let self = this;

        self.restaurantDealFun();
        if (!self.restaurantDeal || self.restaurantDeal.length === 0) {
            return false;
        }
        if (!orderType || _.isEmpty(orderType) || _.isUndefined(orderType) || !subTotal || _.isEmpty(subTotal) || _.isUndefined(subTotal)) {
            return [];
        }
        var filteredDeals = self.restaurantDeal.filter(function (model: any) {
            return (model.deal_for.indexOf(orderType.toLowerCase()) !== -1);
        });
        filteredDeals = _.filter(filteredDeals, function (model: any) {
            return parseFloat(model.minimum_order_amount) <= parseFloat(subTotal);
        });
        let decidedDiscount: any = 0;

        self.selectedDeal = false;
        _.each(filteredDeals, function (deal: any) {
            if (deal.type !== 'offer') {
                if (self.parseDate(self.globals.currentRestaurantDetail.current_dateTime) >= self.parseDate(deal.start_on)) {
                    if (deal.discount_type.toLowerCase() === "flat") {
                        var discount = parseFloat(deal.discount);
                        if (decidedDiscount < discount) {
                            decidedDiscount = discount;
                            self.selectedDeal = deal;
                        }
                    }
                    if (deal.discount_type.toLowerCase() === "percent") {
                        let discount: any = self.getNumber(parseFloat(deal.discount) * parseFloat(subTotal) / 100, 2);
                        discount = parseFloat(discount);
                        if (decidedDiscount < discount) {
                            decidedDiscount = discount;
                            self.selectedDeal = deal;
                        }
                    }
                }
            }
        });
        return self.selectedDeal;
    };

    getNumber(num, decimal) {
        let afterDecimal = (num + "").split(".");
        if (!_.isEmpty(afterDecimal[1]) && afterDecimal[1].length > 5) {
            num = Math.round(num * 100) / 100;
        }
        let reg: any = new RegExp('^\\d+(?:\\.\\d{0,' + decimal + '})?');
        let number: any = Number(parseFloat(num).toString().match(reg));
        return parseFloat(number).toFixed(decimal);
    }
    ngOnDestroy() {
        if (this.onCartChange$Subscription) {
            this.onCartChange$Subscription.unsubscribe();
        }
    }

    getDateSlot(type) {
        let workingDates = [];
        let _currentRes = this.globals.currentRestaurantDetail;
        if (_currentRes) {
            if (_currentRes.all_delivery_working_days || _currentRes.all_takeout_working_days) {
                var dates = _currentRes.all_delivery_working_days;
                if (type !== 'delivery') {
                    dates = _currentRes.all_takeout_working_days;
                }
                $.each(dates, function (key, value) {
                    var dateObj = {
                        text: value,
                        value: key
                    };
                    workingDates.push(dateObj);
                });
            }
        }
        return workingDates;
    }

    renderDateTime(orderType: any): void {
        let restId = this.globals.globalRestaurantId;
        let timeslots = this.getDateSlot(orderType);


        if (timeslots.length > 0) {
            var date = this.getStorage('delivery_order_date_' + restId) ? this.getStorage('delivery_order_date_' + restId) : '';
            var time = this.getStorage('delivery_order_time_' + restId) ? this.getStorage('delivery_order_time_' + restId) : '';
            //var hours = $rootScope.currentRestaurant.delivery_hours;
            if (orderType == 'takeout') {
                date = this.getStorage('takeout_order_date_' + restId) ? this.getStorage('takeout_order_date_' + restId) : '';
                time = this.getStorage('takeout_order_time_' + restId) ? this.getStorage('takeout_order_time_' + restId) : '';
                $('#t_delivery').removeAttr("checked");
                $('#t_takeout').prop('checked', 'checked');
                //hours = $rootScope.currentRestaurant.takeout_hours;
            } else {
                $('#t_takeout').removeAttr("checked");
                $('#t_delivery').prop('checked', 'checked');
            }
            
            this.globals.order_type = orderType;
            this.globals.date = date;
            this.globals.time = time;
            this.globals.selectedDate = (date == '') ? timeslots[0].value : date;
            this.globals.selectedTime = time;
            this.globals.dates = timeslots;
            this.globals.timeEdit = false;
            this.date = date;
            this.time = time;
            this.selectedDate = (date == '') ? timeslots[0].value : date;;
            this.selectedTime = time;
            this.dates = timeslots;
            this.timeEdit = false;
            this.order_type = orderType;
           
            //$rootScope.hours=hours;
            if (typeof date != "undefined" && typeof time != "undefined" && !_.isEmpty(date) && !_.isEmpty(time)) {
                this.globals.timeEdit = true;
                this.timeEdit = true;
            } else {
                if (date == '' || date == "undefined") {
                    var firstSlot = _.first(timeslots);
                    date = firstSlot.value;
                }
                this.getDefaultTimeSlots(restId, orderType, date)
                    .subscribe((data) => {
                        this.prepareTimeSlot(data);
                    });
            }
            if (date == '' || date == "undefined") {
                    var firstSlot = _.first(timeslots);
                    date = firstSlot.value;
                    
                }
           this.date=date;
            this.getOperationsSlotsFun(date);
            this.cartCalution();
            //this.globals.onCartItem();
           
            // serverUtilityService.getTipOptions();

        }
    };
     getOperationsSlotsFun(d) {
    let restId = this.globals.globalRestaurantId;
    this.getOperationsSlots(restId, d).subscribe((data) => {
      var slots = data.delivery;
      if (slots == '') {
        slots = data.reservation;
      }
      this.globals.cartTimeEdit=slots.toString(", ");
      this.globals.onCart();
    })

  }

    prepareTimeSlot(data: any) {
    let self = this;
    var times = data.timeslots,
      time = _.first(times);
    let restId = this.globals.globalRestaurantId;
    var datekey = this.order_type === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
    var timekey = this.order_type === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId;
    self.setStorage(datekey, this.date);
    self.setStorage(timekey, time);
    self.timeEdit = true;
    self.renderTimeSlots(data.timeslots, self.order_type);
    
    //self.renderDateTime(self.order_type);
    //self.globals.onCartItem();
  }

  renderTimeSlots(data, orderType) {
    let self = this;
    let options = '';
    let notSelected = "";
    var resId = self.globals.globalRestaurantId;

    var selected = self.getStorage('delivery_order_time_' + resId) ? self.getStorage('delivery_order_time_' + resId) : '';
    if (orderType === 'takeout') {
      selected = self.getStorage('takeout_order_time_' + resId) ? self.getStorage('takeout_order_time_' + resId) : '';
    }
    if (selected === '') {
      options += '<option value="">Select Time</option>';
    }
    
    _.each(data, function (item) {
      var select = '';
      if (item == selected) {
        select = ' selected';
        notSelected = select;
      }

      options += '<option value="' + item + '"' + select + '>' + self.get12HourTime(item) + '</option>';
    });
    if (notSelected === '') {
      if (selected !== '') {
        notSelected = '<option value="">Select Time</option>';
      }
      options = notSelected + options;
      if (orderType === 'takeout') {
        self.setStorage('takeout_order_time_' + resId, '');
      } else {
        self.setStorage('delivery_order_time_' + resId, '');
      }
    }
    self.globals.cartTime=options;
    //console.log(self.globals.cartTime);
    self.globals.onCart();
    //$('.t-order-time').html(options);
  };

  getFormattedDateText (date) {
            let self = this;
            var tempDate = this.parseDate(date);
            var tempDate2 = this.parseDate(self.globals.currentRestaurantDetail.current_dateTime);
            if (tempDate.getDate() === tempDate2.getDate()) {
                return 'Today';
            } else {
                return this.weekdays[tempDate.getDay()] + ", " + this.months[tempDate.getMonth()] + " " + tempDate.getDate();
            }
        }

        getCheckTakeout() {
            let self=this;
            var restId =self.globals.globalRestaurantId;
            self.setStorage('order_type_' + restId, 'takeout');
            self.setStorage("select_delivery_" + restId, 'takeout');
            $("#t_delivery").prop("checked", false);
            $('#t_takeout').prop("checked", true);
            self.globals.deliveryOrderCart = false;
            self.globals.onCart();
            self.renderDateTime('takeout');
            self.hidePopUp();
            if (self.getStorage('addtoOrder_' + restId) && self.getStorage('addtoOrder_' + restId) !== '') {
                self.setStorage('addtoOrder_' + restId, '');
            }
            if (self.getStorage('select_delivery_' + restId) && self.getStorage('select_delivery_' + restId) !== '') {
                self.setStorage('select_delivery_' + restId, '');
            }
            // ga('send', 'event', 'Order Summary', "Order Takeout" , "Click_on_order_takeout_Button", 1, true);
        }
}
