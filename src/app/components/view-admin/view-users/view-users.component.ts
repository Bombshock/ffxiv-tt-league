import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TTUser } from 'src/app/services/auth.service';

@Component( {
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: [ './view-users.component.scss' ]
} )
export class ViewAdminUsersComponent implements OnInit {

  public isLoading = false;
  public users: TTUser[] = [];
  public displayedColumns = [ 'name', 'editor', 'admin' ];

  private usersCollection: AngularFirestoreCollection<TTUser>;

  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.isLoading = true;
    this.usersCollection = this.firestore.collection<TTUser>( 'users' );
    this.usersCollection.valueChanges().subscribe( users => {
      this.users = users;
      this.isLoading = false;
    } )
  }

  ngOnInit(): void {
  }

  public onChange( user: TTUser, role: string ) {
    user.roles[ role ] = !user.roles[ role ];
    this.usersCollection
      .doc( user.uid )
      .set( user )
      .then( () => {
        this.snackBar.open( 'Gespeichert', null, { duration: 1000 } );
      } );
  }
}
