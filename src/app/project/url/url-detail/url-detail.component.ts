import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { UrlClass } from '../../../shared/url.model';
import { UrlService } from '../url.service';

@Component({
  selector: 'app-url-detail',
  templateUrl: './url-detail.component.html',
  styleUrls: ['./url-detail.component.css']
})
export class UrlDetailComponent implements OnInit {

  options = new JsonEditorOptions();
  url: UrlClass;
  projectId: number;
  id: number;
  jsonResponse : JSON;


  constructor(private route: ActivatedRoute,
              private urlService: UrlService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.projectId = +params['projectId'];
        this.id = +params['urlId'];
        this.url = this.urlService.getUrls().find(x => x.id === this.id);
        this.jsonResponse =  JSON.parse(this.url.response); 
      }
    )
  }

}
