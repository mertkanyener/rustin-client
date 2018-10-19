import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Project } from '../../shared/project.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { MainService } from 'src/app/shared/main.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  projectOld:  Project;
  projectForm : FormGroup;
  id: number;
  editMode = false;
  project: Project = new Project();
  maxId: number;


  constructor(private projectService: ProjectService,
              private mainService: MainService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.mainService.getProjectMaxId();
    this.maxId = this.projectService.getMaxId();
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
    this.projectService.maxIdChanged.subscribe(
      (maxId: number) => {
        this.maxId = maxId;
      },
      (error) => {
        console.log("ERROR: ", error);
      }
    );
    
  }

  private initForm() {
    let projectName = '';
    let projectDescription = '';
    let projectStatus = '';

    if (this.editMode) {
      this.projectOld = this.projectService.getProjects().find(x => x.id === this.id);
      projectName = this.projectOld.name;
      projectDescription = this.projectOld.description;
      projectStatus = this.projectOld.status;
    }
    this.projectForm = new FormGroup({
      'name' : new FormControl(projectName),
      'description' : new FormControl(projectDescription),
      'status' : new FormControl(projectStatus),
    });
  }

  onSave() {
    console.log("save clicked: ", this.editMode);
    const formValue = this.projectForm.value;
    this.project.name = formValue.name;
    this.project.description = formValue.description;
    this.project.status = formValue.status;
    this.project.id = this.maxId + 1;
    if (this.editMode) {
      this.mainService.updateProject(this.id, this.project);
      //this.dbService.getAllProjects();
    } else {
      this.mainService.addNewProject(this.project);
      //this.dbService.getAllProjects();
    }
    this.router.navigate(['projects']);
  }

  onClear() {
    this.projectForm.reset();
  }

  onCancel() {
    this.router.navigate(['projects']);
  }

  

}
