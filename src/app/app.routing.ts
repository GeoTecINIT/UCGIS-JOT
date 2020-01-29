import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';

import { ListComponent } from './views/list/list.component';
import { DetailComponent } from './views/detail/detail.component';
import { NewjoComponent } from './views/newjo/newjo.component';

import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { UserComponent } from './views/user/user.component';
import { OrganizationComponent } from './views/organization/organization.component';
import { OrganizationDetailsComponent } from './views/organizationdetails/organizationdetails.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'JOT'
    },
    children: [
      {
        path: 'list',
        data: {
          title: 'List'
        },
        component: ListComponent
      },
      {
        path: 'user',
        data: {
          title: 'User Details'
        },
        component: UserComponent
      },
      {
        path: 'organization',
        data: {
          title: 'Your Organization(s) Details'
        },
        component: OrganizationComponent
      },
      {
        path: 'organizationdetails/:name',
        data: {
          title: 'Organization Details'
        },
        component: OrganizationDetailsComponent
      },
      {
        path: 'detail/:name',
        data: {
          title: 'Detail'
        },
        component: DetailComponent
      },
      {
        path: 'newjo/:mode',
        data: {
          title: 'New'
        },
        canActivate: [AngularFireAuthGuard],
        component: NewjoComponent
      },
      {
        path: 'newjo/:mode/:name',
        data: {
          title: 'Edit'
        },
        canActivate: [AngularFireAuthGuard],
        component: NewjoComponent
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
