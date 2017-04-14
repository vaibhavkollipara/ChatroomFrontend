import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './_guards/auth.guard';

export const router: Routes = [
    {path : '', redirectTo : 'home', pathMatch : 'full' },
    {path : 'home', component : HomeComponent, canActivate: [AuthGuard] },
    {path : 'chat/:slug', component : ChatComponent, canActivate: [AuthGuard]} ,
    {path : 'login', component : LoginComponent}    
];


export const routes : ModuleWithProviders = RouterModule.forRoot(router);