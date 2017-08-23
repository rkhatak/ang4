import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { ReplaceTagDirective } from '../directives/replace-tag.directive';
import { FooterComponent } from './footer/footer.component';
import { SafePipe } from './safe.pipe';
import { StoryComponent } from './story/story.component';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import { RouterModule }   from '@angular/router';
import {PageSliderModule}    from 'ng2-page-slider';

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
    StoryComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,Ng2PageScrollModule,PageSliderModule,
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
