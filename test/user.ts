/// <reference path="../typings/index.d.ts" />
/// <reference path="../index.d.ts"/>
/// <reference path="utils.ts"/>

import * as AV from 'leancloud-jssdk'
import * as chai from 'chai';

import * as utils from "./utils";

AV.init({
  appId:'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
  appKey:'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
  masterKey:'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s'});


  describe('User', function () {
    it('AV.User.signUp', function (done) {
      code_user_signUp_with_username_and_password(done);
    });

    it('AV.User.signUp duplicate users with same mobilePhoneNumber', function (done) {
      duplicate_users_with_same_mobilePhoneNumber(done);
    });

  });

function code_user_signUp_with_username_and_password(done){
  let user : AV.User = new AV.User();// 新建 AVUser 对象实例
  user.setUsername(newUsername());
  user.setPassword('cat!@#123');
  user.setEmail(newEmail());

  user.signUp<AV.User>().then((loginedUser)=>{
    chai.assert.isNotNull(loginedUser.id);
    done();
  },(error=>{
    if(error) throw error;
  }));
}

function duplicate_users_with_same_mobilePhoneNumber(done){
  let user1 : AV.User = new AV.User();// 新建 AVUser 对象实例
  user1.setUsername(newUsername());
  user1.setPassword('cat!@#123');
  user1.setEmail(newEmail());
  let mobile =  utils.newMobilePhoneNumber();
  user1.setMobilePhoneNumber(mobile);

  user1.signUp<AV.User>().then((loginedUser)=>{
    let user2 : AV.User = new AV.User();// 新建 AVUser 对象实例
    user2.setUsername(newUsername());
    user2.setPassword('cat!@#123');
    user2.setEmail(newEmail());
    user2.setMobilePhoneNumber(mobile);

    user2.signUp<AV.User>().then((loginedUser)=>{
    },(error=>{
      chai.assert.isNotNull(error);
      done();
    }));
  },(error=>{
    if(error) throw error;
  }));
}

function code_user_logIn_with_username_and_password(done){
  AV.User.logIn<AV.User>('Tom','cat!@#123').then((loginedUser)=>{
    console.log(loginedUser);
    chai.assert.isNotNull(loginedUser.id);
    done();
  },(error=>{
  }));
}

function code_user_logIn_with_mobilephonenumber_and_password(done){
  AV.User.logInWithMobilePhone<AV.User>('Tom','cat!@#123').then((loginedUser)=>{
    console.log(loginedUser);
    chai.assert.isNotNull(loginedUser.id);
    done();
  },(error=>{
  }));
}

function code_user_logIn_requestLoginSmsCode(done){
  AV.User.requestLoginSmsCode('13577778888').then((success)=>{
  },(error)=>{
  });
}

function code_user_logIn_with_smsCode(done){
  AV.User.logInWithMobilePhoneSmsCode('13577778888','238825').then((success)=>{
  },(error)=>{
  });
}

function code_get_user_properties(done){
  AV.User.logIn<AV.User>('Tom','cat!@#123').then((loginedUser)=>{
    console.log(loginedUser);
    let username :string = loginedUser.getUsername();
    let email :string = loginedUser.getEmail();
    // 请注意，密码不会明文存储在云端，因此密码只能重置，不能查看
  },(error=>{
  }));
}

function code_set_user_custom_properties(done){
  AV.User.logIn<AV.User>('Tom','cat!@#123').then((loginedUser)=>{
    console.log(loginedUser);
    loginedUser.set('age',25);
    loginedUser.save();
  },(error=>{
  }));
}

function code_update_user_custom_properties(done){
  AV.User.logIn<AV.User>('Tom','cat!@#123').then((loginedUser)=>{
    console.log(loginedUser);
    loginedUser.set('age',25);
    loginedUser.save();
  },(error=>{
  }));
}

function code_get_current_user(done){
  let currentUser :AV.User = AV.User.current();
  currentUser.getSessionToken();
}

function code_reset_password_by_email(done){
  AV.User.requestPasswordReset('myemail@example.com').then((success)=>{
  },(error)=>{
  });
}

function code_reset_password_by_mobilephoneNumber(done) {
  AV.User.requestPasswordResetBySmsCode('18612340000').then((success)=>{
  },(error)=>{
  });
}

function code_reset_password_by_mobilephoneNumber_verify(done) {
  AV.User.resetPasswordBySmsCode('123456','thenewpassword').then((success)=>{
  },(error)=>{
  });
}

function code_current_user(done){
  let currentUser :AV.User = AV.User.current();
  if(currentUser){
    // 跳转到首页
  } else {
    //currentUser 为空时，可打开用户注册界面…
  }
}

function code_current_user_logout(done){
  AV.User.logOut();
  // 现在的 currentUser 是 null 了
  let currentUser :AV.User = AV.User.current();
}

function code_query_user(done){
  let query : AV.Query = new AV.Query('_User');
}

export function newUsername(): string {
  return utils.randomString(10);
}
export function newEmail():string{
  return utils.randomString(8).concat('@leancloud.cn');
}
