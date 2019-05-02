import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { Project } from '../../shared/project.model';
import { ProjectService } from '../project.service';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/shared/main.service';
import { MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[];
  dataSource : MatTableDataSource<Project>;
  subscription: Subscription;
  displayedColumns: string[] = ['name', 'status', 'edit', 'delete'];
  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
      this.dataSource.sort= this.sort;
    }
  }

  constructor(private projectService: ProjectService,
              private mainService: MainService) { }

  ngOnInit() {
    this.projects = this.projectService.getProjects();
    this.dataSource = new MatTableDataSource(this.projects);
    this.dataSource.filterPredicate = this.tableFilter();
    this.subscription = this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        this.projects = projects;
        this.dataSource.data = projects;
        this.dataSource.filterPredicate = this.tableFilter();
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDelete(id: number) {
    this.mainService.deleteProject(id);
  }

  tableFilter() : (data: any, filter:string) => boolean {
    let filterFn = function (data, filter) {
      return data.name.toLowerCase().trim().indexOf(filter) !== -1;
    };
    return filterFn;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
