/// <reference path="../typings/index.d.ts" />

import * as AV from 'leancloud-jssdk';
import * as chai from 'chai';

AV.init({
  appId:'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
  appKey:'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
  masterKey:'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s'});


  describe('sms', function () {
    it('AV.Cloud.requestSmsCode', function (done) {
      code_send_sms_code_for_loginOrSignup(done);
    });
  });

  function code_send_sms_code_for_loginOrSignup(done){
    AV.Cloud.requestSmsCode('18612438929').then((success)=>{
      if(success) {
        done();
      }
    },(error)=>{
    });

    AV.User.logInWithMobilePhone('13577778888','cat!@#123').then((success)=>{

    },(error)=>{

    });
  }

  function code_verify_sms_code_for_loginOrSignup(done){
    AV.User.signUpOrlogInWithMobilePhone('13577778888','123456').then((success)=>{
    },(error)=>{
    });
  }
