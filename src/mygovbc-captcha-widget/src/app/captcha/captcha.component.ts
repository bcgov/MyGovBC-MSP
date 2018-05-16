import {Component, ElementRef, ViewChild, SimpleChanges, NgZone,
  ChangeDetectorRef, Output, Input, AfterViewInit, OnInit, OnChanges, EventEmitter} from '@angular/core';
import { Http, Response } from '@angular/http';
import { CaptchaDataService } from '../captcha-data.service';

@Component({
  selector: 'captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss']
})
export class CaptchaComponent implements AfterViewInit, OnInit, OnChanges {

  @ViewChild('image') imageContainer: ElementRef;
  @ViewChild('audioElement') audioElement: ElementRef;
  @Input('apiBaseUrl') apiBaseUrl: string;
  @Input('nonce') nonce: string;
  @Output() onValidToken = new EventEmitter<string>();
  @Input('successMessage') successMessage:String;
  @Input('eagerFetchAudio') eagerFetchAudio:String;
  @Input('userPromptMessage') userPromptMessage?:string = "Enter the text you either see in the box or you hear in the audio";

  /**
   * Http error response for fetching a CAPTCHA image.
   */
  errorFetchingImg = null;

  /**
   * Http error response for verifying user's answer.
   */
  errorVerifyAnswer = null;

  private validation = "";
  public audio = "";
  public answer = "";

  state:CAPTCHA_STATE;
  incorrectAnswer:boolean;

  public fetchingAudioInProgress = false;

  constructor(private dataService: CaptchaDataService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone) {
  }

  ngOnInit(){
    if(!this.successMessage){
      this.successMessage = "You can submit your application now.";
    }

    this.forceRefresh.bind(this);
    window['ca.bcgov.captchaRefresh'] = this.publicForceRefresh.bind(this);

    // if(!this.userPromptMessage){
    //   this.userPromptMessage = "Enter the text you either see in the box or you hear in the audio";      
    // }
  }
  ngAfterViewInit() {
    this.forceRefresh();
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.reloadCaptcha && (true === changes.reloadCaptcha.previousValue || false === changes.reloadCaptcha.previousValue)
      && (changes.reloadCaptcha.currentValue != changes.reloadCaptcha.previousValue)){
        this.getNewCaptcha(false);
      }
  }  

  forceRefresh(){
    this.getNewCaptcha(false);
    this.cd.detectChanges();
  }

  publicForceRefresh() {
    this.ngZone.run(() => this.forceRefresh());
  }  

  answerChanged (event:any) {
    if(this.answer.length < 6){
      this.incorrectAnswer = null;
    }
    if (this.answer.length === 6) {
      this.state = CAPTCHA_STATE.VERIFYING_ANSWER;
      this.incorrectAnswer = null;
      this.dataService.verifyCaptcha(this.apiBaseUrl, this.nonce, this.answer, this.validation).subscribe(
        (res:Response) => {
          let payload = res.json();
          if( this.isValidPayload(payload)){
            this.handleVerify(payload);
          }else{
            this.state = CAPTCHA_STATE.ERROR_VERIFY;
            this.errorVerifyAnswer = this.createErrorTextLine(res);
          }
        },
        (error:Response) => {
          this.state = CAPTCHA_STATE.ERROR_VERIFY;
          this.errorVerifyAnswer = this.createErrorTextLine(error);
          console.log('Error response from verifying user answer: %o', error);
        }
      );
    }
  }

  // Call the backend to see if our answer is correct
  private handleVerify(payload:any) {
    //There could be the rare change where an invalid payload response is received.
    if (payload.valid === true) {
      this.state = CAPTCHA_STATE.SUCCESS_VERIFY_ANSWER_CORRECT;
      this.onValidToken.emit(payload.jwt);
    } else {
      this.incorrectAnswer = true;
      this.answer = "";
      this.audio = "";
      // They failed - try a new one.
      this.getNewCaptcha(true);
    }
  }

  /**
   * Case where HTTP 200 response code is received by the payload is incorrect or corrupt.
   * The occurance of this type of case should be rare.
   * @param payload 
   */
  private isValidPayload(payload){
    // console.debug('Response payload: %o', payload);
    if(!payload){
      console.error("payload cannot be null or undefined or 0");
      return false;
    }else{
      let hasValueProp = payload.hasOwnProperty('valid');
      if(!hasValueProp){
        console.error('payload must have its own property named \'valid\'');
        return false;
      }else{
        return true;
      }
    }
  }

  public retryFetchCaptcha() {
    console.log('Retry captcha');
    this.state = undefined;

    /**
     * wait for 0.5 seond before resubmitting
     */
    setTimeout(() => {
      this.getNewCaptcha(false)
    }, 100);
  }

  public playAudio() {
    if (this.audio && this.audio.length > 0) {
       this.audioElement.nativeElement.play();
    }
    else {
      this.fetchAudio(true);
    }
  }

  private fetchAudio(playImmediately:boolean = false){
    if(!this.fetchingAudioInProgress){
      this.fetchingAudioInProgress = true;
      this.dataService.fetchAudio(this.apiBaseUrl, this.validation).subscribe(
        (response: Response) => {
          this.fetchingAudioInProgress = false;
          let payload = response.json();
          this.audio = payload.audio;
          this.cd.detectChanges();
          if(playImmediately){
            this.audioElement.nativeElement.play();
          }
        },
        (error: Response) => {
          this.fetchingAudioInProgress = false;
          console.log('Error response from fetching audio CAPTCHA: %o', error);
          this.cd.detectChanges();
        }
      );
    }
  }

  public getNewCaptcha(errorCase:any) {
    this.state = CAPTCHA_STATE.FETCHING_CAPTCHA_IMG;
    this.audio = "";

    // Reset things
    if (!errorCase) {
      // Let them know they failed instead of wiping out the answer area
      // Contructing this form on page load/reload will have errorCase = false
      this.incorrectAnswer = null;
    }

    this.dataService.fetchData(this.apiBaseUrl, this.nonce).subscribe(
      (response:Response) => {
        this.state = CAPTCHA_STATE.SUCCESS_FETCH_IMG;

        let payload = response.json();
        this.imageContainer.nativeElement.innerHTML = payload.captcha;
        this.validation = payload.validation;
        this.cd.detectChanges();

        if(this.eagerFetchAudio === 'true'){
          // console.log('Fetch audio eagerly');
          this.fetchAudio();
        }else{
          // console.log('Not to fetch audio eagerly');
        }
      },

      (error:Response) => {
        this.state = CAPTCHA_STATE.ERROR_FETCH_IMG;
        this.errorFetchingImg = this.createErrorTextLine(error);
        console.log('Error esponse from fetching CAPTCHA text: %o', error);
        this.cd.detectChanges();
      }
    );
  }

  private createErrorTextLine(error:Response){

    let line = 'Error status: ' + error.status;
    if(error.statusText){
      line = line + ', status text: ' + error.statusText;
    }
    return line;
  }

}

/**
 * 7 mutually exclusive states, the program can only be in one of these state
 * at any given point..
 */
enum CAPTCHA_STATE {
  FETCHING_CAPTCHA_IMG = 1,
  SUCCESS_FETCH_IMG = 2,
  ERROR_FETCH_IMG = 3,
  VERIFYING_ANSWER = 4,
  SUCCESS_VERIFY_ANSWER_CORRECT = 5,
  //http error during verification call.
  ERROR_VERIFY = 6,
  // SUCCESS_VERIFY_ANSWER_INCORRECT = 6,
}