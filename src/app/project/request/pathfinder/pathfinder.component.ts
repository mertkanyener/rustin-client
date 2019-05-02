import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSort, MatTableDataSource} from "@angular/material";
import {ProjectService} from "../../project.service";
import {Project} from "../../../shared/project.model";
import {UrlService} from "../../url/url.service";
import {UrlClass} from "../../../shared/url.model";
import {MainService} from "../../../shared/main.service";

export interface DialogData {

  fullPath: string;
  method: string;
  code: number;
}

@Component({
  selector: 'app-pathfinder',
  templateUrl: './pathfinder.component.html',
  styleUrls: ['./pathfinder.component.css']
})
export class PathfinderComponent implements OnInit {

  dataSource= new MatTableDataSource<Project>();
  dataSourceURL = new MatTableDataSource<UrlClass>();
  activeProjects: Project[];
  displayColumns = ['name'];
  displayColumnsURL = ['path', 'method', 'code'];
  selectedProject : string;
  urls: UrlClass[];

  projectSort;
  urlSort;

  @ViewChild('projectSort') set projectContent(content: ElementRef) {
    this.projectSort = content;
    if (this.projectSort){
      this.dataSource.sort= this.projectSort;
    }
  }
  @ViewChild('urlSort') set urlContent(urlContent: ElementRef) {
    this.urlSort = urlContent;
    if (this.urlSort){
      this.dataSourceURL.sort= this.urlSort;
    }
  }


  constructor(public dialogRef: MatDialogRef<PathfinderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private projectService: ProjectService,
              private urlService: UrlService,
              private mainService: MainService) { }

  ngOnInit(){
    this.activeProjects = this.projectService.getActiveProjects();
    this.dataSource.data = this.activeProjects;
    this.dataSource.sort = this.projectSort;
    this.dataSource.filterPredicate = this.tableFilter();
    this.urlService.urlsChanged.subscribe(
      (urls: UrlClass[]) => {
        this.urls = urls;
        this.dataSourceURL.data = this.urls;
        this.dataSourceURL.sort = this.urlSort;
        this.dataSourceURL.filterPredicate = this.urlFilter();
      }
    );
  }

  onProjectClick(project: Project) {
    this.mainService.getAllUrls(project.id);
    this.selectedProject = project.name;
  }

  tableFilter() : (data: any, filter:string) => boolean {
    let filterFn = function (data, filter) {
      return data.name.toLowerCase().trim().indexOf(filter) !== -1;
    };
    return filterFn;
  }

  urlFilter() : (data: any, filter:string) => boolean {
    let filterFn = function (data, filter) {
      return data.path.toLowerCase().trim().indexOf(filter) !== -1;
    };
    return filterFn;
  }


  applyFilter(value: string, table: string) {
    if (table === 'projects'){
      this.dataSource.filter = value.trim().toLowerCase();
    }else{
      this.dataSourceURL.filter = value.trim().toLowerCase();
    }
  }

  onUrlClick(url: UrlClass) {
    this.data.fullPath = this.mainService.getPath() + this.selectedProject + "/" + url.path;
    this.data.method = url.method;
    this.data.code = url.responseCode;
  }

  onClose(){
    this.dialogRef.close(false);
  }



}
