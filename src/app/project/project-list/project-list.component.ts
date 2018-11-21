import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
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
  dataSource = new MatTableDataSource();
  subscription: Subscription;
  displayedColumns: string[] = ['name', 'status', 'edit', 'delete'];

  constructor(private projectService: ProjectService,
              private mainService: MainService) { }

  ngOnInit() {
    this.subscription = this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        this.projects = projects;
        this.dataSource.data = this.projects;
        this.dataSource.filterPredicate = this.tableFilter();
      }
    );
    this.projects = this.projectService.getProjects();
    this.dataSource.data = this.projects;
    this.dataSource.filterPredicate = this.tableFilter();
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
