import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './components/index/index.component';
import { PageNotFoundComponent } from './components/404/404.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";
import { SetupComponent } from './components/setup/setup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { PreferencesContentComponent } from './components/preferences-content/preferences-content.component';
import { TransactionsContentComponent } from './components/transactions-content/transactions-content.component';
import { AccountsContentComponent } from './components/accounts-content/accounts-content.component';
import { SavinggoalsContentComponent } from './components/savinggoals-content/savinggoals-content.component';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        PageNotFoundComponent,
        LoginComponent,
        SignupComponent,
        SetupComponent,
        DashboardComponent,
        DashboardContentComponent,
        PreferencesContentComponent,
        TransactionsContentComponent,
        AccountsContentComponent,
        SavinggoalsContentComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
