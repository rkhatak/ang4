import { Component, OnInit, Input,OnDestroy,Inject,Output, EventEmitter } from '@angular/core';
import { MainService } from '../main.service';
import * as _ from 'underscore';


declare var $ :any;
@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.css'],
  inputs: ['items']
})
export class AddonsComponent implements OnInit {
  inputType: any;
  inputContainerType: any;
  selected: any;
  doSelect: any;
  hasChecked: any;
  inputCheck: any;
  hasCheckedHtml = '';
  items1: any = {}
  addons:any;
  addonSelected:any;
  @Output() selectSubTotal = new EventEmitter<any>();

  constructor(private mservice: MainService) {
    
  }

  public set items(values) {
    if (!values)
      return;

    for (let i = 0; i < values.addons.length; i++) {
      let obj = values.addons[i];
      obj.inputType = obj['selection_type'] == 1 ? "checkbox" : "radio";
      for (let j = 0; j < obj.options.length; j++) {
        let option = obj.options[j];
        for (let k = 0; k < values.selected_options.length; k++) {
          let selectedObj = values.selected_options[j];
          if (option._id == selectedObj.id) {
            option.inputCheck = true;
          }
        }
      }
    }
    this.items1 = values;
    //console.log('items values: ' + JSON.stringify(this.items1));
  }

  ngOnInit() {

  }
  chooseWise(addon) {
    this.inputType = addon['selection_type'] == 1 ? "checkbox" : "radio";
    // this.inputContainerType =  (addon['selection_type'] == 1 ? "prettycheckbox":"prettyradio");
    this.selected = false;
    this.doSelect = (addon['selection_type'] == 1 ? false : true);
    if (addon['selection_type'] == 0) {
      return '(Choose any one)';
    } else if (!parseInt(addon['item_limit'], 10)) {
      if (addon['enable_pricing_beyond']) {
        return '(Choose any ' + addon['enable_pricing_beyond'] + ' item(s) for free)';
      } else {
        return '(Choose wisely)';
      }
    } else {
      return '(Choose any ' + this.mservice.digitToString(addon['item_limit']) + ')';
    }
  }

  hasCheckedFun(item, option) {
    this.hasChecked = _.findWhere(item, { "optionId": parseInt(option['id'], 10) });
    this.inputChecked(option, this.hasChecked);
  }

  inputChecked(option, h) {
    if (h) {
      option.inputCheck = true;
    } else {
      option.inputCheck = false;
    }
  }

  hasCheckedValue(inputCheck) {
    return inputCheck ? 'priority' : '';
  }

  getNameFixed(t, v) {
    if (t == 1) {
      return "addon[" + v + "][]";
    } else {
      return "addon[" + v + "]";
    }
  }

  addAddonsValue (d) {
            this.updateOrderValue(d);
  }

  updateOrderValue=function(e){
    let self=this;
    self.addons=[];
    self.addonSelected=[];
    if(e!=='ch_price'){
        var priority= 1;
        var target = $(e.currentTarget);
        target.data('priority', priority++);
        var parent = target.closest(".addon-collection");
        if(parent) {
            $(".addon-error-message",parent).addClass('hide');
        }
    }
    let val =0;  
    var nowValue = parseFloat($('#item_price').val());
    _.each($(".addon-collection"),function(addons){
        var addon = $(addons);
        var data = addon.data();
        var selectionType = data['selectionType'];
        var inputType = "checkbox";
        if(parseInt(selectionType,10) === 0){
            inputType = "radio";           
        }
        var options = $("input[type="+inputType+"]:checked",addon);
        if(options.length){ 
            var cnt = 0 ,i=0;
            var addonId = 0;
            _.each(options,function(option){                
                var freeAddons =parseInt($(option).data().freeAddons) ;
                var addons = $(option).data() ;
                if(freeAddons >0){                    
                    if((addonId === 0) || (addonId == $(option).data().addonId)){                       
                        if(cnt < freeAddons){                          
                            addons.isFree=true ;                           
                            addons.priority=cnt+1 ;
                            cnt++ ;
                        }else{
                            addons.isFree=false ;
                            addons.priority=i+1 ;
                        }                        
                    }else{                      
                        addons.isFree=false ;
                        addons.priority=i+1 ;
                    }                   
                }else{                   
                    addons.isFree=false ;
                    addons.priority=i+1 ;
                }
                addonId = addons.addonId ; 
                self.addons.push(addons);
                self.addonSelected.push(addons);
                if(addons.isFree===false){
                    val = val + parseFloat(addons.optionPrice);
                }
                i++ ; 
            },this); 
            nowValue = parseFloat($('#item_price').val()) + val; 
        }
    });    
    var subtotal= (Math.round(nowValue * 100) / 100).toFixed(2);
    let sendDToParent={'subtotal':subtotal,'addonSelected':self.addonSelected}
    this.selectSubTotal.emit(sendDToParent);
   
    
    this.addAddonValidation();
    this.updateAddonsText();
}

addAddonValidation(){
    _.each($(".addon-collection"),function(addons){
        var addon = $(addons);
        var data = addon.data();
        var selectionType = data['selectionType'];
        var itemLimit = data['itemLimit'];
        if(parseInt(selectionType,10) == 1){
            var totalSelected = $("input[type=checkbox]:checked",addon).length;
            if(itemLimit && totalSelected >= itemLimit){
                var checkboxes = $("input[type=checkbox]:not(:checked)",addon);
                checkboxes.attr("disabled","disabled");
                checkboxes.parent().find("a:first").addClass("disabled");

            } else {
                var checkboxes = $("input[type=checkbox]:not(:checked)",addon);
                checkboxes.removeAttr("disabled");
                checkboxes.parent().find("a:first").removeClass("disabled");
            }
        }
    });
}
updateAddonsText(){
    let self=this;
    var addonsSeperation = {};
    _.each(this.addons,function(addon){
        if(addon['label'].toLowerCase() != 'none'){
            if(typeof addonsSeperation[addon['addonId']] == 'undefined'){
                addonsSeperation[addon['addonId']] = [];
            }
            addonsSeperation[addon['addonId']].push(addon);
        }
    });
    var html = "";
    
    if(Object.keys(addonsSeperation).length>0){
    _.each(addonsSeperation,function(addons){
         var title = "<b>" + addons[0]['addonName'] + "</b>";
         var labels = " &nbsp;<em>" + self.getLabel(addons).join("</em>,&nbsp;<em>") + "</em>";
         html += title + labels;
    });
  }
  console.log(html);
    $('.y_short_addons').html(html);
}

getLabel(a){
  return _.pluck(a,'label');
}

}
