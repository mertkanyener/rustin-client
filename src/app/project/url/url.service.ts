import { Subject } from "rxjs";
import { UrlClass } from "../../shared/url.model";


export class UrlService {
    urlsChanged = new Subject<UrlClass[]>();
    maxIdChanged = new Subject<number>();
    private urls: UrlClass[];
    private maxId : number;


    setUrls(urls: UrlClass[]) {
        this.urls = urls;
        this.urlsChanged.next(this.urls.slice());
    }

    setMaxId(maxId : number) {
        this.maxId = maxId;
        this.maxIdChanged.next(this.maxId);
    }

    getMaxId() {
        return this.maxId;
    }

    getUrls() {
        return this.urls;
    }

    getUrl(index: number) {
        return this.urls[index];
    }

    addUrl(url: UrlClass) {
        this.urls.push(url);
        this.urlsChanged.next(this.urls.slice());
    }

    updateUrl(id: number, newUrl: UrlClass) {
        const oldUrl = this.urls.find(x => x.id === id);
        const index = this.urls.indexOf(oldUrl);
        newUrl.id = id;
        this.urls[index] = newUrl;
        this.urlsChanged.next(this.urls.slice());
    }

    deleteUrl(id: number) {
        const deletedUrl = this.urls.find(x => x.id === id);
        const index = this.urls.indexOf(deletedUrl);
        this.urls.splice(index, 1);
        this.urlsChanged.next(this.urls.slice());
    }



}