import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../../shared/project.model';
import { ProjectService } from '../project.service';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/shared/main.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  projects: Project[];
  subscription: Subscription;
  displayedColumns: string[] = ['name', 'status', 'edit', 'delete'];

  constructor(private projectService: ProjectService,
              private mainService: MainService) { }

  ngOnInit() {
    this.mainService.getAllProjects();
    this.subscription = this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        //console.log(projects);
        this.projects = projects;
        console.log("projects oninit", this.projects);
      }
    )
    //this.projects = this.projectService.getProjects();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDelete(id: number) {
    this.mainService.deleteProject(id);
  }

}
