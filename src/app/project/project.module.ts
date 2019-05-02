import { NgModule } from "@angular/core";
import { ProjectComponent } from "./project.component";
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { ProjectEditComponent } from "./project-edit/project-edit.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectItemComponent } from "./project-list/project-item/project-item.component";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UrlComponent } from "./url/url.component";
import { UrlDetailComponent } from "./url/url-detail/url-detail.component";
import { UrlEditComponent } from "./url/url-edit/url-edit.component";
import { UrlListComponent } from "./url/url-list/url-list.component";
import { ProjectRoutingModule } from "./project-routing.module";
import { NgJsonEditorModule } from "ang-jsoneditor";
import { NgxJsonViewerModule} from "ngx-json-viewer";
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';
import { FakerDialogComponent } from './url/url-edit/faker-dialog/faker-dialog.component';
import { ProjectStartComponent } from './project-start/project-start.component';
import { ErrorDialogComponent } from './url/url-edit/error-dialog/error-dialog.component';
import { RequestComponent } from './request/request.component';
import {AceEditorModule} from 'ng2-ace-editor';
import { AskDialogComponent } from './url/url-list/ask-dialog/ask-dialog.component';
import { PathfinderComponent } from './request/pathfinder/pathfinder.component';

@NgModule({
    declarations: [
        ProjectComponent,
        ProjectDetailComponent,
        ProjectEditComponent,
        ProjectListComponent,
        ProjectItemComponent,
        UrlComponent,
        UrlDetailComponent,
        UrlEditComponent,
        UrlListComponent,
        FakerDialogComponent,
        ProjectStartComponent,
        ErrorDialogComponent,
        RequestComponent,
        AskDialogComponent,
        PathfinderComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectRoutingModule,
        NgJsonEditorModule,
        NgxJsonViewerModule,
        TextInputAutocompleteModule,
        AceEditorModule
    ],
    entryComponents: [FakerDialogComponent,ErrorDialogComponent,AskDialogComponent, PathfinderComponent]
})

export class ProjectModule {

}
