import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TEXTS } from './mock-texts';
import { Text } from './text.class';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  text: string;
  form : FormGroup;
  typedText: String;
  index: number = 0;
  value: any;
  error: any;
  textIndex: number = 1;
  end: boolean = false;
  private today: number;
  private tick: any = null;
  private subscription: Subscription;
  totalTime: any;
  countTypeEntries : number = 0;
  wpm: number;
  uncountedErrors: number= 0;

  ngOnInit(){
   this.today = Date.now();

  
 
    this.initForm();
    this.initText();
}

private initForm(){
  this.form = new FormGroup ({
    givenText: new FormControl(),
    text: new FormControl()
  });

}

private initText(){
  const text = this.getTexts();
  this.text = text[0].text;
}

private onKey(event: any) {
 
 this.countTypeEntries ++;
    if(!this.tick){
 let timer = TimerObservable.create(1000, 1000);
    this.subscription = timer.subscribe(t => {
      this.tick = t + 2;
      if(t < 10){
        this.tick = `0${t}`;
      }
    });
    }
   

  if (event.which === 8) {
   this.index --;
   this.countTypeEntries --;
   this.matchText(event.target.value);
  }

  if(event.which === 16) {
    this.countTypeEntries --;
    return false;
  }

  this.matchText(event.target.value);

  }

private changeText() {
  if(this.textIndex === 4){
    this.textIndex= 1;
  }
  this.initForm();
  this.index = 0;
  const text = this.getTexts();
  this.text = text[this.textIndex].text;
  this.textIndex ++;
  this.end = false;
  this.totalTime = 0;
  this.subscription.unsubscribe();
  this.tick = 0;
  this.uncountedErrors = 0;

}

 private getTexts(): Text[] {
    return TEXTS;
  }

  private matchText(value) {

    const splitGivenText = this.text.split("");
    const splitUserText = value.split("");

   
  
    if(!splitGivenText) {
      return false;
    }
    
    if(splitUserText[this.index] == splitGivenText[this.index]) {
      this.error = false;
      this.index ++;
       if(splitGivenText.length === this.index){
       this.end = true;
       this.totalTime = this.tick;
       this.calculateWPM();
       this.subscription.unsubscribe();
    } else {
      this.end = false;
    }
    } else {
      this.uncountedErrors ++;
      this.error = true;
      
    }


  }

  calculateWPM(){
        
       const totalTime = this.totalTime / 60;
       const grossWPM = (this.countTypeEntries / 5)/ totalTime;
       console.log(this.countTypeEntries);
       const errorRate = this.uncountedErrors/totalTime;
       console.log(this.uncountedErrors);
       this.wpm = Math.abs(grossWPM - errorRate);

 
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}



