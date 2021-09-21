import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm/confirm.component';
import { TTLeague } from 'src/app/types';

@Component( {
  selector: 'app-view-league-edit',
  templateUrl: './view-league-edit.component.html',
  styleUrls: [ './view-league-edit.component.scss' ]
} )
export class ViewAdminLeagueEditComponent implements OnInit, OnDestroy {

  public league: TTLeague;
  public autoCompleteOptions: string[] = [];
  public autoCompleteOptionsFiltered: string[] = [];
  public newUser: string = '';

  private leagueSub: Subscription;
  private leaguesSub: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.route.params.subscribe( params => {
      if ( this.leagueSub ) {
        this.leagueSub.unsubscribe();
      }
      if ( params.id ) {
        this.leagueSub = this.firestore.doc<TTLeague>( 'leagues/' + params.id ).valueChanges().subscribe( league => {
          this.league = league;
          console.log( league );
          this.filterAutoComplete();
        } )
      }
    } );

    this.leaguesSub = this.firestore.collection<TTLeague>( 'leagues' ).valueChanges().subscribe( leagues => {
      leagues.forEach( league => {
        league.participants.forEach( user => {
          if ( !this.autoCompleteOptions.includes( user ) ) {
            this.autoCompleteOptions.push( user );
          }
        } )
      } );
      this.filterAutoComplete();
    } )
  }

  public ngOnInit(): void {
    //this.firestore.createId();
  }

  public ngOnDestroy(): void {
    if ( this.leagueSub ) {
      this.leagueSub.unsubscribe();
    }
    if ( this.leaguesSub ) {
      this.leaguesSub.unsubscribe();
    }
  }

  public save() {
    this.firestore.collection<TTLeague>( 'leagues' )
      .doc( this.league.uid )
      .set( this.league )
      .then( () => {
        this.snackBar.open( 'Gespeichert', null, { duration: 1000 } );
        this.filterAutoComplete();
      } );
  }

  public deleteUser( user: string ) {
    const index = this.league.participants.indexOf( user.trim() )
    if ( index !== -1 ) {
      this.league.participants.splice( index, 1 );
      this.filterAutoComplete();
      this.save();
    }
  }

  public add() {
    const user = this.newUser.trim();
    if ( user && this.league && !this.league.participants.includes( user ) ) {
      this.league.participants.push( user );
      this.filterAutoComplete();
      this.save();
      this.newUser = '';
    }
  }

  public abort() {
    this.router.navigateByUrl( '/admin/leagues' )
  }

  public archive() {
    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: {
        body: this.league.name + ' archivieren?'
      }
    } );

    dialogRef.afterClosed().subscribe( result => {
      console.log( result );
      if ( result && this.league ) {
        this.league.archived = true;
        this.save();
      }
    } );
  }

  private filterAutoComplete() {
    if ( !this.league ) return;
    this.autoCompleteOptionsFiltered = this.autoCompleteOptions.filter( user => {
      return !this.league.participants.includes( user );
    } )
  }
}
