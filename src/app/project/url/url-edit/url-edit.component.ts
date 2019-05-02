import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UrlService } from '../url.service';
import { UrlClass } from '../../../shared/url.model';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { MainService } from 'src/app/shared/main.service';
import { MatDialog } from '@angular/material';
import { FakerDialogComponent } from './faker-dialog/faker-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

@Component({
  selector: 'app-url-edit',
  templateUrl: './url-edit.component.html',
  styleUrls: ['./url-edit.component.css']
})
export class UrlEditComponent implements OnInit {

  @ViewChild(JsonEditorComponent) jsonEditor: JsonEditorComponent;
  options = new JsonEditorOptions();
  methods: string[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS",
                       "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW" ];
  responseCodes: number[] = [200, 400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
                             414, 415, 416, 417, 418, 426, 428, 429, 431, 451, 500, 501, 502, 503]
  urlForm: FormGroup;
  id: number;
  maxId: number;
  projectId: number;              
  editMode = false;
  url: UrlClass = new UrlClass();
  jsonData = null;
  choice: string;
  editorText: string;
  checkedDynamic = false;
  checkedMirror = false;
  

  constructor(private route: ActivatedRoute,
              private router: Router,
              private urlService: UrlService,
              public dialog: MatDialog,
              private mainService: MainService) {
                
                this.options.mode = 'code';
                this.options.modes = ['code', 'text', 'tree'];
                this.options.statusBar = true;
                
               }

  ngOnInit() {
    this.mainService.getUrlMaxId();
    this.route.params.subscribe(
      (params : Params) => {
        this.projectId = +params['projectId'];
        this.id = +params['urlId'];
        this.editMode = params['urlId'] != null;
        this.initForm();
      }
    );
    this.urlService.maxIdChanged.subscribe(
      (maxId) => {
        this.maxId = maxId;
      },
      (error) => {
        console.log("ERROR", error);
      }
    );
  }

  private initForm() {
    let urlPath = '';
    let urlMethod = '';
    let urlResponse = '\n';
    let responseCode = null;

    let pattern = '(\\{([a-zA-Z]+)\\})|([a-zA-Z0-9]+)(/\\{([a-zA-Z])+\\})*(/[a-zA-Z0-9]*)*';
    // '\\{*[a-zA-Z0-9]*\\}*(/{*[a-zA-Z0-9]*}*)*'
  
    if (this.editMode) {
      const urlOld = this.urlService.getUrls().find(x => x.id === this.id);
      urlPath = urlOld.path;
      urlMethod = urlOld.method;
      urlResponse = urlOld.response;
      responseCode = urlOld.responseCode;
      if (urlOld.isDynamic === 1){
        this.checkedDynamic = true;
      }
      if (urlOld.isMirrored == 1){
        this.checkedMirror = true;
      }
      console.log("URL: ", urlOld);
      this.jsonData = JSON.parse(urlOld.response);
    } else {
      this.jsonData = '\n';
    }
    this.urlForm = new FormGroup({
      'path' : new FormControl(urlPath, [Validators.required, Validators.pattern(pattern)]),
      'method' : new FormControl(urlMethod, [Validators.required]),
      'response' : new FormControl(urlResponse),
      'responseCode': new FormControl(responseCode, [Validators.required])
    });
  }
  
  onSave() {
    const formValue = this.urlForm.value;
    this.url.path = formValue.path;
    this.url.method = formValue.method;
    let response = '';
    try {
      response = JSON.stringify(this.jsonEditor.get());
      if (response.replace(/ /g, '') === '{}'){
        this.dialog.open(ErrorDialogComponent, {
          data: {
            error: 'null'
          }
        });
        return;
      }
      this.url.response = response;
    } catch (e) {
      this.dialog.open(ErrorDialogComponent, {
        data: {
          error: 'invalid'
        }
      });
      console.log("ERROR: ", e);
      return;
    }
    this.url.responseCode = formValue.responseCode;
    if (this.checkedDynamic) {
      this.url.isDynamic = 1;
    } else {
      this.url.isDynamic = 0;
    }
    if (this.checkedMirror) {
      this.url.isMirrored = 1;
    } else {
      this.url.isMirrored = 0;
    }
    if (this.editMode) {
      this.mainService.updateUrl(this.projectId, this.id, this.url);
      console.log("url: ", this.url);
      this.router.navigate(['../../../'], {relativeTo: this.route});
    } else {
      this.url.id = this.maxId + 1;
      this.mainService.addNewUrl(this.projectId, this.url);
      console.log("url: ", this.url);
      this.router.navigate(['../../'], {relativeTo: this.route});
    }
  }
  
  onKey(event){
    if (this.checkedDynamic) {
      let row = this.jsonEditor.jsonEditorContainer.nativeElement.firstChild.children[3].children[1].innerHTML;
      if (event.key === "F3") {
        event.preventDefault();
        const dialogRef = this.dialog.open(FakerDialogComponent, {
          data: {choice: this.choice}
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result !== false) {
            this.choice = result;
            this.editorText = this.jsonEditor.getText();
            this.editorText = this.appendText(row, this.editorText);
            try {
              const json = JSON.parse(this.editorText || '{}');
              this.jsonEditor.set(json);
            }
            catch (e) {
              this.dialog.open(ErrorDialogComponent, {
                data: {
                  error: 'invalid'
                }
              });
              console.log("ERROR: ", e);
            }
          }
        });
      }
    }    
  }

  appendText(row: number, text: string) {
    let result = '';
    let textArray = text.split('\n');
    let focusedRow = textArray[row - 1];
    if (focusedRow.includes(',')) {
      focusedRow = focusedRow.replace(',', '');
      focusedRow = focusedRow.concat(' "${'+this.choice+'}",');
    } else {
      focusedRow = focusedRow.concat(' "${'+this.choice+'}"');
    }
    textArray[row - 1] = focusedRow;
    for (let i = 0; i < textArray.length; i++) {
      result = result.concat(textArray[i] + '\n')
    }

    return result;
  }

  onClear() {
    this.urlForm.reset();
  }

  onCancel() {
    this.router.navigate(['../../../'], {relativeTo: this.route} );
  }
}
