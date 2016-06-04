/// <reference path="../typings/index.d.ts" />

import * as chai from 'chai';
import * as AV from 'leancloud-jssdk';

AV.init({
  appId:'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
  appKey:'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
  masterKey:'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s'});



describe('ACL', function () {
  it('create_post_set_acl_for_single_user', function (done) {
    create_post_set_acl_for_single_user(done);
  });

});


function create_post_set_acl_for_single_user(done){
  let post : AV.Object = new AV.Object("Post");
  post.set('title','大家好，我是新人');

  let acl : AV.ACL = new AV.ACL();
  acl.setPublicReadAccess(true);
  acl.setWriteAccess(AV.User.current(),true);

  post.setACL(acl);
  post.save();
}

function create_post_set_acl_for_othter_user(done){

}
