import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UrlClass } from '../../../shared/url.model';
import { Subscription } from 'rxjs';
import { UrlService } from '../url.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MainService } from 'src/app/shared/main.service';

@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.css']
})
export class UrlListComponent implements OnInit, OnDestroy {

  @Input() urls: UrlClass[];
  subscription: Subscription;
  projectId: number;
  displayedColumns: string[] = ['path', 'method', 'code' , 'edit', 'delete'];

  constructor(private urlService: UrlService,
              private mainService: MainService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.projectId = +params['id'];
      }
    )
    this.subscription = this.urlService.urlsChanged.subscribe(
      (urls: UrlClass[]) => {
        this.urls = urls;
      }
    )
    this.urls = this.urlService.getUrls();
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDelete(id: number) {
    this.mainService.deleteUrl(this.projectId, id);
  }




}
