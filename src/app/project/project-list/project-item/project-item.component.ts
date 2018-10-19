import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../shared/project.model';
import { MainService } from 'src/app/shared/main.service';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project;
  @Input() index: number;

  constructor(private mainService: MainService) { }

  ngOnInit() {
  }

  onDelete(id: number) {
    this.mainService.deleteProject(id);
    //this.dbService.getAllProjects();
  }

}
