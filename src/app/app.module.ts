import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AccordionModule, ModalModule } from 'ngx-bootstrap';
import { GeneralAppComponent } from './app.component';
import { CoreFooterComponent } from './components/core/footer';
import { CoreHeaderComponent } from './components/core/header';
import { MspModule } from './components/msp/msp.module';



require('./index.scss')
@NgModule({
  imports: [
    BrowserModule,
    MspModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
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
