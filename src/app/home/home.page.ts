import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage'

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
    private storage: Storage
  ) {}
  
  ngOnInit() {
    this.currentUserId          = null
    this.informations.gastroID  = this.route.snapshot.paramMap.get('gastroID')
    this.informations.table     = this.route.snapshot.paramMap.get('table')
    this.informations.secret    = this.route.snapshot.paramMap.get('secret')
    this.informations.state     = this.route.snapshot.paramMap.get('state')

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

  checkOut(){
    // define Check out Guest Cloud function
    const guestCheckOut = this.functions.httpsCallable('guestCheckOut')
    guestCheckOut({ uid: this.currentUserId }).then(() => {
      // set the user to checked out and return him back to the formular
      this.checkOutMode = false
      // clear the key storage
      this.storage.clear()
      // setup the formular based on state
      this.setFieldsBasedOnState()
    }).catch((err) => {
      console.log(err)
    })
  }

  // @argument data - firstName, lastName, email, cellphone, city, street, zip, gastroID, tableNr, deletionWeeks 
  sendFormular(){
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

    this.informations.deletionWeeks = this.mandatoryFields.deletionTime
  
    firebase.auth().signInAnonymously().then(() => {
      const addGuest = this.functions.httpsCallable('addGuest')
      addGuest(this.informations).then(() => {
        this.storage.set("userId", firebase.auth().currentUser.uid).then(() => console.log("saved user"))
        this.currentUserId = firebase.auth().currentUser.uid
        this.checkOutMode = true
        firebase.auth().currentUser.delete().catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(err)
    })
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
