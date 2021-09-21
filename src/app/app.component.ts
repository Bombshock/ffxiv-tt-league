import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  public ngOnInit(): void {
  }

  public home() {
    this.router.navigateByUrl( '/' );
  }

  public login() {
    this.router.navigateByUrl( '/login' );
  }

  public logout() {
    this.auth.signOut();
  }

  public admin() {
    this.router.navigateByUrl( '/admin' );
  }
}
