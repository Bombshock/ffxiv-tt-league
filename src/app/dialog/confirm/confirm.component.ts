import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export type ConfirmDialogComponentData = {
  body: string;

  header?: string;
  yes?: string;
  no?: string;
}

@Component( {
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: [ './confirm.component.scss' ]
} )
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: ConfirmDialogComponentData
  ) { }

  ngOnInit(): void {
  }

}
