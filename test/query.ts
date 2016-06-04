/// <reference path="../typings/index.d.ts" />

import * as AV from 'leancloud-jssdk';
import * as chai from 'chai';

AV.init({
  appId:'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
  appKey:'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
  masterKey:'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s'});

var Todo = AV.Object.extend('Todo');

describe('Query', function () {
  describe('#contains', function () {

    it('containsAll', function (done) {
      code_query_array_contains_all(done);
    });
  });

  // describe('#equal', function () {
  //   it('equalTo with array [1,2]', function (done) {
  //     code_query_array_contains_all(done);
  //   });
  // });

  describe('#get object by objectId', function () {
    it('objectId = 57328ca079bc44005c2472d0', function (done) {
      code_get_todo_by_objectId(done);
    });
  });

  describe('#match regRxp', function () {
    it('string contains Chinese', function (done) {
      code_query_with_regular_expression(done);
    });
  });

  describe('#array', function () {
    // it('save reminders', function (done) {
    //     save_reminders(done);
    // });
    it('query reminders contains 2011-11-11 08:30', function (done) {
      code_query_array_contains_using_equalsTo(done);
    });

    it('query foo contains [1,2]', function (done) {
      code_query_array_contains_all(done);
    });
  });

});

function code_query_array_contains_using_equalsTo(done){
  let query: AV.Query= new AV.Query('Todo');

  let reminderFilter: Array<Date> = [new Date('2015-11-11 08:30:00')];
  query.containsAll('reminders',reminderFilter);

  // 也可以使用 equals 接口实现这一需求
  let targetDateTime : Date =  new Date('2015-11-11 08:30:00');
  query.equalTo('reminders',targetDateTime);

  query.find<AV.Object []>().then(
    (results) =>{
      console.log(results.length);
      for(let r of results){
        console.log(r.id);
      }
      done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}


function code_query_array_contains_all(done){
  let query: AV.Query= new AV.Query('Boo');
  let queryFilter : Array<number> = [1,2];
  query.containsAll('foo',queryFilter);
  query.find<AV.Object []>().then(
    (results) =>{
      for(let r of results){
        console.log(r.id);
      }
      done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_get_todo_by_objectId(done){
  let query : AV.Query = new AV.Query('Todo');
  query.get<AV.Object>('57328ca079bc44005c2472d0').then((data)=>{
    chai.expect(data.id).to.equals('57328ca079bc44005c2472d0');
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function save_reminders(done){
  let reminder1: Date = new Date('2015-11-11 08:30:00');
  // let reminder2: Date = new Date('2015-11-11 09:30:00');
  // let reminder3: Date = new Date('2015-11-11 10:30:00');

  let reminders : Array<Date> = [reminder1];

  let todo : AV.Object = new AV.Object('Todo');
  todo.set('reminders',reminders);
  todo.save<AV.Object>().then((todo)=>{
    chai.assert.isNotNull(todo.id);
    done();
  },(error)=>{
    if(error) throw error;
    done();
  })
}

function code_create_query_by_className(done){
  let query: AV.Query= new AV.Query('Todo');
}

function code_priority_equalTo_zero_query(done){
  let query: AV.Query= new AV.Query('Todo');
  query.equalTo('priority',0);
  query.find<AV.Object []>().then((results)=>{
    let priorityEqualsZeroTodos : Array<AV.Object> =results;
  },(error)=>{

  });
}

function code_priority_equalTo_zero_and_one_wrong_example(done){
  let query: AV.Query= new AV.Query('Todo');
  query.equalTo('priority',0);
  query.equalTo('priority',1);
  query.find<AV.Object []>().then((results)=>{
    // 如果这样写，第二个条件将覆盖第一个条件，查询只会返回 priority = 1 的结果
  },(error)=>{

  });
}

function code_query_lessThan(done){
  let query: AV.Query= new AV.Query('Todo');
  query.lessThan('priority',2);
}

function code_query_greaterThanOrEqualTo(done){
  let query: AV.Query= new AV.Query('Todo');
  query.greaterThanOrEqualTo('priority',2);
}

function code_query_with_regular_expression(done){
  let query: AV.Query= new AV.Query('StringRegExp');
  let regExp : RegExp = new RegExp('[\u4e00-\u9fa5]','i');
  query.matches('title',regExp);
  query.find<AV.Object []>().then((results)=>{
    chai.expect(results.length).to.equals(3);
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_query_with_contains_keyword(done){
  let query: AV.Query= new AV.Query('Todo');
  query.contains('title','李总');
}

function code_query_with_not_contains_keyword_using_regex(done){
  let query: AV.Query= new AV.Query('Todo');
  let regExp : RegExp = new RegExp('^((?!机票).)*$','i');
  query.matches('title',regExp);
}

function code_query_with_not_contains_keyword(done){
  let query: AV.Query= new AV.Query('Todo');
  let filterArray : Array<string> = ['出差','休假'];
  query.notContainedIn('title',filterArray);
}


function code_query_whereHasPrefix(done){
  // 找出开头是「早餐」的 Todo
  let query: AV.Query= new AV.Query('Todo');
  query.startsWith('content','早餐');
}

function code_query_comment_by_todoFolder(done){
  let query: AV.Query= new AV.Query('Todo');
  let todoFolder : AV.Object = AV.Object.createWithoutData('Todo','5735aae7c4c9710060fbe8b0');
  query.equalTo('targetTodoFolder',todoFolder);
}

function code_create_tag_object(done){
  let tag1: AV.Object= new AV.Object('Todo');
  tag1.set('name','今日必做');

  let tag2: AV.Object= new AV.Object('Todo');
  tag2.set('name','老婆吩咐');

  let tag3: AV.Object= new AV.Object('Todo');
  tag3.set('name','十分重要');

  let tags:Array<AV.Object> = [tag1,tag2,tag3];

  AV.Object.saveAll<AV.Object []>(tags).then((savedTags)=>{
    let todoFolder:AV.Object = new AV.Object('TodoFolder');
    todoFolder.set('name','家庭');
    todoFolder.set('priority',1);

    let relation : AV.Relation = todoFolder.relation('tags');
    relation.add(tag1);
    relation.add(tag2);
    relation.add(tag3);

    todoFolder.save();
  },(error)=>{

  });
}

function code_query_tag_for_todoFolder(done){
  let todoFolder : AV.Object = AV.Object.createWithoutData('Todo','5735aae7c4c9710060fbe8b0');
  let relation : AV.Relation = todoFolder.relation('tags');
  let query : AV.Query = relation.query();
  query.find<AV.Object []>().then((results)=>{
    // results 是一个 AV.Object 的数组，它包含所有当前 todoFolder 的 tags
  },(error)=>{

  });
}

function code_query_todoFolder_with_tag(done) {
  let targetTag : AV.Object = AV.Object.createWithoutData('Tag','5655729900b0bf3785ca8192');
  let query: AV.Query= new AV.Query('TodoFolder');
  query.equalTo('tags',targetTag);
  query.find<AV.Object []>().then((results)=>{
    // results 是一个 AV.Object 的数组
    // results 指的就是所有包含当前 tag 的 TodoFolder
  },(error)=>{

  });
}

function code_query_comment_include_todoFolder(done){
  let commentQuery: AV.Query = new AV.Query('Comment');
  commentQuery.descending('createdAt');
  commentQuery.limit(10);
  commentQuery.include('targetTodoFolder');// 关键代码，用 includeKey 告知服务端需要返回的关联属性对应的对象的详细信息，而不仅仅是 objectId
  commentQuery.find<AV.Object []>().then((comments)=>{
    // comments 是最近的十条评论, 其 targetTodoFolder 字段也有相应数据
    for(let comment of comments){
      // 并不需要网络访问
      let todoFolder = comment.get('targetTodoFolder');
    }
  },(error)=>{

  });
}

function code_query_comment_match_query_todoFolder(done){
  // 构建内嵌查询
  let innerQuery: AV.Query = new AV.Query('TodoFolder');
  innerQuery.greaterThan('likes',20);

  // 将内嵌查询赋予目标查询
  let query: AV.Query = new AV.Query('Comment');

  // 执行内嵌操作
  query.matchesQuery('targetTodoFolder',innerQuery);

  query.find<AV.Object []>().then((results)=>{
    // results 就是符合超过 20 个赞的 TodoFolder 这一条件的 Comment 对象集合
  },(error)=>{

  });

  query.doesNotMatchQuery('targetTodoFolder',innerQuery);
  // 如此做将查询出 likes 小于或者等于 20 的 TodoFolder 的 Comment 对象
}

function code_query_find_first_object(done){
  let query: AV.Query = new AV.Query('Comment');
  query.equalTo('priority',0);
  query.first<AV.Object>().then((data)=>{
    // data 就是符合条件的第一个 AV.Object
  },(error)=>{

  });
}

function code_set_query_limit(done){
  let query: AV.Query = new AV.Query('Todo');
  let now : Date = new Date();
  query.lessThanOrEqualTo('createdAt',now);
  query.limit(10);
}
function code_set_skip_for_pager(done){
  let query: AV.Query = new AV.Query('Todo');
  let now : Date = new Date();
  query.lessThanOrEqualTo('createdAt',now);//查询今天之前创建的 Todo
  query.limit(10);// 最多返回 10 条结果
  query.skip(20);  // 跳过 20 条结果
}

function code_query_select_keys(done){
  let query: AV.Query = new AV.Query('Todo');
  // 指定返回的属性
  query.select('title','content');
  query.find<AV.Object []>().then((results)=>{
    for(let todo of results){
      let title = todo.get('title');
      let content = todo.get('content');

      // 如果访问没有指定返回的属性（key），则会报错，在当前这段代码中访问 location 属性就会报错
      let location = todo.get('location');
    }
  },(error)=>{

  });
}

function code_query_count(done){
  let query: AV.Query = new AV.Query('Todo');
  query.equalTo('status',1);
  query.count<number>().then((count)=>{
    console.log(count);
  },(error)=>{

  });
}

function code_query_orderby(done){
  let query: AV.Query = new AV.Query('Todo');
  query.ascending('createdAt');

  query.descending('createdAt');
}

function code_query_orderby_on_multiple_keys(done){
  let query: AV.Query = new AV.Query('Todo');
  query.ascending('priority');
  query.descending('createdAt');
}

function code_query_with_or(done){
  let priorityQuery: AV.Query = new AV.Query('Todo');
  priorityQuery.greaterThanOrEqualTo('priority',3);

  let statusQuery: AV.Query = new AV.Query('Todo');
  statusQuery.equalTo('status',1);

  let query : AV.Query =  AV.Query.or(priorityQuery,statusQuery);
  // 返回 priority 大于等于 3 或 status 等于 1 的 Todo
}

function code_query_with_and(done){
  let priorityQuery: AV.Query = new AV.Query('Todo');
  priorityQuery.greaterThanOrEqualTo('priority',3);

  let statusQuery: AV.Query = new AV.Query('Todo');
  statusQuery.equalTo('status',1);

  let query : AV.Query =  AV.Query.and(priorityQuery,statusQuery);
  // 返回 priority 小于 3 并且 status 等于 0 的 Todo
}

function code_query_where_keys_exist(done){
  let aTodoAttachmentImage : AV.File = AV.File.withURL('attachment.jpg','http://www.zgjm.org/uploads/allimg/150812/1_150812103912_1.jpg');
  let todo: AV.Object = new AV.Object('Todo');
  todo.set('images',aTodoAttachmentImage);
  todo.set('content','记得买过年回家的火车票！！！');
  todo.save();

  let query : AV.Query = new AV.Query('Todo');
  query.exists('images');
  query.find<AV.Object []>().then((results)=>{
    // results 返回的就是有图片的 Todo 集合
  },(error)=>{

  });

  // 使用空值查询获取没有图片的 Todo
  query.doesNotExist('images');
}

function code_query_by_cql(done) {
  let cql : string = 'select * from %@ where status = 1';
  AV.Query.doCloudQuery<any>(cql).then((data)=>{
    let results = data.results;
    // results 即为查询结果，它是一个 AV.Object 数组
  },(error)=>{

  });

  cql  = 'select * from %@ where status = 1';
  AV.Query.doCloudQuery<any>(cql).then((data)=>{
     let count = data.count;
     // count 是 number 类型
  },(error)=>{

  });
}

function code_query_by_cql_with_placeholder(done){
  let cql : string = 'select * from %@ where status = ? and priority = ?';
  let pvalues = [0,1];
  AV.Query.doCloudQuery<any>(cql,pvalues).then((data)=>{
     let results = data.results;
     // results 即为查询结果，它是一个 AV.Object 数组
  },(error)=>{

  });
}

function code_query_geoPoint_near(done){
  let query : AV.Query = new AV.Query('Todo');
  let point : AV.GeoPoint = new AV.GeoPoint('39.9','116.4');
  query.limit(10);
  query.near('whereCreated',point);
}

function code_query_geoPoint_within(done){
  let query : AV.Query = new AV.Query('Todo');
  let point : AV.GeoPoint = new AV.GeoPoint('39.9','116.4');
  query.withinKilometers('whereCreated',point,2.0);
  query.find<AV.Object []>().then((results)=>{
    // results 返回的就是有图片的 Todo 集合
    let nearbyTodos : AV.Object [] = results;
  },(error)=>{

  });
}
