import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TTLeague } from 'src/app/types';

export type RulesComponentDialogData = {
  league: TTLeague,
  rules: string;
}

@Component( {
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: [ './rules.component.scss' ]
} )
export class RulesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RulesComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: RulesComponentDialogData
  ) { }

  ngOnInit(): void {
  }

}
