import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MainService} from '../../shared/main.service';
import {HttpResponse} from '@angular/common/http';
import {MatDialog} from "@angular/material";
import {PathfinderComponent} from "./pathfinder/pathfinder.component";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  methods: string[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
  statusCodes: number[] = [200, 400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
    414, 415, 416, 417, 418, 426, 428, 429, 431, 451, 500, 501, 502, 503];
  types : string[] = ["application/json", "application/xml", "text/plain"];
  requestForm : FormGroup;
  //response: HttpResponse<string>;
  response: string;
  fullPath: string;
  method: string;
  code: number;

  constructor(private mainService: MainService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.initForm();
    this.mainService.response.subscribe(
      (resp : HttpResponse<string>) => {
        this.response = resp.body;
        this.response = this.response;
        console.log("Response: ", this.response);
      },
      (error) => {
        console.log("ERROR: ", error);
      }
    );
  }

  private initForm() {
    let path = '';
    let method = '';
    let code = '';
    let contentType = '';
    this.requestForm = new FormGroup({
      'path' : new FormControl(path, [Validators.required]),
      'method' : new FormControl(method, [Validators.required]),
      'code' : new FormControl(code, [Validators.required]),
      'contentType': new FormControl(contentType, [Validators.required])
    });
  }

  onSubmit() {
    let value = this.requestForm.value;
    let path = value.path;
    let method = value.method;
    let code = value.code;
    let contentType = value.contentType;
    this.mainService.sendRequest(path, method, code, contentType);
  }

  onClear() {
    this.requestForm.reset();
  }

  onChoose(){
    const dialogRef = this.dialog.open(PathfinderComponent, {
      data: {
        fullPath: this.fullPath,
        method: this.method,
        code: this.code
      },
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(
        (result) => {
          if (result != false) {
            this.fullPath = result.fullPath;
            this.code = result.code;
            this.method = result.method;
            this.requestForm.controls['path'].setValue(this.fullPath)
            this.requestForm.controls['method'].setValue(this.method);
            this.requestForm.controls['code'].setValue(this.code);
          }
      }
    );
  }

}
