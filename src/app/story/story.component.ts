import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { MainService } from '../main.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  public story: any = '';
  
  @Input()
  public showStory:boolean=false;
  constructor(private mservice: MainService, private globals: Globals) { }
  ngOnInit() {
    let _currentRestId = this.globals.globalRestaurantId;
    this.mservice.getRestaurantStory(_currentRestId)
      .subscribe(storydata => this.story = storydata);
  }

  getImage(baseUrl, imageurl) {
    if (imageurl !== '') {
      return baseUrl + imageurl;
    }
    return imageurl;

  }

}
