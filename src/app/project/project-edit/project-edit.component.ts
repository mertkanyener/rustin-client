import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Project } from '../../shared/project.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { MainService } from 'src/app/shared/main.service';
import { Observable } from 'rxjs';

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
  statusOptions = ['Active', 'Inactive'];
  fb = new FormBuilder();


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
    let projectStatus = 'Active';

    if (this.editMode) {
      this.projectOld = this.projectService.getProjects().find(x => x.id === this.id);
      projectName = this.projectOld.name;
      projectDescription = this.projectOld.description;
      projectStatus = this.projectOld.status;
    }
    this.projectForm = this.fb.group({
      name: [projectName, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]*')], this.projectNameValidator.bind(this)],
      description : [projectDescription],
      status: [projectStatus, [Validators.required]]
    });

  }

  onSave() {
    const formValue = this.projectForm.value;
    this.project.name = formValue.name;
    this.project.description = formValue.description;
    this.project.status = formValue.status;
    this.project.id = this.maxId + 1;
    if (this.editMode) {
      this.mainService.updateProject(this.id, this.project);
    } else {
      this.mainService.addNewProject(this.project);
    }
    this.router.navigate(['projects']);
  }

  onClear() {
    this.projectForm.reset();
  }

  onCancel() {
    this.router.navigate(['projects']);
  }

  projectNameValidator(c: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors>{
    let promise = new Promise<any>((resolve, reject) => {
      if (this.projectService.getProjects().find(x => x.name === c.value) != null){
        resolve({'projectExists': true});
      }else{
        resolve(null);
      }
    });
    return promise;
    }

  

}
