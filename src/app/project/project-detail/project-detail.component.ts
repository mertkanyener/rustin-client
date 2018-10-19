import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/project.model';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UrlClass } from '../../shared/url.model';
import { UrlService } from '../url/url.service';
import { MainService } from 'src/app/shared/main.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: Project;
  projectList: Project[];
  id: number;
  urls: UrlClass[];
  checked = false;

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
        //this.dbService.getOneProject(this.id);
        this.mainService.getAllUrls(this.id);
        this.project = this.projectList.find(x => x.id == this.id);
        this.urls = this.urlService.getUrls();
      }
    )
    this.projectService.projectsChanged.subscribe(
      (projects: Project[]) => {
        this.projectList = projects;
        this.project = this.projectList.find(x => x.id == this.id);
        this.urls = this.urlService.getUrls();
      }
    )
  }
  
  onToggle(){
    this.mainService.updateProject(this.id, this.project);
  }
}
