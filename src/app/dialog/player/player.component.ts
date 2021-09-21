import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { TTLeague } from 'src/app/types';

export type PlayerComponentDialogData = {
  league: TTLeague;
  player: string;
}

@Component( {
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: [ './player.component.scss' ]
} )
export class PlayerDialogComponent implements OnInit {

  public games = [];

  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PlayerDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: PlayerComponentDialogData,
    public auth: AuthService
  ) {
    this.genGames();
  }

  ngOnInit(): void {
  }

  public edit( game, side, text ) {
    const result = parseFloat( window.prompt( text ) );
    if ( isNaN( result ) ) return;

    let foundGame = this.findGameVersus( game.enemy );

    if ( !foundGame ) {
      foundGame = {
        player1: this.data.player,
        player1points: 0,
        player2: game.enemy,
        player2points: 0
      };
      this.data.league.results.push( foundGame );
    } else {
      foundGame.player1points = foundGame.player2 === game.enemy ? game.player1points : game.player2points;
      foundGame.player2points = foundGame.player1 === game.enemy ? game.player1points : game.player2points;
      foundGame.player1 = this.data.player;
      foundGame.player2 = game.enemy;
    }

    game[ side ] = foundGame[ side ] = result;

    if ( game.player1points !== undefined && game.player2points !== undefined ) {
      game.done = true;
      this.firestore.collection<TTLeague>( 'leagues' )
        .doc( this.data.league.uid )
        .set( this.data.league )
        .then( () => {
          this.snackBar.open( 'Gespeichert', null, { duration: 1000 } );
        } );

      this.genGames();
    }
  }

  private genGames() {
    this.games = [];
    this.data.league.participants
      .filter( player => player !== this.data.player )
      .forEach( enemy => {

        const game = this.findGameVersus( enemy );
        const done = !!game;
        let player2points;
        let player1points;

        if ( done ) {
          player2points = game.player1 === enemy ? game.player1points : game.player2points;
          player1points = game.player2 === enemy ? game.player1points : game.player2points
        }

        this.games.push( {
          enemy,
          player2points,
          player1points,
          done
        } )
      } )
  }

  private findGameVersus( enemy: string ) {
    for ( const game of this.data.league.results ) {
      if (
        ( game.player1 === this.data.player && game.player2 === enemy ) ||
        ( game.player2 === this.data.player && game.player1 === enemy )
      ) {
        return game;
      }
    }
  }
}
