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
import {MatDialog} from '@angular/material';
import {ErrorComponent} from './error/error.component';

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
    response = new Subject<HttpResponse<any>>();
    showSpinner : boolean = false;
    private httpOptions : any;

    private path = 'http://localhost:8080/resources/';
    private publicPath = 'http://localhost:8080/';

    // private path = 'http://10.65.128.174:18080/restin-server/resources/';
    // private publicPath = 'http://10.65.128.174:18080/restin-server/';

    constructor(private httpClient: HttpClient,
                private router: Router,
                private projectService: ProjectService, 
                private urlService: UrlService,
                public dialog: MatDialog) {}

    getPath(){
      return this.path;
    }

    registerUser(user: User){
        const url = this.publicPath + "register";
        return this.httpClient.post<User>(url, user);
    }
    
    loginUser(username: string, password: string) {
        this.showLoadingSpinner();
        let status : number;
        const clientId = 'mert';
        const clientSecret = 'mertsecret';
        const headers = new HttpHeaders().set("Content-type","application/x-www-form-urlencoded").append("Accept","application/json");
        const params = new HttpParams().set("client_id",clientId).append("client_secret",clientSecret).append("grant_type","password").append("username",username).append("password",password);
        const req = new HttpRequest("POST",this.publicPath + "oauth/token", null , { headers: headers, params: params, responseType: 'text'});
        this.httpClient.request(req).pipe(map(
            (response : HttpResponse<any>) => {
                status = response.status;
                let body = response['body'];
                let token : Token = JSON.parse(body || '{}');
                return token;
            }
         )).subscribe(
             (token) => {
                console.log("token: ", token);
                this.hideLoadingSpinner();
                localStorage.setItem('username', username);
                try {
                  this.setToken(token);
                  this.init();
                  this.router.navigate(['']);
                }catch (e) {
                  console.log("Token not defined yet: ", e);
                }

             },
             (error) => {
                this.hideLoadingSpinner();
                console.log("STATUS: ", error.status);
                this.status.next(error.status);
                this.router.navigate(['login']);
                console.log("ERROR: " , error);
            }
        );
    }

  refreshToken(){
    const headers = new HttpHeaders().set("Content-type","application/x-www-form-urlencoded").append("Accept","application/json");
    const params = new HttpParams().set("client_id","mert").append("client_secret","mertsecret").append("grant_type","refresh_token").append("refresh_token", localStorage.getItem('refresh_token'));
    this.httpClient.post(this.publicPath + 'oauth/token', null ,{headers: headers , params:params}).pipe(map(
      (response) => {
        return response;
      }
    )).subscribe(
      (token : Token) => {
        localStorage.setItem('access_token', token.access_token);
        this.init();
      },
      (err) => {
        if (err.error.error_description === 'Invalid refresh token: '+ localStorage.getItem('refresh_token')) {
          this.logout();
          alert('Your session has expired. Please login again.');
          this.router.navigate(['']);
        }
        console.log("ERROR: ", err);
      }
    );
  }

    init() {
        this.httpOptions = {
            headers: new HttpHeaders(
                {'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                 'UserId':localStorage.getItem('userId')})
        };
    }

    logout(){
        let path = this.publicPath + "oauth/revoke-token";
        let projects: Project[] = [];
        let headers = new HttpHeaders({'Authorization': 'Bearer '+localStorage.getItem('access_token')});
        this.projectService.setProjects(projects);
        this.httpClient.get(path, {headers: headers}).subscribe(
          (res) => {
            console.log("Logout Successful!");
          },
          (err) => {
            console.log("ERROR: ", err);
          }
        );
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        this.router.navigate(['']);
    }

    getOptions() {
      return this.httpOptions;
    }



    isAuthenticated() {

      return localStorage.getItem('access_token') != 'undefined' && localStorage.getItem('access_token') != null;
    }

    setToken(token: Token) {
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('refresh_token', token.refresh_token);
        localStorage.setItem('userId', token.userId.toString());
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
        let token  = localStorage.getItem('access_token');
        this.httpClient.get<Project[]>(this.path + 'projects', this.httpOptions).subscribe(
            (projects: any) => {
                this.projectService.setProjects(projects);
                this.hideLoadingSpinner();
            },
            (error: any) => {
              console.log(error);
              this.hideLoadingSpinner();
              let errMsg = 'Access token expired: ' + token;
                if (error.error.error_description === errMsg){
                  this.refreshToken();
                  retry(1);
                } else if (error.error.error_description === 'Invalid access token: ' + token) {
                  this.logout();
                  console.log("ERROR: ", error);
                }
            }
        );
    }

    getProjectMaxId() {
        this.httpClient.get<number>(this.path + 'projects/maxId', this.httpOptions).subscribe(
            (maxId: any ) => {
                this.projectService.setMaxId(maxId);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }
            }
        );
    }

    addNewProject(project: Project) {
        project.userId = +localStorage.getItem('userId');
        console.log(project);
        this.httpClient.post(this.path +  'projects', project, this.httpOptions).subscribe(
            (res) => {
                this.projectService.addProject(project);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
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
        project.userId = +localStorage.getItem('userId');
        this.httpClient.put(this.path + 'projects/' + id , project, this.httpOptions).subscribe(
            (res) => {
                this.projectService.updateProject(id, project);    
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
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
        this.httpClient.delete(this.path + 'projects/' + id, this.httpOptions).subscribe(
            (res) => {
                this.projectService.deleteProject(id);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
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
        this.httpClient.get<number>(this.path + 'urls/maxId', this.httpOptions).subscribe(
            (maxId : any) => {
                this.urlService.setMaxId(maxId);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
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
        let path = this.path + 'projects/' + projectId + "/urls";
        this.httpClient.get<UrlClass[]>(path, this.httpOptions).subscribe(
            (urls: any) => {
                this.urlService.setUrls(urls);
                this.hideLoadingSpinner();
            },
            (error) => {
              this.hideLoadingSpinner();
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
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
        let path = this.path + 'projects/' + projectId + "/urls";
        this.httpClient.post(path, url, this.httpOptions).subscribe(
            (res) => {
                this.urlService.addUrl(url);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
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
        let path = this.path +  'projects/' + projectId + "/urls/" + id;
        this.httpClient.put(path, url, this.httpOptions).subscribe(
            (res) => {
                this.urlService.updateUrl(id, url);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }            }
        )
    }

    deleteUrl(projectId: number, id: number) {
        let path = this.path + 'projects/' + projectId + "/urls/" + id;
        this.httpClient.delete(path, this.httpOptions).subscribe(
            (res) => {
                this.urlService.deleteUrl(id);
            },
            (error) => {
              let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
              if (error.error.error_description === errMsg){
                this.refreshToken();
                retry(1);
              } else {
                console.log("ERROR: ", error);
              }
            }
        )
    }

    sendRequest(path: string, method: string , statusCode: number, contentType: string) {
      this.showLoadingSpinner();
      let req : HttpRequest<any>;
      const headers = new HttpHeaders(
          {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            'UserId': localStorage.getItem('userId'),
            'Code': statusCode.toString(),
            'Content-Type': contentType
          });
      let options : {
        headers?: HttpHeaders,
        observe?: 'body',
        params?: HttpParams,
        reportProgress?: boolean,
        responseType : 'text'
        withCredentials?: boolean
      } = {
        headers: headers,
        responseType : 'text'
      };
      switch (method) {
        case "GET":
          req = new HttpRequest("GET", path, options);
          break;
        case "POST":
          // @ts-ignore
          req = new HttpRequest("POST", path, null, options);
          break;
        case "PUT":
          req = new HttpRequest("PUT", path, null, options);
          break;
        case "DELETE":
          req = new HttpRequest("DELETE", path, options);
          break;
        case "OPTIONS":
          req = new HttpRequest("OPTIONS", path, options);
          break;
        case "HEAD":
          req = new HttpRequest("HEAD", path, options);
          break;
        case "PATCH":
          req = new HttpRequest("PATCH", path, null, options);
          break;
      }
      this.httpClient.request(req).subscribe(
        (res: HttpResponse<any>) => {
          this.hideLoadingSpinner();
          console.log("Response: ", res);
          console.log("Body: ", res.body);
          this.response.next(res);
        },
        (error) => {
          this.hideLoadingSpinner();
          let errMsg = 'Access token expired: ' + localStorage.getItem('access_token');
          if (error.error.error_description === errMsg){
            this.refreshToken();
            retry(1);
          } else if (error.status === 404 || error.status === 500) {
            this.dialog.open(ErrorComponent);
            console.log("ERROR: ", error);

          }
        }
      );
    }

    // Async validation

    isUsernameExists(username: string): Promise<any> {
        let path = this.publicPath + 'validation/username/' + username;
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
        let path = this.publicPath + 'validation/email/' + email;
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

