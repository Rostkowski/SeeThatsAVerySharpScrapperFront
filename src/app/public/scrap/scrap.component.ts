import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ScrapService } from 'src/app/services/scrap.service';
import { finalize} from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-scrap',
  templateUrl: './scrap.component.html',
  styleUrls: ['./scrap.component.css'],
})
export class ScrapComponent implements OnInit {
  constructor(private form: FormBuilder, private scrapService: ScrapService) {}

  listOfFields: string[] = [];
  selectorsDict: { [key: string]: string } = {};
  urls: string[] = [];
  scrapForm = this.form.group({
    urls: '',
    field: '',
    selectors: '',
  });
  isDataFetched: boolean = false;
  isLoading: boolean = false;
  scrapedData: any;

  ngOnInit() {
    this.listOfFields = JSON.parse(
      window.localStorage.getItem('listOfFields') ?? ''
    );
    this.selectorsDict = JSON.parse(
      window.localStorage.getItem('selectorsDict') ?? ''
    );
    this.urls = JSON.parse(window.localStorage.getItem('urls') ?? '');
  }

  onSubmit() {
    window.localStorage.setItem(
      'listOfFields',
      JSON.stringify(this.listOfFields)
    );

    window.localStorage.setItem(
      'selectorsDict',
      JSON.stringify(this.selectorsDict)
    );

    window.localStorage.setItem('urls', JSON.stringify(this.urls));

    this.isLoading = true;

    this.scrapService
      .scrapData({
        urls: this.urls,
        cssSelectors: this.selectorsDict,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res) => {
        if (res.ok) {
          this.isDataFetched = true;
          this.scrapedData = res.body?.scrapedData;
        }
      });
  }

  addNewSelectorField(selectorName: string) {
    if (this.listOfFields.includes(selectorName) || selectorName.length === 0) {
      return;
    }

    this.listOfFields.push(selectorName);
    this.selectorsDict[selectorName] = '';
  }

  removeSelectorField(selectorName: string) {
    let index = this.listOfFields.indexOf(selectorName);
    this.listOfFields.splice(index, 1);
    delete this.selectorsDict[selectorName];
  }

  updateSelector(selectorName: string, selectorValue: any) {
    this.selectorsDict[selectorName] = selectorValue.srcElement.value;
  }

  getUrlsInProperFormat(event: any) {
    this.urls = event.srcElement.value
      .replace(/(?:\r\n|\r|\n)/g, '')
      .split(',');
  }

  downloadFile(data: any) {
    const replacer = (key: string, value: string) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map((row: any) => header.map((fieldName: string) => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, "scrapedData.csv");
}
}
