import {Injectable} from '@angular/core';
import {Http,Headers,RequestOptions} from '@angular/http';
import "rxjs/add/operator/map";
import {HttpClient, HttpParams} from "@angular/common/http";
import {isObject} from "rxjs/util/isObject";
import {StorageService} from "./storageService";

@Injectable()
export class HttpService {

  constructor(public http: Http,public httpClient:HttpClient,public storageService:StorageService){
  }
  public getUrl(){
    let url=this.storageService.read("url");
    if (!url){
      this.setUrl("http","lhsm.weiapp.pw","3575","AssetsDataPhone");
      return "http://lhsm.weiapp.pw:3575/AssetsDataPhone/mobile/";
    }
    let strUrl=url["agreement"]+"://"+url["address"]+":"+url["port"]+"/"+url["serviceName"]+"/mobile/";
    return strUrl;
  }
  public setUrl(agreement:string,address:string,port:string,serviceName:string){
    let url = {};
    url["agreement"] = agreement;
    url["address"] = address;
    url["port"] = port;
    url["serviceName"] = serviceName;
    this.storageService.write("url",url);
  }
  public get (url:string,body:any){
    var item="?";

    for (var i in body){
      item+=i+"="+body[i]+"&";

    }
    console.log("item:"+item);
    item=item.substr(0,item.length-1);
    console.log("item:"+item);
    return this.http.get(url+item).map(res=>res.json(),err=>console.log("error:"+err));//.toPromise().then(res=>res.json()).catch(err=>console.log("error:"+err))
  }
  public post (url:string,body:any){
    var headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded')
    let options = new RequestOptions({ headers:headers});
    return this.http.post(url,this.transformRequest(body),options).map(res=>res.json(),err=>console.log("error:"+err));
  }
  private transformRequest(obj){
    var str=[];
    for (var s in obj){
      str.push(encodeURIComponent(s)+"="+encodeURIComponent(obj[s]))
    }
    console.log("str:"+str.join("&"));
    return str.join("&");
  }
  public GET(url: string, params: any, callback ?: (res: any, error: any) => void): void {

    this.http.get(url, {params: this.encodeComplexHttpParams(params)})
      .subscribe(res => {
          callback && callback(res, null);
        }, error => {
          callback && callback(null, error);
        }
      );

  }

  public POST(url: string, params: any, callback ?: (res: any, error: any) => void): void {

    this.http.post(url, this.encodeComplexHttpParams(params))
      .subscribe(res => {
        callback && callback(res, null);
      }, error => {
        callback && callback(null, error);
      });
  }
  private encodeComplexHttpParams(params: any): any {
    if (!params) return null;
    return new HttpParams({fromString: this.paramsString(params)});
  }
  private paramsString(params: any): string {

    if (!params) return null;

    let str = "";

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        let value = params[key];
        if (value === null) continue;

        if (Array.isArray(value)) {
          if (value.length === 0) continue;

          for (let index = 0; index < value.length; index++) {
            let k = key + "[" + index + "]";
            let v = value[index];
            if (str.length > 1) str += "&";
            str += k + "=" + v;
          }
        } else if (isObject(value)) {

          for (let subKey in value) {
            if (value.hasOwnProperty(subKey)) {
              let v = value[subKey];
              if (v === null) continue;

              let k = key + "[" + subKey + "]";
              if (str.length > 1) str += "&";
              str += k + "=" + v;
            }
          }

        } else {
          if (str.length > 1) str += "&";
          str += key + "=" + value;
        }
      }
    }
    return str;
  }
}
