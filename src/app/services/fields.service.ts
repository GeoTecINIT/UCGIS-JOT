import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const collection = 'Fields';

export interface Field { name: string; code: Number; parent: string; grandparent: string; greatgrandparent: string; concatName: string; }

@Injectable({
  providedIn: 'root'
})
export class FieldsService {
  public allfields: any;
  public allDatasets: any;
  public allTools: any;
  public result: any;
  constructor(
    private http: HttpClient) {

    // TODO: Move fields.json to firebase storage - gives a CORS error
    // const ref = this.storage.ref('fields.json');
    //  ref.getDownloadURL().subscribe(function(url) {

    this.http.get('assets/json/fields.json').subscribe((data) => {
      this.allfields = data;
      /* // sort by two or more keys
        this.allfields.sort((a, b) => {
          return this.cmp(
            [this.cmp(a.grandparent, b.grandparent), this.cmp(a.name, b.name)],
            [this.cmp(b.grandparent, a.grandparent), this.cmp(b.name, a.name)]
          );
        });
        console.log(JSON.stringify(this.allfields));
        */
    });

    // http://database.eohandbook.com/data/dataactivity.aspx
    this.http.get('assets/json/datasets_eohandbook.json').subscribe((data) => {
      this.allDatasets = data;
    });

    // https://inspire-reference.jrc.ec.europa.eu/tools
    // tslint:disable-next-line:max-line-length
    // http://www.esa.int/Enabling_Support/Space_Engineering_Technology/Radio_Frequency_Systems/Open_Source_Software_Resources_for_Space_Downstream_Applications
    this.http.get('assets/json/tools.json').subscribe((data) => {
      this.allTools = data;
    });
  }

  // generic comparison function
  cmp(x, y) {
    return x > y ? 1 : x < y ? -1 : 0;
  }


}

