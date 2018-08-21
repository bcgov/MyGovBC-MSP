import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {AccordionModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import { GeneralAppComponent } from './app.component';
import { CoreFooterComponent } from './components/core/footer';
import { CoreHeaderComponent } from './components/core/header';
import { MspModule } from './components/msp/msp.module';
import { HttpClientModule} from "@angular/common/http";


require('./index.scss');
@NgModule({
  imports: [
    BrowserModule,
    MspModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: 'msp', pathMatch: 'full' }
    ])
    
  ],
  declarations: [
    CoreHeaderComponent, CoreFooterComponent, 
    GeneralAppComponent
  ],
  bootstrap: [CoreHeaderComponent, CoreFooterComponent, GeneralAppComponent]
})
export class AppModule {
}
