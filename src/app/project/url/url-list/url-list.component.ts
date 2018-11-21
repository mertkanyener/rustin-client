import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UrlClass } from '../../../shared/url.model';
import { Subscription } from 'rxjs';
import { UrlService } from '../url.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MainService } from 'src/app/shared/main.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.css']
})
export class UrlListComponent implements OnInit, OnDestroy {

  @Input() urls: UrlClass[];
  dataSource = new MatTableDataSource();
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
    );
    this.subscription = this.urlService.urlsChanged.subscribe(
      (urls: UrlClass[]) => {
        this.urls = urls;
        this.dataSource.data = this.urls;
      }
    );
    this.urls = this.urlService.getUrls();
    this.dataSource.data = this.urls;
    this.dataSource.filterPredicate = this.tableFilter();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDelete(id: number) {
    this.mainService.deleteUrl(this.projectId, id);
  }

  tableFilter() : (data: any, filter:string) => boolean {
    let filterFn = function (data, filter) {
      return data.path.toLowerCase().trim().indexOf(filter) !== -1;
    };
    return filterFn;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }


}
