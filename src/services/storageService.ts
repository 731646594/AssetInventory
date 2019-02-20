import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
export class PageUtil{
  public static pages={};
}
@Injectable()
export class StorageService {
  item="";
  AssetInventoryDatabase:SQLiteObject;
  constructor(public sqlite:SQLite) { }
  initDatabase(){
    this.sqlite.create({
      name:'AssetInventory.db',
      location:'default'
    }).then((database:SQLiteObject)=>{
      this.AssetInventoryDatabase = database;
    })
    PageUtil.pages["storage"]=this;
  }
  createUserTable(tableName){
    this.AssetInventoryDatabase.executeSql('CREATE TABLE IF NOT EXISTS '+ tableName +' (userCode VARCHAR(20),stringData VARCHAR(255));',[]).then().catch(e => alert("erro1:"+JSON.stringify(e)));
  }
  getUserTable(){
    return this.AssetInventoryDatabase;
  }
  insertIntoUserTable(tableName,userCode,stringData) {
    this.AssetInventoryDatabase.executeSql('INSERT INTO '+tableName+' VALUES (?, ?);', [userCode, stringData]).then().catch(e => alert("erro3:"+JSON.stringify(e)));
  }

  updateUserTable(tableName,userCode,stringData) {
    this.AssetInventoryDatabase.executeSql('UPDATE '+tableName+' SET stringData=? WHERE userCode=?;', [stringData, userCode]).then().catch(e => alert("erro4:"+JSON.stringify(e)));
  }
  deleteUserTable(tableName){
    this.AssetInventoryDatabase.executeSql('DROP TABLE '+tableName+';', []).then().catch(e => alert("erro5:"+JSON.stringify(e)));
  }
  write(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  read<T>(key: string): T {
    let value: string = localStorage.getItem(key);

    if (value && value != "undefined" && value != "null") {
      return <T>JSON.parse(value);
    }

    return null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
