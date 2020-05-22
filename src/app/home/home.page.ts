import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentUserId: string
  informations: any = {}
  checkOutMode: boolean = true
  mandatoryFields = {
    name: false,
    symtomConfirmation: false,
    adress: false,
    cellphone: false,
    eMail: false,
    table: false,
    checkIn: false,
    checkOut: false,
    deletionTime: 0,
    submitButton: true
  }

  functions = firebase.app().functions('europe-west3')

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    public loadingController: LoadingController
  ) {}

  
  ngOnInit() {
    this.currentUserId          = null
    this.route.queryParams.subscribe((params) => {
      if(params && params.gastroID && params.table && params.secret && params.state) {
        this.informations.gastroID  = params.gastroID
        this.informations.table     = params.table
        this.informations.secret    = params.secret
        this.informations.state     = params.state
      } else {
        // KEINE PARAMETER
      }
    })
    

    // Get the value of userId
    this.storage.get("userId").then((val) => {
      // if the value was found
      if(val){
        // se the current user ID to this value
        this.currentUserId = val
        console.log(val)
      } else {
        // no id found
        // setup the formular based on state
        this.setFieldsBasedOnState()
        // make the forumlar visible
        this.checkOutMode = false
      }
    })
  }

  async checkOut(){
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    // define Check out Guest Cloud function
    const guestCheckOut = this.functions.httpsCallable('guestCheckOut')
    guestCheckOut({ uid: this.currentUserId }).then(() => {
      // set the user to checked out and return him back to the formular
      this.checkOutMode = false
      // clear the key storage
      this.storage.clear()
      // setup the formular based on state
      this.setFieldsBasedOnState()
      loading.dismiss()
    }).catch((err) => {
      console.log(err)
      loading.dismiss()
    })
  }

  // @argument data - firstName, lastName, email, cellphone, city, street, zip, gastroID, tableNr, deletionWeeks 
  async sendFormular(){
    if(this.mandatoryFields.name && !(this.informations.firstName || this.informations.lastName)) {
      console.log("Name fehlt !")
      // Benachrichtigung
      return
    }
    if(this.mandatoryFields.symtomConfirmation && !(this.informations.symptoms)) {
      console.log("Symptomabfrage fehlt !")
      // Benachrichtigung
      return
    }
    if(this.mandatoryFields.adress && !(this.informations.street || this.informations.city || this.informations.zip)) {
      console.log("Adresse fehlt !")
      // Benachrichtigung
      return
    }
    if(this.mandatoryFields.cellphone && !(this.informations.cellphone)) {
      console.log("Telefonnummer fehlt !")
      // Benachrichtigung
      return
    }
    if(this.mandatoryFields.eMail && !(this.informations.eMail)) {
      console.log("Email Adresse fehlt !")
      // Benachrichtigung
      return
    }

    
    const loading = await this.loadingController.create({
      message: 'Bitte warten...'
    });
    await loading.present();

    this.informations.deletionWeeks = this.mandatoryFields.deletionTime
  
    firebase.auth().signInAnonymously().then(() => {
      const addGuest = this.functions.httpsCallable('addGuest')
      addGuest(this.informations).then(() => {
        this.storage.set("userId", firebase.auth().currentUser.uid).then(() => console.log("saved user"))
        this.currentUserId = firebase.auth().currentUser.uid
        this.checkOutMode = true
        loading.dismiss()
        firebase.auth().currentUser.delete().catch((err) => {
          console.log(err)
          loading.dismiss()
        })
      }).catch((err) => {
        console.log(err)
        loading.dismiss()
      })
    }).catch((err) => {
      console.log(err)
      loading.dismiss()
    })
  }

  test(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        gastroID: "3wKgzegbBz2b9cVkqLCD",
        table: 2,
        secret: "none",
        state: "NW"
      }
    };
    this.router.navigate(['home'], navigationExtras)
  }
  
  setFieldsBasedOnState(){
    switch (this.informations.state) {
      case "BW": // Baden-Württemberg
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "BY": // Bayern
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "BE": // Berlin
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = false
        this.mandatoryFields.checkOut           = false
        this.mandatoryFields.deletionTime       = 4 
        break;
      case "BB": // Brandenburg
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4 
        break;
      case "HB": // Bremen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 3 
        break;
      case "HH" || "RE" || "HE": // Hamburg, Hessen, Rheinland-Pfalz
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = false
        this.mandatoryFields.checkOut           = false
        this.mandatoryFields.deletionTime       = 4
        break;
      case "MV": // Meklenburg-Vorpommern
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = true
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "NI": // Niedersachsen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 3
        break;
      case "NW": // Nordrhein-Westfalen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = true
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "SL": // Saarland
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4
        break;
      case "SN": // Sachsen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4 
        break;
      case "ST": // Sachsen-Anhalt
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = true
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 8
        break;
      case "SH": // Schleswig-Holstein
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = false
        this.mandatoryFields.adress             = true
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = true
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = false
        this.mandatoryFields.checkOut           = false
        this.mandatoryFields.deletionTime       = 46
        break;
      case "TH": // Thüringen
        this.mandatoryFields.name               = true
        this.mandatoryFields.symtomConfirmation = true
        this.mandatoryFields.adress             = false
        this.mandatoryFields.cellphone          = true
        this.mandatoryFields.eMail              = false
        this.mandatoryFields.table              = false
        this.mandatoryFields.checkIn            = true
        this.mandatoryFields.checkOut           = true
        this.mandatoryFields.deletionTime       = 4 
        break;      
      default:
        break;
    }
  }
}
