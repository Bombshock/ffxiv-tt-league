import { Routes } from "@angular/router";
import { ViewAdminComponent } from "./components/view-admin/view-admin.component";
import { ViewAdminLeagueEditComponent } from "./components/view-admin/view-leagues/view-league-edit/view-league-edit.component";
import { ViewAdminLeaguesComponent } from "./components/view-admin/view-leagues/view-leagues.component";
import { ViewAdminUsersComponent } from "./components/view-admin/view-users/view-users.component";
import { ViewLeagueComponent } from "./components/view-league/view-league.component";
import { ViewLoginComponent } from "./components/view-login/view-login.component";
import { ViewRegisterComponent } from "./components/view-register/view-register.component";
import { AdminGuard } from "./guards/admin.guard";

export const routes: Routes = [
    { path: 'login', component: ViewLoginComponent },
    { path: 'register', component: ViewRegisterComponent },
    {
        path: 'admin',
        component: ViewAdminComponent,
        canActivate: [ AdminGuard ],
        children: [
            { path: 'users', component: ViewAdminUsersComponent },
            { path: 'leagues', component: ViewAdminLeaguesComponent },
            { path: 'leagues/:id', component: ViewAdminLeagueEditComponent },
            { path: '', redirectTo: 'users', pathMatch: 'full' },
        ]
    },
    { path: '', component: ViewLeagueComponent },
    { path: '**', redirectTo: '' },
]