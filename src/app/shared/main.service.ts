import { HttpClient, HttpRequest, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { User } from "../auth/user.model";
import { ProjectService } from "../project/project.service";
import { Project } from "./project.model";
import { UrlService } from "../project/url/url.service";
import { UrlClass } from "./url.model";

export interface Token {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    userId: number;
}

@Injectable()
export class MainService {
    userLoggedIn : boolean = false;
    private token: Token = null;
    private username: string;
    private httpOptions : any;
    constructor(private httpClient: HttpClient,
                private router: Router,
                private projectService: ProjectService, 
                private urlService: UrlService) {}

    registerUser(user: User){
        const url = "http://localhost:8080/register";
        return this.httpClient.post<User>(url, user);
    }
    
    loginUser(username: string, password: string) {
        let status : number;
        const clientId = 'mert';
        const clientSecret = 'mertsecret';
        const headers = new HttpHeaders().set("Content-type","application/x-www-form-urlencoded").append("Accept","application/json");
        const params = new HttpParams().set("client_id",clientId).append("client_secret",clientSecret).append("grant_type","password").append("username",username).append("password",password);
        const req = new HttpRequest("POST","http://localhost:8080/oauth/token", null , { headers: headers, params: params, responseType: 'text' });
        this.httpClient.request(req).pipe(map(
            (response : HttpResponse<any>) => {
                status = response.status;
                let body = response['body'];
                let token : Token = JSON.parse(body || '{}');
                return token;
        },
         )).subscribe(
             (token) => {
                if (status === 200) {
                    this.setToken(token);
                    this.username = username;
                    this.userLoggedIn = true;
                    this.init();
                    this.router.navigate(['']);
                }
             },
             (error) => {
                status = error.status;
                this.token = null;
                this.router.navigate(['login']);
                console.log("ERROR: " , error);
            }
        );
    }

    init() {
        this.httpOptions = {
            headers: new HttpHeaders(
                {'Authorization': 'Bearer ' + this.token.access_token,
                 'UserId':this.token.userId.toString()})
        };
        
        
    }

    logout(){
        let projects: Project[] = [];
        this.projectService.setProjects(projects);
        console.log("Projects on logout: ", this.projectService.getProjects())
        this.token = null;
    }

    isAuthenticated() {
        return this.token != null;
    }

    setToken(token: Token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    // Database Operations 
    // "Project" Methods

    getAllProjects() {
        this.httpClient.get<Project[]>('http://localhost:8080/admin/projects', this.httpOptions).subscribe(
            (projects: Project[]) => {
                console.log("http header: ", this.httpOptions )
                console.log("Projects from DB: ", projects);
                this.projectService.setProjects(projects);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        );
    }

    getProjectMaxId() {
        let path = 'http://localhost:8080/admin/projects/maxId';
        this.httpClient.get<number>(path, this.httpOptions).subscribe(
            (maxId: number) => {
                this.projectService.setMaxId(maxId);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        )
    }

    addNewProject(project: Project) {
        project.userId = this.token.userId;
        console.log(project);
        this.httpClient.post('http://localhost:8080/admin/projects', project, this.httpOptions).subscribe(
            (res) => {
                this.projectService.addProject(project);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        );
    }

    updateProject(id: number, project: Project) {
        let path = 'http://localhost:8080/admin/projects/' + id;
        this.httpClient.put(path, project, this.httpOptions).subscribe(
            (res) => {
                this.projectService.updateProject(id, project);
                
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        );
    }

    deleteProject(id: number) {
        let path = 'http://localhost:8080/admin/projects/' + id;
        this.httpClient.delete(path, this.httpOptions).subscribe(
            (res) => {
                this.projectService.deleteProject(id);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        );
    }

    // "URL" Methods

    getUrlMaxId() {
        let path = 'http://localhost:8080/admin/urls/maxId';
        this.httpClient.get<number>(path, this.httpOptions).subscribe(
            (maxId : number) => {
                this.urlService.setMaxId(maxId);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        )
    }

    getAllUrls(projectId: number) {
        let path = 'http://localhost:8080/admin/projects/' + projectId + "/urls";
        this.httpClient.get<UrlClass[]>(path, this.httpOptions).subscribe(
            (urls: UrlClass[]) => {
                this.urlService.setUrls(urls);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        );
    }


    addNewUrl(projectId: number, url: UrlClass) {
        console.log(url);
        let path = 'http://localhost:8080/admin/projects/' + projectId + "/urls";
        this.httpClient.post(path, url, this.httpOptions).subscribe(
            (res) => {
                this.urlService.addUrl(url);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        )
    }

    updateUrl(projectId: number, id: number, url: UrlClass) {
        let path = 'http://localhost:8080/admin/projects/' + projectId + "/urls/" + id;
        this.httpClient.put(path, url, this.httpOptions).subscribe(
            (res) => {
                this.urlService.updateUrl(id, url);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        )
    }

    deleteUrl(projectId: number, id: number) {
        let path = 'http://localhost:8080/admin/projects/' + projectId + "/urls/" + id;
        this.httpClient.delete(path, this.httpOptions).subscribe(
            (res) => {
                this.urlService.deleteUrl(id);
            },
            (error) => {
                console.log("ERROR: ", error);
            }
        )
    }

}

