import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewLeagueComponent } from './dialog/new-league/new-league.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LeagueTableComponent } from './components/league-table/league-table.component';
import { ViewLoginComponent } from './components/view-login/view-login.component';
import { ViewRegisterComponent } from './components/view-register/view-register.component';
import { ViewLeagueComponent } from './components/view-league/view-league.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewAdminComponent } from './components/view-admin/view-admin.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ViewAdminUsersComponent } from './components/view-admin/view-users/view-users.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewAdminLeaguesComponent } from './components/view-admin/view-leagues/view-leagues.component';
import { PlayerDialogComponent } from './dialog/player/player.component';
import { MarkedDirective } from './directives/marked.directive';
import { RulesComponent } from './dialog/rules/rules.component';
import { ViewAdminLeagueEditComponent } from './components/view-admin/view-leagues/view-league-edit/view-league-edit.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConfirmDialogComponent } from './dialog/confirm/confirm.component';

@NgModule( {
  declarations: [
    AppComponent,
    NewLeagueComponent,
    LeagueTableComponent,
    ViewLoginComponent,
    ViewRegisterComponent,
    ViewLeagueComponent,
    ViewAdminComponent,
    ViewAdminUsersComponent,
    ViewAdminLeaguesComponent,
    PlayerDialogComponent,
    MarkedDirective,
    RulesComponent,
    ViewAdminLeagueEditComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot( routes ),
    AngularFireModule.initializeApp( environment.firebase ),
    AngularFirestoreModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatAutocompleteModule
  ],
  providers: [ PlayerDialogComponent ],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
