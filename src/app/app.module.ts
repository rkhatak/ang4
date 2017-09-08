import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HttpModule }    from '@angular/http';
import {LocalStorageService, LocalStorage} from 'ng2-webstorage';
import { AppComponent } from './app.component';
import { MainService } from './main.service';
import {Globals} from './globals';
import {HeaderComponent} from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MenuComponent } from './menu/menu.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactComponent } from './contact/contact.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReplaceTagDirective } from '../directives/replace-tag.directive';
import { FooterComponent } from './footer/footer.component';
import { SafePipe } from './safe.pipe';
import { StoryComponent } from './story/story.component';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import { RouterModule }   from '@angular/router';
import {PageSliderModule}    from 'ng2-page-slider';
import { AgmCoreModule } from '@agm/core';
import { NumberFormatPipe } from './number-format.pipe';
import { DialogComponent } from './dialog/dialog.component';
import { VideoSourceComponent } from './video-source/video-source.component';
import { LoginSourceComponent } from './login-source/login-source.component';
import { RegisterSourceComponent } from './register-source/register-source.component';
import { TwitterRegisterComponent } from './twitter-register/twitter-register.component';
import { ReservationLinkFormComponent } from './reservation-link-form/reservation-link-form.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { CardItemComponent } from './card-item/card-item.component';
import { SearchGeoaddressComponent } from './search-geoaddress/search-geoaddress.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderLinkFormComponent } from './order-link-form/order-link-form.component';
import { AddonsComponent } from './addons/addons.component';
import { TemplateVaribaleDirective } from './template-varibale.directive';
import { OrderItemComponent } from './order-item/order-item.component';
import { CartTimeComponent } from './cart-time/cart-time.component';
import { OwlModule } from 'ng2-owl-carousel';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    MenuComponent,
    GalleryComponent,
    ContactComponent,
    ReplaceTagDirective,
    FooterComponent,
    SafePipe,
    StoryComponent,
    NumberFormatPipe,
    DialogComponent,
    VideoSourceComponent,
    LoginSourceComponent,
    RegisterSourceComponent,
    TwitterRegisterComponent,
    ReservationLinkFormComponent,
    ReservationFormComponent,
    CardItemComponent,
    SearchGeoaddressComponent,
    ActivityListComponent,
    OrderDetailsComponent,
    OrderLinkFormComponent,
    AddonsComponent,
    TemplateVaribaleDirective,
    OrderItemComponent,
    CartTimeComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,Ng2PageScrollModule,PageSliderModule,FormsModule,OwlModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyCXT_lsfclOy7_1PHp2lFfoM-Ujwb3-cdA'
    // }),
    RouterModule.forRoot([
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'menu',
        component: MenuComponent
      },
      {
        path: 'gallery',
        component: GalleryComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: ':id/home',
        component: HomeComponent
      },
      {
        path: ':id/about',
        component: AboutComponent
      },
      {
        path: ':id/menu',
        component: MenuComponent
      },
      {
        path: ':id/gallery',
        component: GalleryComponent
      },
      {
        path: ':id/contact',
        component: ContactComponent
      },
      {
        path: ':id/checkout',
        component: CheckoutComponent
      },
      {
        path: '',
        component: HomeComponent
      },
    ])
  ],
  providers: [
    MainService,Globals,LocalStorageService    
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
