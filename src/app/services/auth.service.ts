import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export type TTUser = {
  uid: string;
  email: string;
  name: string;
  roles: {
    editor?: boolean;
    admin?: boolean;
  }
}

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  public init = false;
  public user$: Observable<TTUser>;
  private user_: TTUser;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore
  ) {

    this.user$ = this.auth.authState.pipe(
      switchMap( user => {
        if ( !this.init ) {
          setTimeout( () => {
            this.init = true;
          }, 0 )
        }
        if ( user ) {
          return this.afs.doc<TTUser>( `users/${ user.uid }` ).valueChanges()
        } else {
          return of( null )
        }
      } )
    );

    this.user$.subscribe( ( user ) => {
      this.user_ = user;
    } );
  }

  public isEditor() {
    return !!this.user_?.roles.editor || !!this.user_?.roles.admin;
  }

  public isAdmin() {
    return !!this.user_?.roles.admin;
  }

  public updateUserData( user: TTUser ) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc( `users/${ user.uid }` );
    const data: TTUser = {
      uid: user.uid,
      email: user.email,
      name: user.name,
      roles: {}
    }
    return userRef.set( data, { merge: true } )
  }

  public signInWithEmailAndPassword( email: string, password: string ) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  public createUserWithEmailAndPassword( email: string, password: string ) {
    return this.auth.createUserWithEmailAndPassword( email, password );
  }

  public signOut() {
    return this.auth.signOut();
  }
}
