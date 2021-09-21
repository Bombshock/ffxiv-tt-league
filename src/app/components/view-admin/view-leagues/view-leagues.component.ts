import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TTLeague } from 'src/app/types';

@Component( {
  selector: 'app-view-leagues',
  templateUrl: './view-leagues.component.html',
  styleUrls: [ './view-leagues.component.scss' ]
} )
export class ViewAdminLeaguesComponent implements OnInit {

  public isLoading = false;
  public leagues: TTLeague[] = [];
  public leaguesFiltered: TTLeague[] = [];
  public displayedColumns = [ 'name', 'archived', 'games', 'users', 'active', 'done' ];

  private leaguesCollection: AngularFirestoreCollection<TTLeague>;
  private _showArchive: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.isLoading = true;
    this.leaguesCollection = this.firestore.collection<TTLeague>( 'leagues' );
    this.leaguesCollection.valueChanges().subscribe( leagues => {
      this.leagues = leagues;
      this.isLoading = false;
      this.filterLeagues();
    } )
  }

  ngOnInit(): void {
  }

  public gamesMax( league: TTLeague ) {
    const numPlayers = league.participants.length;
    return ( ( numPlayers - 1 ) * ( numPlayers ) ) / 2;
  }

  public done( league: TTLeague ) {
    league.done = !league.done;
    this.save( league );
  }

  public active( league: TTLeague ) {
    league.active = !league.active;
    this.save( league );
  }

  public add() {
    const name = window.prompt( 'Name' ).trim();
    if ( name ) {
      const newLeague: TTLeague = {
        name,
        uid: this.firestore.createId(),
        participants: [],
        rules: '',
        results: []
      };
      this.save( newLeague );
    }
  }

  public showArchive() {
    this._showArchive = !this._showArchive;
    this.filterLeagues();
  }

  private filterLeagues() {
    this.leaguesFiltered = this.leagues.filter( league => this._showArchive || !league.archived )
  }

  private save( league: TTLeague ) {
    this.leaguesCollection
      .doc( league.uid )
      .set( league )
      .then( () => {
        this.snackBar.open( 'Gespeichert', null, { duration: 1000 } );
      } );
  }
}
