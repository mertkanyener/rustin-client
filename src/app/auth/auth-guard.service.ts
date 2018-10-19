import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { MainService } from "../shared/main.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private mainService: MainService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.mainService.isAuthenticated();
    }

}