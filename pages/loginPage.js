const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

class LoginPage {
    constructor(page) {
      this.page = page;
      this.username = '#username';
      this.password = '#password';
      this.loginBtn = '.input-field.col.s12.login.center.loginButton';
    }
  
    async openURL() {
      await this.page.goto(process.env.siteName);
    }

    async enterUsername() {
      await this.page.fill(this.username, process.env.kusername);
    }

    //enter username through argument
    async enterUsername(uname) {
      await this.page.fill(this.username, uname);
    }
  
    async enterPassword() {
      await this.page.fill(this.password, process.env.password);
    }

    //enter passeord through argument
    async enterPassword(pass) {
      await this.page.fill(this.password, pass);
    }
  
    async clickLoginBtn() {
      await this.page.click(this.loginBtn);
    }
  
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
  