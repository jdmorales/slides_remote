import { Component } from '@angular/core';

@Component({
  selector: 'login-form',
  template: './login.component.html'
})

export class login {

  username : string;
  email    : string;
  password : string;

  constructor() {
    //this.username = 'Max'
  }

  sendForm(){

  }

}
