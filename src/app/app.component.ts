import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TEXTS } from './mock-texts';
import { Text } from './text.class';
import { Subscription, Subject } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public text: string;
  public  form: FormGroup;
 public index: number = 0;
  public error: any;
  public end: boolean = false;
  public tick: any = null;
  public subscription: Subscription;
  public totalTime: any;
  public countTypedEntries: number = 0;
  public wpm: number;
  public uncountedErrors: number = 0;
  public accuracy: number;
  public timer: any;
  public subject = new Subject();

  ngOnInit() {
    this.initForm();
    this.initText();
  }

  private initForm() {
    this.form = new FormGroup({
      text: new FormControl()
    });
  }

  private resetAllValues() {
    this.totalTime = null;
    this.tick = 0;
    this.subject.next();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.index = 0;
    this.end = false;
    this.uncountedErrors = 0;
    this.countTypedEntries = 0;
    this.text = null;
  }


  private initText() {
    const text = this.getTexts();
    const randomNumberWithinRange = Math.random() * (text.length - 0) + 0;
    const randomIndex = parseInt(JSON.stringify(randomNumberWithinRange), 10);
    this.text = text[randomIndex].text;
  }

  private onKey(event: any) {

    this.countTypedEntries++;

    if (!this.tick) {
      let timer = TimerObservable.create(1000, 1000);
      this.subscription = timer.takeUntil(this.subject).subscribe(t => {
        this.tick = t + 2;
      });
    }

    if (event.which === 8) {
      this.index--;
      this.countTypedEntries--;
    }

    if (event.which === 16) {
      this.countTypedEntries--;
      return false;
    }

    this.matchText(event.target.value);

  }

  public changeText() {
    this.resetAllValues();
    this.initForm();
    this.initText();
  }

  private getTexts(): Text[] {
    return TEXTS;
  }

  private matchText(value) {

    const splitGivenText = this.text.split("");
    const splitUserText = value.split("");

    if (!splitGivenText) {
      return false;
    }

    if (splitUserText[this.index] == splitGivenText[this.index]) {
      this.error = false;
      this.index++;
      if (splitGivenText.length === this.index) {
        this.end = true;
        this.totalTime = this.tick;
        this.calculateWPM();
      } else {
        this.end = false;
      }
    } else {
      this.uncountedErrors++;
      this.error = true;
    }
  }

  private calculateWPM() {
    const totalTime = this.totalTime / 60;
    const grossWPM = ((this.countTypedEntries / 5) / totalTime);
    const errorRate = this.uncountedErrors / totalTime;
    this.accuracy = 100 - ((this.uncountedErrors / this.countTypedEntries) * 100);
    this.wpm = Math.abs(grossWPM - errorRate);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subject.unsubscribe();
  }
}



