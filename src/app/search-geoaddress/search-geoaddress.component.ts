import { ElementRef,Component, OnInit,OnDestroy,NgZone,ViewChild } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { MainService } from '../main.service';
import { Globals } from '../globals';
import {} from '@types/googlemaps';
import * as _ from 'underscore';
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-search-geoaddress',
  templateUrl: './search-geoaddress.component.html',
  styleUrls: ['./search-geoaddress.component.css']
})
export class SearchGeoaddressComponent implements OnInit,OnDestroy {

  constructor(private mservice: MainService,private globals:Globals,private ngZone: NgZone) {
    this.onThemeSetEvent$Subscription = this.globals.onThemeSetEvent.subscribe(
          () => {
            this.currentRestaurant=this.globals.currentRestaurantDetail;
          }
        );
   }
 @ViewChild("searchTextField")
  public searchElementRef: ElementRef;   
onThemeSetEvent$Subscription:Subscription;
currentRestaurant:any;
rightAddress:boolean=false;
wrongAddress:boolean=false;
invalidAddress:boolean=false;
  ngOnInit() {
    this.currentRestaurant=this.globals.currentRestaurantDetail;
  }
  seoAddressSeachByLocation(){
     var self = this;
            var bodytop = Math.abs(parseInt($('body').css('margin-top')));
            $('.pac-container').css('margin-top', bodytop);
            if ($('.pac-container').length == 0) {
                var options = {types: ['geocode'], componentRestrictions: {country: "us"}};
                var input = document.getElementById('searchTextField');
                var autocomplete = new google.maps.places.Autocomplete(input, options);
                google.maps.event.addListener(autocomplete, 'place_changed', function () {
                    var place = autocomplete.getPlace();
                    self.rightAddress = false;
                    self.wrongAddress = false;
                    self.invalidAddress = false;
                    if ($.trim(place.address_components[0].types) === 'street_number') {
                        $('#fullAddress').val(place.formatted_address);
                        $('#addressLat').val(place.geometry.location.lat());
                        $('#addressLng').val(place.geometry.location.lng());
                        $('#addressType').val(place.geometry.location.lng());
                       //self.verifyDeliveryAddress();
                        return false;

                    } else {
                       self.invalidAddress = true;
                        $('#fullAddress').val('');
                        $('#addressLat').val('');
                        $('#addressLng').val('');
                        $('#addressType').val('');
                        return false;
                    }
                });
            }
  }
getDistance(options) {
            var point1 = typeof options['point1'] != "undefined" ? options['point1'] : {},
                    point2 = typeof options['point2'] != "undefined" ? options['point2'] : {},
                    return_type = typeof options['return_type'] != 'undefined' ? options['return_type'].toLowerCase() : "mi",
                    precision = typeof options['precision'] != 'undefined' && !isNaN(options['precision']) ? parseInt(options['precision'], 10) : 2,
                    distance = NaN;
            if (!_.isEmpty(point1) && !_.isEmpty(point2)) {
                var p1 = new google.maps.LatLng(point1["latitude"], point1["longitude"]),
                        p2 = new google.maps.LatLng(point2["latitude"], point2["longitude"]);
                distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000;
            }
            if (isNaN(distance)) {
                throw "-- Cannot Calculate Distance --";
            }
            if (return_type === "mi") {
                distance = distance * 0.621371;
            } else if (return_type === "km") {
            }

            var precisionNumber = Math.pow(10, precision);
            distance = Math.round(distance * precisionNumber) / precisionNumber;
            return distance;
        }
  verifyDeliveryAddress() {
            let self=this;
            //ga('send', 'event', 'Order Summary', "Verify & Proceed To order" , "Click_on_Verify_&_proceed_to_order_Button", 1, true);       
            var restId =self.globals.globalRestaurantId;
            var _currentRestaurant =self.currentRestaurant;
            
            if ($('#searchTextField').val() === '') {
                self.invalidAddress = true;
                $('#fullAddress').val('');
                $('#addressLat').val('');
                $('#addressLng').val('');
                $('#addressType').val('');
                $('.t_proceed_takeout , .t-verify_proceed').removeClass('disable_actions');
                return false;
            }
            var lat = $('#addressLat').val(), lng = $('#addressLng').val(), addressType = $('#addressType').val();
            var fullAddress = $('#fullAddress').val();
            if ((lat !== '') && (lng !== '')) {
                $('.lineloader').removeClass('hide');
                $('.error-message').addClass('hide');
                var distance = this.getDistance({
                    point1: {
                        latitude: _currentRestaurant['latitude'],
                        longitude: _currentRestaurant['longitude']
                    },
                    point2: {
                        latitude: lat,
                        longitude: lng
                    }
                });
                self.mservice.candeliver(restId,lat,lng).subscribe((data)=>{
                            $('.lineloader').addClass('hide');
                            if (data.can_deliver == true) {
                               self.mservice.setStorage("can_deliver_" + restId, data.can_deliver);
                                $('.m_location_verify').removeClass('errow');
                                $('.t-right_address').removeClass('hide');
                                self.mservice.setStorage('order_type_' + restId, 'delivery');
                                self.globals.deliveryOrderCart = true;
                                self.rightAddress = true;
                                $('.t_delivery_address').html(fullAddress);
                                self.mservice.setStorage("can_deliver_" + restId, true);
                                self.mservice.setStorage("address_value_" + restId, fullAddress);
                                self.mservice.setStorage("address_distance_" + restId, distance);
                                self.mservice.setStorage("address_lat_" + restId, lat);
                                self.mservice.setStorage("address_lng_" + restId, lng);
                                self.mservice.setStorage("address_type_" + restId, addressType);
                                self.renderDeliveryAddress();
                                setTimeout(function () {
                                    self.mservice.hidePopUp();
                                    $("#t_delivery").prop("checked", true);
                                    if (self.mservice.getStorage('addtoOrder_' + restId) && JSON.parse(self.mservice.getStorage('addtoOrder_' + restId)) !== '') {
                                        self.mservice.setStorage('addtoOrder_' + restId, '');
                                    }
                                    if (self.mservice.getStorage('select_delivery_' + restId) && self.mservice.getStorage('select_delivery_' + restId) !== '') {
                                        $('#t_takeout').prop("checked", false);
                                        $("#t_delivery").prop("checked", true);
                                        self.mservice.setStorage("order_type_" + restId, 'delivery');
                                        self.mservice.renderDateTime('delivery')
                                        self.mservice.cartCalution();
                                        self.mservice.getTipOptions();
                                        self.mservice.setStorage('select_delivery_' + restId, '');
                                    }
                                    $('.t_proceed_takeout , .t-verify_proceed').removeClass('disable_actions');
                                }, 2000);
                                self.mservice.cartCalution();
                            } else {
                                self.wrongAddress = true;
                                self.mservice.setStorage("can_deliver_" + restId, false);
                                self.mservice.setStorage("address_value_" + restId, '');
                                self.mservice.setStorage("address_distance_" + restId, '');
                                self.renderDeliveryAddress();
                                $('.t_proceed_takeout , .t-verify_proceed').removeClass('disable_actions');
                            }
                })
            } else {
                this.getLatByAddress();
            }
        }
renderDeliveryAddress () {
            let self=this;
            var restId =self.globals.globalRestaurantId;
            if (self.mservice.getStorage("address_value_" + restId) && self.mservice.getStorage("address_value_" + restId) !== '') {
                $('.ordertype_location').removeClass('hide');
                $('.t_distance_text').html('This restaurant is about ' + self.mservice.getStorage("address_distance_" + restId) + ' mile from');
                $('.t_delivery_address').html(self.mservice.getStorage("address_value_" + restId));
                if (self.mservice.getStorage("can_deliver_" + restId)) {
                    $('.y-deleiver-yes').removeClass('hide');
                    $('.y-deleiver-no').addClass('hide');
                } else {
                    $('.y-deleiver-yes').addClass('hide');
                    $('.y-deleiver-no').removeClass('hide');
                }
                $('.t_change_address').removeClass('hide');
            } else {
                $('.t_change_address').addClass('hide');
            }
        };
  getLatByAddress () {
            var self = this;
            $('.t_proceed_takeout , .t-verify_proceed').addClass('disable_actions');
            if($('#searchTextField').val()==""){
               self.invalidAddress = true;
            }
            $('.lineloader').removeClass('hide');
            var googleAddres = new google.maps.Geocoder();
            var streetCase = [
                'street_address',
                'route',
                'premise',
                'subpremise',
                'natural_feature',
                'airport',
                'park',
                'establishment'
            ];
            googleAddres.geocode({
                address: $('#searchTextField').val(),
                componentRestrictions: {country: "us"}
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var addressType = self.getAddressType(results[0], streetCase);
                    if (addressType === 'street') {
                        let latLong:any = {};
                        _.each(results, function (result) {
                            latLong.lat = result["geometry"]["location"]["lat"]().toFixed(5);
                            latLong.lng = result["geometry"]["location"]["lng"]().toFixed(5);
                            latLong.address = result["formatted_address"];
                            latLong.type = addressType;
                        });
                        $('#fullAddress').val(latLong.address);
                        $('#addressLat').val(latLong.lat);
                        $('#addressLng').val(latLong.lng);
                        $('#addressType').val(latLong.type);
                        self.verifyDeliveryAddress();
                    } else {
                        $('.t-invalid_address').removeClass('hide');
                        $('.lineloader').addClass('hide');
                        $('.t_proceed_takeout , .t-verify_proceed').removeClass('disable_actions');
                    }
                }
            });
        }
  getAddressType (response, streetCase) {
            var types = _.pluck(response['address_components'], 'types');
            var extractedTypes = [];
            _.each(types, function (type) {
                extractedTypes = extractedTypes.concat(type);
            });
            extractedTypes = _.union(extractedTypes);
            if (_.intersection(extractedTypes, streetCase).length) {
                return 'street';
            } else {
                return 'others';
            }
        }

  getCheckTakeout = function () {
            this.mservice.getCheckTakeout();
  }                  
  ngOnDestroy(){
    if(this.onThemeSetEvent$Subscription){
      this.onThemeSetEvent$Subscription.unsubscribe();
    }
  }
}
