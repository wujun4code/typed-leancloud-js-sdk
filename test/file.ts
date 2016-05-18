/// <reference path="../typings/index.d.ts" />
/// <reference path="../index.d.ts"/>

import * as AV from 'leancloud-jssdk'
import * as chai from 'chai';
AV.init({
  appId:'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
  appKey:'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
  masterKey:'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s'});

describe('File', function () {
  it('#save text file from string', function (done) {
    code_create_avfile_by_stream_data(done);
  });

  it('#save file from url', function (done) {
    code_create_avfile_from_url(done);
  });

});

function code_create_avfile_by_stream_data(done){
  let data = { base64:'6K+077yM5L2g5Li65LuA5LmI6KaB56C06Kej5oiR77yf'};
  let base64File : AV.File = new AV.File('resume.txt',data);
  base64File.save<AV.File>().then((savedFile)=>{
    chai.assert.isNotNull(savedFile.url);
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });
  let bytes = [ 0xBE, 0xEF, 0xCA, 0xFE ];
  let byteArrayFile:AV.File = new AV.File('myfile.txt',bytes);
  byteArrayFile.save();
}

function code_create_avfile_from_url(done){
  let file : AV.File = AV.File.withURL('Satomi_Ishihara.gif','http://ww3.sinaimg.cn/bmiddle/596b0666gw1ed70eavm5tg20bq06m7wi.gif');
  file.save<AV.File>().then((savedFile)=>{
    chai.assert.isNotNull(savedFile.url);
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });

  let thumbnailURL = file.thumbnailURL(100,200);

  // 获取文件大小
  let size = file.size();
  // 上传者(AV.User) 的 objectId，如果未登录，默认为空
  let ownerId = file.ownerId();

  // 获取文件的全部元信息
  let metadata = file.metaData();
  // 设置文件的作者
  file.metaData('author','LeanCloud');
  // 获取文件的格式
  let format = file.metaData('format');

}

function code_file_delete(done) {
  let file:AV.File = AV.File.createWithoutData('552e0a27e4b0643b709e891e');
  file.destroy().then((success)=>{

  },(error)=>{

  });
}
