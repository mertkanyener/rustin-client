import { HttpClient, HttpRequest, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, retry } from 'rxjs/operators';
import { User } from "../auth/user.model";
import { ProjectService } from "../project/project.service";
import { Project } from "./project.model";
import { UrlService } from "../project/url/url.service";
import { UrlClass } from "./url.model";
import { Subject } from 'rxjs';

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
    status = new Subject<number>();
    showSpinner : boolean = false;
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
        this.showLoadingSpinner();
        let status : number;
        const clientId = 'mert';
        const clientSecret = 'mertsecret';
        const headers = new HttpHeaders().set("Content-type","application/x-www-form-urlencoded").append("Accept","application/json");
        const params = new HttpParams().set("client_id",clientId).append("client_secret",clientSecret).append("grant_type","password").append("username",username).append("password",password);
        const req = new HttpRequest("POST","http://localhost:8080/oauth/token", null , { headers: headers, params: params, responseType: 'text'});
        this.httpClient.request(req).pipe(map(
            (response : HttpResponse<any>) => {
                status = response.status;
                let body = response['body'];
                let token : Token = JSON.parse(body || '{}');
                return token;
            }
         )).subscribe(
             (token) => {
                if (status === 200) {
                    this.hideLoadingSpinner();
                    this.setToken(token);
                    this.username = username;
                    this.init();
                    this.router.navigate(['']);

                }
             },
             (error) => {
                this.hideLoadingSpinner();
                console.log("STATUS: ", error.status);
                this.status.next(error.status);
                this.token = null;
                this.router.navigate(['login']);
                console.log("ERROR: " , error);
            },
          () => {
            console.log("First Token: ",this.token.access_token);
            console.log("1. Refresh token: ", this.token.refresh_token)
          }
        );
    }

  refreshToken(){
    let path = "http://localhost:8080/oauth/token";
    const headers = new HttpHeaders().set("Content-type","application/x-www-form-urlencoded").append("Accept","application/json");
    const params = new HttpParams().set("client_id","mert").append("client_secret","mertsecret").append("grant_type","refresh_token").append("refresh_token", this.token.refresh_token);
    console.log("Refresh token: ", this.token.refresh_token);
    this.httpClient.post(path, null ,{headers: headers , params:params}).pipe(map(
      (response) => {
        console.log("Refreshtoken response: ", response);
        //let body = response['body'];
        //let token : Token = JSON.parse(body || '{}');
        return response;
      }
    )).subscribe(
      (token : Token) => {
        console.log("After successful refresh: ", token);
        this.setToken(token);
        this.init();
      },
      (err) => {
        console.log("ERROR: ", err);
      },
      () => {
        console.log("Refreshed token: ", this.token.access_token);
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
        let path = "http://localhost:8080/oauth/revoke-token";
        let projects: Project[] = [];
        let headers = new HttpHeaders({'Authorization': 'Bearer '+this.token.access_token});
        this.projectService.setProjects(projects);
        this.httpClient.get(path, {headers: headers}).subscribe(
          (res) => {
            console.log("Logout Successful!");
          },
          (err) => {
            console.log("ERROR: ", err);
          }
        );
        this.token = null;
        this.router.navigate(['']);
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

    showLoadingSpinner() {
        this.showSpinner = true;
    }

    hideLoadingSpinner() {
        this.showSpinner = false;
    }
    // Database Operations 
    // "Project" Methods

    getAllProjects() {
        this.showLoadingSpinner();
        this.httpClient.get<Project[]>('http://localhost:8080/admin/projects', this.httpOptions).subscribe(
            (projects: any) => {
                this.projectService.setProjects(projects);
                this.hideLoadingSpinner();
            },
            (error) => {
              this.hideLoadingSpinner();
              let errMsg = 'Access token expired: ' + this.token.access_token;
                if (error.error.error_description === errMsg){
                  this.refreshToken();
                  retry(1);
                } else {
                  console.log("ERROR: ", error);
                }
            }
        );
    }

    getProjectMaxId() {
        let path = 'http://localhost:8080/admin/projects/maxId';
        this.httpClient.get<number>(path, this.httpOptions).subscribe(
            (maxId: any ) => {
                this.projectService.setMaxId(maxId);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }
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
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }
            }
        );
    }

    updateProject(id: number, project: Project) {
        project.userId = this.token.userId;
        let path = 'http://localhost:8080/admin/projects/' + id;
        this.httpClient.put(path, project, this.httpOptions).subscribe(
            (res) => {
                this.projectService.updateProject(id, project);    
            },
            (error) => {
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }
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
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }            }
        );
    }

    // "URL" Methods

    getUrlMaxId() {
        let path = 'http://localhost:8080/admin/urls/maxId';
        this.httpClient.get<number>(path, this.httpOptions).subscribe(
            (maxId : any) => {
                this.urlService.setMaxId(maxId);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }            }
        )
    }

    getAllUrls(projectId: number) {
        this.showLoadingSpinner();
        let path = 'http://localhost:8080/admin/projects/' + projectId + "/urls";
        this.httpClient.get<UrlClass[]>(path, this.httpOptions).subscribe(
            (urls: any) => {
                this.urlService.setUrls(urls);
                this.hideLoadingSpinner();
            },
            (error) => {
              this.hideLoadingSpinner();
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }            }
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
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }
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
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }            }
        )
    }

    deleteUrl(projectId: number, id: number) {
        let path = 'http://localhost:8080/admin/projects/' + projectId + "/urls/" + id;
        this.httpClient.delete(path, this.httpOptions).subscribe(
            (res) => {
                this.urlService.deleteUrl(id);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + this.token.access_token;
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }            }
        )
    }

    // Async validation

    isUsernameExists(username: string): Promise<any> {
        let path = 'http://localhost:8080/validation/username/' + username;
        let promise = new Promise<any>((resolve, reject) => {
            this.httpClient.get<number>(path).toPromise().then(
                res => {
                    if (res === 1){
                        resolve({'usernameTaken': true});
                    }else{
                        resolve(null);
                    }
                }
            );
        });
        return promise;
    }
    
    isEmailExists(email: string) : Promise<any> {
        let path = 'http://localhost:8080/validation/email/' + email;
        let promise = new Promise<any>((resolve, reject) => {
            this.httpClient.get<number>(path).toPromise().then(
                res => {
                    if (res === 1){
                        resolve({'emailExists': true});
                    }else{
                        resolve(null);
                    }
                }
            );
        });
        return promise;
    }

}

