import { Component, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../../shared/project.model';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UrlClass } from '../../shared/url.model';
import { UrlService } from '../url/url.service';
import { MainService } from 'src/app/shared/main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  project: Project;
  projectList: Project[];
  id: number;
  urls: UrlClass[];
  checked = false;
  subscription: Subscription;

  constructor(private projectService: ProjectService,
              private activatedRoute: ActivatedRoute,
              private urlService: UrlService,
              private mainService: MainService,
              private router: Router ) {
                this.projectList = this.projectService.getProjects();
               }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.mainService.getAllUrls(this.id);
        this.project = this.projectList.find(x => x.id == this.id);
        this.urls = this.urlService.getUrls();
      }
    );
    this.subscription = this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        this.projectList = projects;
        this.project = this.projectList.find(x => x.id == this.id);
        this.urls = this.urlService.getUrls();
      }
    );
    if (this.project.status === 'Active'){
      this.checked = true;
    } else {
      this.checked = false;
    }
  }
  
  onToggle(){
    if (this.checked) {
      this.project.status = 'Active';
      this.mainService.updateProject(this.id, this.project);
    } else {
      this.project.status = 'Inactive';
      this.mainService.updateProject(this.id, this.project);    
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
