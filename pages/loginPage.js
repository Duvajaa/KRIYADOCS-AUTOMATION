const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

class LoginPage {
    
    //Constructor
    constructor(page) {
      this.page = page;
      this.username = '#username';
      this.password = '#password';
      this.loginBtn = '.input-field.col.s12.login.center.loginButton';
      this.forgetPassword = ".row.login-view.forgetpassword.forgetPass a";
    }
  
    //Methods
    async openURL() {
      await this.page.goto(process.env.siteName);
    } 

    //enter username through argument
    async enterUsername(uname) {
      await this.page.fill(this.username, uname);
    }

    //enter passeord through argument
    async enterPassword(pass) {
      await this.page.fill(this.password, pass);
    }
  
    async clickLoginBtn() {
      await this.page.click(this.loginBtn);
    }

    async clickForgetPassword(){
      await this.page.click(this.forgetPassword);
    }
  
    //Functions
    // async login(email, password) {
    //   await this.navigateTo();
    //   await this.fillEmail(email);
    //   await this.clickNext();
    //   await this.page.waitForSelector('input[type="password"]', { state: 'visible' });
    //   await this.fillPassword(password);
    //   await this.clickLogin();
    // }
  }
  
  module.exports = LoginPage;
  