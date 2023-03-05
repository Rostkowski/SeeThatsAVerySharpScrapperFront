import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ScrapService } from 'src/app/services/scrap.service';

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

  ngOnInit() {
    this.listOfFields = JSON.parse(
      window.localStorage.getItem('listOfFields') ?? ''
    );
    this.selectorsDict = JSON.parse(
      window.localStorage.getItem('selectorsDict') ?? ''
    );
    this.urls = JSON.parse(window.localStorage.getItem('urls') ?? '')
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
    this.scrapService
      .scrapData({
        urls: this.urls,
        cssSelectors: this.selectorsDict,
      })
      .subscribe((res) => {
        console.log(res);
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
}
