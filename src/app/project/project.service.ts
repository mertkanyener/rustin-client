import { Subject } from "rxjs";
import { Project } from "../shared/project.model";
import { Injectable } from "@angular/core";

@Injectable()
export class ProjectService {

    projectsChanged = new Subject<Project[]>();
    maxIdChanged = new Subject<number>();
    private projects: Project[];
    private maxId: number; 

    constructor(){}

    setMaxId(maxId: number) {
        this.maxId = maxId;
        this.maxIdChanged.next(this.maxId);
    }

    getMaxId(){
        return this.maxId;
    }

    deleteProject(id: number) {
        const deletedProject = this.projects.find(x => x.id === id);
        const index = this.projects.indexOf(deletedProject);
        this.projects.splice(index, 1);
        this.projectsChanged.next(this.projects.slice());
    }

    setProjects(projects: Project[]){
        this.projects = projects;
        this.projectsChanged.next(this.projects.slice());
    }

    getProjects() {
        return this.projects;
    }

    getProject(index: number) {
        return this.projects[index - 1];
    }

    addProject(project: Project) {
        this.projects.push(project);
        this.projectsChanged.next(this.projects.slice());
    }

    updateProject(id: number, newProject: Project) {
        const oldProject = this.projects.find(x => x.id === id);
        const index = this.projects.indexOf(oldProject);
        newProject.id = id;
        this.projects[index] = newProject;
        this.projectsChanged.next(this.projects.slice());
    }

    
}