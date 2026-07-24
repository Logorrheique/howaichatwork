import { Routes } from '@angular/router';
import { Hello } from './hello/hello';
import { Action } from './action/action';
import { Page } from './page/page';
export const routes: Routes = [
    {
        path:'',
        component:Page
    },
    {
        path:'home',
        pathMatch:'full',
        component: Hello
    },
    {
        path:'actions',
        pathMatch:'full',
        component:Action
    }
];
