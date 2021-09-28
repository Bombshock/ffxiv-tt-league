import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PlayerDialogComponent } from 'src/app/dialog/player/player.component';
import { RulesComponent } from 'src/app/dialog/rules/rules.component';
import { TTLeague, TTLeagueResult } from 'src/app/types';

@Component( {
  selector: 'app-view-league',
  templateUrl: './view-league.component.html',
  styleUrls: [ './view-league.component.scss' ]
} )
export class ViewLeagueComponent implements OnInit, OnDestroy {

  doneGamesThisLeague = 0;
  maxGamesPerLeague = 0;
  maxGamesPerPlayer = 0;
  leagues: Observable<TTLeague[]>;
  league?: TTLeague;
  leagueResults: MatTableDataSource<TTLeagueResult> = new MatTableDataSource( [] );
  leaguesFiltered: TTLeague[] = [];
  displayedColumns = [ 'name', 'points', 'win', 'loss', 'draw', 'games' ];
  @ViewChild( MatSort ) sort: MatSort;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private firestore: AngularFirestore,
    private dialog: MatDialog
  ) {
    this.leagues = this.firestore.collection<TTLeague>( 'leagues' ).valueChanges();

    this.leagues
      .pipe(
        takeUntil( this.ngUnsubscribe ),
      )
      .subscribe( ( leagues ) => {
        this.leaguesFiltered = leagues.filter( league => league.active && !league.done && !league.archived );
        if ( !this.league || !this.leaguesFiltered.includes( this.league ) ) {
          this.league = this.leaguesFiltered[ 0 ];
        }
        if ( this.league ) {
          this.calculateResults();
        } else {
          this.reset();
        }
      } );
  }

  public reset() {
    this.doneGamesThisLeague = 0;
    this.maxGamesPerLeague = 0;
    this.maxGamesPerPlayer = 0;
    this.leagueResults = new MatTableDataSource( [] );
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public ngAfterViewInit(): void {
    setTimeout( () => {
      this.sort.sort( {
        id: 'points',
        start: 'desc',
        disableClear: false
      } );
    } );
  }

  public showPlayer( player: string ) {
    const dialogRef = this.dialog.open( PlayerDialogComponent, {
      data: {
        league: this.league,
        player
      }
    } );

    dialogRef.afterClosed().subscribe( _result => { } );
  }

  public rules() {
    const dialogRef = this.dialog.open( RulesComponent, {
      data: {
        league: this.league,
        rules: this.league.rules
      }
    } );

    dialogRef.afterClosed().subscribe( _result => { } );
  }

  public selectLeague() {
    if ( this.league ) {
      this.calculateResults();
    } else {
      this.reset();
    }
  }

  private calculateResults() {
    if ( !this.league ) return;

    const map: { [ key: string ]: TTLeagueResult } = {};
    const numPlayers = this.league.participants.length;

    this.maxGamesPerPlayer = numPlayers - 1;
    this.maxGamesPerLeague = ( ( numPlayers - 1 ) * ( numPlayers ) ) / 2;
    this.doneGamesThisLeague = 0;

    for ( const name of this.league.participants ) {
      map[ name ] = { name, win: 0, loss: 0, points: 0, draw: 0, games: 0 };
    }

    for ( const game of this.league.results ) {
      if ( !this.league.participants.includes( game.player1 ) ) continue;
      if ( !this.league.participants.includes( game.player2 ) ) continue;

      if ( game.player1points > game.player2points ) {
        map[ game.player1 ].win++;
        map[ game.player2 ].loss++;
      } else if ( game.player1points < game.player2points ) {
        map[ game.player2 ].win++;
        map[ game.player1 ].loss++;
      } else {
        map[ game.player2 ].draw++;
        map[ game.player1 ].draw++;
      }

      if ( this.league.mode === 'diff' ) {
        map[ game.player1 ].points += game.player1points - game.player2points;
        map[ game.player2 ].points += game.player2points - game.player1points;
      } else {
        map[ game.player1 ].points += game.player1points;
        map[ game.player2 ].points += game.player2points;
      }

      map[ game.player1 ].points = Math.round( map[ game.player1 ].points * 10 ) / 10;
      map[ game.player2 ].points = Math.round( map[ game.player2 ].points * 10 ) / 10;

      map[ game.player1 ].games++;
      map[ game.player2 ].games++;

      this.doneGamesThisLeague++;
    }

    this.leagueResults = new MatTableDataSource( Object.values( map ) );
    this.leagueResults.sort = this.sort;
  }
}
