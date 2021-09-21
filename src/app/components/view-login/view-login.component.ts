import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component( {
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: [ './view-login.component.scss' ]
} )
export class ViewLoginComponent implements OnInit {

  public email = '';
  public pass = '';

  public isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  public login(): void {
    this.isLoading = true;
    this.auth.signInWithEmailAndPassword( this.email, this.pass )
      .then( () => {
        this.isLoading = false;
        this.router.navigateByUrl( '/' );
      } )
      .catch( e => {
        this.isLoading = false;
        this.snackBar.open( 'Login Fehlgeschlagen', null, { duration: 3000 } );
      } );
  }
}
