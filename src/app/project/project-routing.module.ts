import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectComponent } from "./project.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectEditComponent } from "./project-edit/project-edit.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { UrlListComponent } from "./url/url-list/url-list.component";
import { UrlDetailComponent } from "./url/url-detail/url-detail.component";
import { UrlEditComponent } from "./url/url-edit/url-edit.component";
import {RequestComponent} from './request/request.component';


const projectRoutes : Routes = [
    { path: '', component: ProjectComponent, children: [
        { path: '', component: ProjectListComponent },
        { path: 'request', component: RequestComponent },
        { path: 'new', component: ProjectEditComponent },
        { path: ':id', component: ProjectDetailComponent },
        { path: ':id/edit', component: ProjectEditComponent},
        { path: ':id/urls', component: UrlListComponent },
        { path: ':projectId/urls/new', component: UrlEditComponent, pathMatch: 'full' },
        { path: ':projectId/urls/:urlId', component: UrlDetailComponent, pathMatch: 'full' },
        { path: ':projectId/urls/:urlId/edit', component: UrlEditComponent }
    ] },

];

@NgModule({
    imports: [
        RouterModule.forChild(projectRoutes)
    ],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }
