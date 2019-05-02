import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-ask-dialog',
  templateUrl: './ask-dialog.component.html'
})
export class AskDialogComponent {

  constructor(public dialogRef: MatDialogRef<AskDialogComponent>) { }

  onDelete() {
    this.dialogRef.close(true);
  }

}
