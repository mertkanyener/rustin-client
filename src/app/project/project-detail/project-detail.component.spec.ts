import { TestBed } from "@angular/core/testing";
import { ProjectDetailComponent } from "./project-detail.component";
import { ProjectService } from "../project.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UrlService } from "../url/url.service";
import { MainService } from "src/app/shared/main.service";
import { ActivatedRoute } from "@angular/router";

describe('ProjectDetailComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectDetailComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [ProjectService, UrlService, MainService, ActivatedRoute]
        });
    })

    it('should create the component', () => {
        let fixture = TestBed.createComponent(ProjectDetailComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should use the project list from the project service', () => {
        let fixture = TestBed.createComponent(ProjectDetailComponent);
        let app = fixture.debugElement.componentInstance;
        let projectService = fixture.debugElement.injector.get(ProjectService);
        fixture.detectChanges();
        expect(projectService.getProjects()).toEqual(app.projectList);
    })
})