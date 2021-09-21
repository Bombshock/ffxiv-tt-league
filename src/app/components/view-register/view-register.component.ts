import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component( {
  selector: 'app-view-register',
  templateUrl: './view-register.component.html',
  styleUrls: [ './view-register.component.scss' ]
} )
export class ViewRegisterComponent implements OnInit {

  public registerForm = new FormGroup( {
    email: new FormControl( '', [ Validators.required, Validators.email ] ),
    pass: new FormControl( '', [ Validators.required, Validators.minLength( 8 ) ] ),
    name: new FormControl( '', [ Validators.required, Validators.minLength( 3 ) ] )
  } )

  public isLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public register(): void {
    if ( !this.registerForm.valid ) return;

    this.isLoading = true;

    this.auth.createUserWithEmailAndPassword( this.registerForm.value.email, this.registerForm.value.pass )
      .then( result => {
        return result.user.updateProfile( { displayName: this.registerForm.value.name } ).then( () => result );
      } )
      .then( ( result ) => {
        this.auth.updateUserData( { email: result.user.email, name: result.user.displayName, uid: result.user.uid, roles: {} } );
      } )
      .then( () => {
        this.isLoading = false;
        this.router.navigateByUrl( '/' );
      } )
      .catch( e => {
        this.isLoading = false;
        console.error( e );
      } );
  }

}
