import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UrlService } from '../url.service';
import { UrlClass } from '../../../shared/url.model';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { MainService } from 'src/app/shared/main.service';

@Component({
  selector: 'app-url-edit',
  templateUrl: './url-edit.component.html',
  styleUrls: ['./url-edit.component.css']
})
export class UrlEditComponent implements OnInit {

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;
  options = new JsonEditorOptions();
  methods: string[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS",
                       "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW" ];
  responseCodes: number[] = [200, 400, 401, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
                             414, 415, 416, 417, 418, 421, 426, 428, 429, 431, 451, 500, 501, 502, 503]
  urlForm: FormGroup;
  id: number;
  maxId: number;
  projectId: number;              
  editMode = false;
  url: UrlClass = new UrlClass();
  jsonData = null;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private urlService: UrlService,
              private mainService: MainService) {
                this.options.mode = 'code';
                this.options.modes = ['code', 'text', 'tree'];
                this.options.statusBar = false;
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
    )
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
    let urlResponse = '';
    let responseCode = null;

    if (this.editMode) {
      const urlOld = this.urlService.getUrls().find(x => x.id === this.id);
      urlPath = urlOld.path;
      urlMethod = urlOld.method;
      urlResponse = urlOld.response;
      responseCode = urlOld.responseCode;
      this.jsonData = JSON.parse(urlOld.response);
      //this.editor.options.onEditable(false);
    
    }
    this.urlForm = new FormGroup({
      'path' : new FormControl(urlPath),
      'method' : new FormControl(urlMethod),
      'response' : new FormControl(urlResponse),
      'responseCode': new FormControl(responseCode)
    });

  }

  onSave() {
    const formValue = this.urlForm.value;
    this.url.path = formValue.path;
    this.url.method = formValue.method;
    this.url.response = JSON.stringify(this.editor.get());
    this.url.responseCode = formValue.responseCode;
    if (this.editMode) {
      this.mainService.updateUrl(this.projectId, this.id, this.url);
      this.router.navigate(['../../../'], {relativeTo: this.route});
    } else {
      this.url.id = this.maxId + 1;
      this.mainService.addNewUrl(this.projectId, this.url);
      this.router.navigate(['../../'], {relativeTo: this.route});
    }
  }

  onClear() {
    this.urlForm.reset();
  }

  onCancel() {
    this.router.navigate(['../../../'], {relativeTo: this.route} );
  }

}
