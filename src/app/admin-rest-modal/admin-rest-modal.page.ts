import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-rest-modal',
  templateUrl: './admin-rest-modal.page.html',
  styleUrls: ['./admin-rest-modal.page.scss'],
})
export class AdminRestModalPage implements OnInit {
  restInformations: object = {}

  constructor() { }

  ngOnInit() {
  }

}
