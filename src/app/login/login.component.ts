import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FacebookService, private router: Router) {
    
        let initParams: InitParams = {
          appId: '1329354343859062',
          xfbml            : true,
          version          : 'v2.11'
        };
    
        fb.init(initParams);
    
  }

  ngOnInit() {
  }

  login(): void {
    
    this.fb.login({scope: "user_photos"})
      .then((response: LoginResponse) => { console.log(response.authResponse.userID+" connected");
                                            this.router.navigate(["/home"]);})
      .catch((error: any) => console.error(error));
    
  }

}
