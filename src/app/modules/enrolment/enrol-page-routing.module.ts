import { Routes } from '@angular/router';
import { PrepareComponent } from './pages/prepare/prepare.component';
import { ProcessService } from '../../components/msp/service/process.service';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { SpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { ChildInfoComponent } from './pages/child-info/child-info.component';
import { EnrolAddressComponent } from './pages/address/address.component';
import { ReviewComponent } from './pages/review/review.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { SendingComponent } from './pages/sending/sending.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';

export const enrolPages: Routes = [
    {
        path: 'prepare',
        component: PrepareComponent
    },
    {
        path: 'personal-info',
        canActivate: [ProcessService],
        component: PersonalInfoComponent
    },
    {
        path: 'spouse-info',
        canActivate: [ProcessService],
        component: SpouseInfoComponent
    },
    {
        path: 'child-info',
        canActivate: [ProcessService],
        component: ChildInfoComponent
    },
    {
        path: 'address',
        canActivate: [ProcessService],
        component: EnrolAddressComponent
    },
    {
        path: 'review',
        canActivate: [ProcessService],
        component: ReviewComponent
    },
    {
        path: 'authorize',
        canActivate: [ProcessService],
        component: AuthorizeComponent
    },
    {
        path: 'sending',
        canActivate: [ProcessService],
        component: SendingComponent
    },
    {
        path: 'confirmation',
        canActivate: [],
        component: ConfirmationComponent
    },
    {
        path: '',
        redirectTo: 'prepare'
    }
];
