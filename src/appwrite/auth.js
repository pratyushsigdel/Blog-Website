import conf from "../conf/conf";

import { Client, Account, ID } from "appwrite";

//Creating class first to perform authenication service from App Write
export class AuthService {
  client = new Client();
  account;

  //We have access to constructor from the object that we created below
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  //Method to create Account for a user

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      // Checking whether userAccount Exist
      if (userAccount) {
        //Call Login method Directly
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("AppWrite Service Error:: createAccount", error);
    }
  }
  //Creating Login Method
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("AppWrite Service Error:: Login User", error);
    }
  }

  //Checking Authentication State Of User
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("AppWrite Service Error:: getCurrent User", error);
    }

    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite Service:: logout ::  Error", error);
    }
  }
}

//Creating object from AuthService class and exporting it

const authService = new AuthService();

export default authService;
