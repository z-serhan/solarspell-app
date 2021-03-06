import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FolderData } from '../models/folder-data';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SearchData } from '../models/search-data';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
   }

   getFolders(): Observable<any> {
     return this.http.get(this.apiUrl.concat('folder_get_all.php',""));
   }

   getModules(): Observable<any> {
    return this.http.get(this.apiUrl.concat('module_get_all.php',""));
  }
   getFolderTree(): Observable<any> {
    return this.http.get(this.apiUrl.concat('folder_get_tree.php',""));
  }

   getFolderData(parentId): Observable<any> {
    let params = new HttpParams();
    params = params.append('folder_id', parentId);
    return this.http.get(this.apiUrl.concat('folder_get_children.php'), {params});
  }

  getFileData(contentId): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', contentId);
    return this.http.get(this.apiUrl.concat('content_get_by_id.php'), {params});
  }

  getMetadataList(): Observable<any> {
    return this.http.get(this.apiUrl.concat('metadata_list_by_type.php'));
  }

  singleSearch(searchString): Observable<any> {
    let params = new HttpParams();
    params = params.append('search_string',searchString);
    return this.http.get(this.apiUrl.concat('content_fts.php'), {params});
  }
  advancedSearch(searchData: SearchData): Observable<any> {
    return this.http.post(this.apiUrl.concat('content_advanced_search.php'),searchData);
  }
  keywordSearch(keyword: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('keyword_name',keyword);
    return this.http.get(this.apiUrl.concat('content_keyword_search.php'),{params});
  }
  getFullPath(id, isFolder) {
    let params = new HttpParams();
    params = params.append('id', id);
    params = params.append('isFolder', isFolder ? '1' : '0');
    return this.http.get(this.apiUrl.concat('get_full_path.php'), {params});
}
}

@Injectable({
  providedIn: 'root',
})
export class FolderDataResolveService implements Resolve<FolderData> {
  constructor(private dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<FolderData> {
    return this.dataService.getFolderData(route.paramMap.get('folder_id'));
  }
}

@Injectable({
  providedIn: 'root',
})
export class FileDataResolveService implements Resolve<any> {
  constructor(private dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<FolderData> {
    return this.dataService
    .getFileData(route.paramMap.get('content_id'));
  }
}


@Injectable({
  providedIn: 'root',
})
export class SearchDataResolveService implements Resolve<any> {
  constructor(private dataService: DataService) {}
  resolve(route: ActivatedRouteSnapshot): any {
    return this.dataService.singleSearch(route.paramMap.get('search_string'))

  }
}

@Injectable({
  providedIn: 'root',
})
export class SearchKeywordResolveService implements Resolve<any> {
  constructor(private dataService: DataService)  {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.dataService.keywordSearch(route.paramMap.get('search_string'))
  }
}