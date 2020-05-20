import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rest-details',
  templateUrl: './rest-details.page.html',
  styleUrls: ['./rest-details.page.scss'],
})
export class RestDetailsPage implements OnInit {

  restInformations: object = {}
  constructor() { }

  ngOnInit() {
    this.fetchRestaurantData()
  }

  

  fetchRestaurantData(){
    
  }
}
