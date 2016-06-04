/// <reference path="../typings/index.d.ts" />

import * as AV from 'leancloud-jssdk';
import * as chai from 'chai';

AV.init({
  appId:'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
  appKey:'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
  masterKey:'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s'});

var Todo = AV.Object.extend('Todo');

describe('Object', function () {
  describe('#save()', function () {
    it('save with promise', function (done) {
      code_quick_save_a_todo(done);
    });

    it('save with lambda', function (done) {
      var todo = new Todo();
      todo.set('title', '工程师周会');
      todo.set('content', '每周工程师会议，周一下午2点');
      todo.save({
        success: todo => {
          // 成功之后打印 todo 对象的 objectId
          //console.log(todo.id);
          chai.assert.isNotNull(todo.id);
          done();
        }, error: error => {
          // 失败之后可以打印 error 信息来查看
          console.log(error);
          done();
        }
      });
    });

    it('save with cql', function (done) {
      code_save_object_by_cql(done);
    });

    it('save with general', function (done) {
      code_save_todo_folder(done);
    });

    it('save with query options', function (done) {
      code_saveoption_query_example(done);
    });

    it('data type test', function (done) {
      code_data_type(done);
    });

    it('access objectId', function (done) {
      code_save_callback_get_objectId(done);
    });

    it('access proprties', function (done) {
      text_access_object_properties(done);
    });
    it('addUnique for array', function (done) {
      code_set_array_value(done);
    });

  });

  describe('#fetch()', function () {
      it('fetch by objectId', function (done) {
        code_object_fetch(done);
      });

      it('fetch with include keys', function (done) {
        code_object_fetch_with_keys(done);
      });

      it('fetch with fetchWhenSave = true', function (done) {
        fetchWhenSave_test(done);
      });
    });

  describe('#update()', function () {
    it('update with objectId', function (done) {
      let todo = AV.Object.createWithoutData('Todo', '57328dc149830c0061c7b908');
      todo.set('title', '工程师周会');
      todo.set('location', '二楼会议室');
      todo.save().then(function (todo) {
        chai.assert.isNotNull(todo);
        done();
      }, function (err) {
        if (err) throw err;
        done();
      });
    });

    it('update with query', function (done) {
      let query = new AV.Query('Todo');
      query.first<AV.Object>(result =>{
        let objectId= result.id;
        result.set('title','更改标题');
        result.save({success:success =>{
          chai.assert.isNotNull(result.id);
          done();
        },error:error=>{
          if(error) throw error;
          done();
        }})
      });
    });

    it('update with cql', function (done) {
      let query = new AV.Query('Todo');
      query.first<AV.Object>(result =>{
        let objectId= result.id;
        result.set('title','更改标题');
        result.save({success:success =>{
          chai.assert.isNotNull(result.id);
          done();
        },error:error=>{
          if(error) throw error;
          done();
        }})
      });
    });

    it('update by atomic operation increment', function (done) {
      code_atomic_operation_increment(done);
    });
  });
});

function code_quick_save_a_todo(done){
  let todo = new AV.Object('Todo');

  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  todo.save<AV.Object>().then(
      (data) => {
        // data 是根据 todo.save<AV.Object> 传入的泛型参数决定
        let savedTodo : AV.Object = data;
        chai.assert.isNotNull(savedTodo.id);
        done();
      },
      (error) => {
        done();
      }
  );
}

function code_quick_save_a_todo_with_location(done){
  let todo = new AV.Object('Todo');
  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  todo.set('location', '会议室');//只要添加这一行代码，服务端就会自动添加这个字段
  todo.save<AV.Object>().then(
      (data) => {
        // data 是根据 todo.save<AV.Object> 传入的泛型参数决定
        let savedTodo : AV.Object = data;
        chai.assert.isNotNull(savedTodo.id);
        done();
      },
      (error) => {
        if(error) throw error;
      }
  );
}

function code_save_object_by_cql(done){
  // 执行 CQL 语句实现新增一个 TodoFolder 对象
  AV.Query.doCloudQuery<any>('insert into TodoFolder(name, priority) values("工作", 2)').then(
    (data) => {
      let savedTodo : AV.Object = data.results[0];
      console.log(savedTodo);
      chai.assert.isNotNull(savedTodo.id);
      done();
    },
    (error) => {
    if(error) throw error;
      done();
    }
  );
}

function code_save_todo_folder(done){
  let todoFolder:AV.Object = new AV.Object('TodoFolder');// 新建对象
  todoFolder.set('name','工作');// 设置名称
  todoFolder.set('priority',1);// 设置优先级
  todoFolder.save<AV.Object>().then(
    (data) => {
      let savedTodoFolder : AV.Object = data;
      chai.assert.isNotNull(savedTodoFolder.id);
      done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_saveoption_query_example(done){
  new AV.Query('Wiki').first<AV.Object>().then((data) => {
    let wiki:AV.Object = data;
    let currentVersion = wiki.get('version');
    wiki.set('version',currentVersion + 1);
    wiki.save<AV.Object>(null,{
      query:new AV.Query('Wiki').equalTo('version', currentVersion)
    }).then((data) =>{
      chai.expect(data.get('version')).to.equals(currentVersion + 1);
      done();
    },error=>{
      if(error) throw error;
      done();
    });
  },error=>{
    if(error) throw error;
    done();
  })
}

function code_data_type(done){
  let testNumber : number = 13;
  let testString : string = 'here is a test string';
  let testDate : Date = new Date('2016-06-04');
  let testNumberArray : Array<number> = [1, 2, 3];
  let testStringArray : Array<string> = ['here','is','a','string','array'];
  let testObjectType : Object = {name:'LeanCloud',url:'https://leancloud.cn'};

  let testAVObject = new AV.Object('TestClass');
  testAVObject.set('testNumber', testNumber);
  testAVObject.set('testString', testString);
  testAVObject.set('testDate', testDate);
  testAVObject.set('testNumberArray', testNumberArray);
  testAVObject.set('testStringArray', testStringArray);
  testAVObject.set('testObject', testObjectType);

  testAVObject.save<AV.Object>().then(
    (data) => {
      chai.assert.isNotNull(data.id)
      done();
  },(error) =>{
    if(error) throw error;
  });
}

function code_save_callback_get_objectId(done){
  let todo : AV.Object = new AV.Object('Todo');
  todo.set('title', '工程师周会');
  todo.set('content', '每周工程师会议，周一下午2点');
  todo.save<AV.Object>().then((data) => {
    // 成功保存之后，执行其他逻辑
    let objectId = data.id;// 获取 objectId
    chai.assert.isNotNull(data.id)
    done();
  },  (error)=> {
    // 失败之后执行其他逻辑
    // error 是 AV.Error 的实例，包含有错误码和描述信息.
    if(error) throw error;
    done();
  });
}

function text_access_object_properties(done){
  let query : AV.Query = new AV.Query('Todo');
  query.get<AV.Object>('57328ca079bc44005c2472d0').then((todo)=>{
    let priority : number = todo.get('priority');
    let location : string = todo.get('location');// 可以指定读取的类型
    let title = todo.get('title');// 也可以不指定读取的类型

    // 获取三个特殊属性
    let objectId : string = todo.id;
    var updatedAt : Date = todo.updatedAt;
    var createdAt : Date = todo.createdAt;
    console.log(createdAt);
    chai.expect(todo.id).to.equals('57328ca079bc44005c2472d0');
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_object_fetch(done){
  let todo : AV.Object = new AV.Object('Todo');
  todo.id = '57328ca079bc44005c2472d0';
  todo.fetch<AV.Object>().then((todo)=>{
    // todo 是从服务器加载到本地的 AV.Object
    let priority : number = todo.get('priority');    // 读取 todo 的属性
    chai.assert.isNotNull(priority);
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_object_fetchWhenSave(done){
  let todo : AV.Object = new AV.Object('Todo');
  todo.fetchWhenSave(true);
  todo.save<AV.Object>().then((data)=>{
    // 保存成功
    chai.assert.isNotNull(todo.get('priority'));
    done();
  },(error)=>{
    if(error) throw error;
  });
}

function code_update_todo_location(done){
  // 已知 objectId，创建 AV.Object
  // 第一个参数是 className，第二个参数是该对象的 objectId
  let todo:AV.Object = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  // 更改属性
  todo.set('location', '二楼大会议室');

  todo.save<AV.Object>().then((todo)=>{
    // 保存成功，可以打开控制台核对修改结果
    chai.assert.isNotNull(todo.get('title'));
    done();
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_object_fetch_with_keys(done){
  // 使用已知 objectId 构建一个 AV.Object
  let todo:AV.Object = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  //  传入 include 参数，指定获取的属性
  todo.fetch<AV.Object>(
    {include:'priority,location'
  },{}).then(
    (todo) =>{
    // 获取到本地
    chai.assert.isNotNull(todo.get('priority'));
    done();
  }, (error) =>{
    if(error) throw error;
    done();
  });
}

function fetchWhenSave_test(done){
  let todo:AV.Object = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  todo.set('title','huhna');
  todo.fetchWhenSave(false);
  todo.save<AV.Object>().then((updatedTodo)=>{
    done();
  },(error)=>{

  });
}

function code_update_object_by_cql(done){
  // 执行 CQL 语句实现新增一个 TodoFolder 对象
  AV.Query.doCloudQuery<AV.Object>('update TodoFolder set name="家庭" where objectId="558e20cbe4b060308e3eb36c"').then(
    (data) => {
      let savedTodo : AV.Object = data;
      chai.assert.isNotNull(savedTodo.id);
      done();
    },
    (error) => {
      if(error) throw error;
      done();
    }
  );
}

function code_atomic_operation_increment(done){
  let todo:AV.Object = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  todo.set('views',0);
  todo.save<AV.Object>().then((todo)=>{
    todo.increment("views",1);
    todo.fetchWhenSave(true);
    // 也可以指定增加一个特定的值
    // 例如一次性加 5
    todo.increment("views",5);
    todo.save<AV.Object>().then((data)=>{
      // 因为使用了 fetchWhenSave 选项，save 调用之后，如果成功的话，对象的计数器字段是当前系统最新值。
      chai.expect(data.get('views')).to.equal(6);
      done();
    },(error)=>{
      if(error) throw error;
      done();
    });
  },(error)=>{
    if(error) throw error;
    done();
  });
}

function code_set_array_value(done){
  let reminder1: Date = new Date('2015-11-11 07:10:00');
  let reminder2: Date = new Date('2015-11-11 07:20:00');
  let reminder3: Date = new Date('2015-11-11 07:30:00');

  let reminders : Array<Date> = [reminder1,reminder2,reminder3];

  let todo : AV.Object = new AV.Object('Todo');
  todo.addUnique('reminders',reminders);
  todo.save<AV.Object>().then((todo)=>{
    chai.assert.isNotNull(todo.id);
    done();
  },(error)=>{
    if(error) throw error;
    done();
  })
}

function code_delete_todo_by_objectId(done){
  let todo:AV.Object = AV.Object.createWithoutData('Todo', '57328ca079bc44005c2472d0');
  todo.destroy().then(
    (success)=>{
      chai.assert.isNotNull(todo.id);
      done();
    // 删除成功
  },(error)=>{
    // 删除失败
  });
}

function code_batch_operation(done){
  let avObjectArray:Array<AV.Object> = [/*...*/];// 构建一个 AV.object 数组

  // 批量创建、更新
  AV.Object.saveAll<AV.Object []>(avObjectArray).then((avobjs)=>{

  },(error)=>{

  });

  // 批量删除
  AV.Object.destroyAll<AV.Object []>(avObjectArray).then((avobjs)=>{

  },(error)=>{

  });

  // 批量获取
  AV.Object.fetchAll<AV.Object []>(avObjectArray).then((avobjs)=>{

  },(error)=>{

  });
}

function code_delete_todo_by_cql(done){
  // 执行 CQL 语句实现删除一个 Todo 对象
  AV.Query.doCloudQuery<AV.Object>('delete from Todo where objectId="558e20cbe4b060308e3eb36c"').then(
    (data) => {
      let savedTodo : AV.Object = data;
      chai.assert.isNotNull(savedTodo.id);
      done();
    },
    (error) => {
      if(error) throw error;
      done();
    }
  );
}

function code_batch_set_todo_completed(done){
  let query:AV.Query = new AV.Query('Todo');
  query.find<AV.Object []>().then((todos)=>{
    for(let todo of todos){
      todo['status'] = 1;
    }

    AV.Object.saveAll(todos).then(
      (success)=>{
        // 保存成功
    },(error)=>{

    })
  },(error)=>{

  });
}

function code_relation_todoFolder_one_to_many_todo(done){

  let todoFolder : AV.Object = new AV.Object('TodoFolder');
  todoFolder.set('name','工作');
  todoFolder.set('priority',1);

  let todo1 : AV.Object = new AV.Object('Todo');
  todo1.set('title','工程师周会');
  todo1.set('content','每周工程师会议，周一下午2点');
  todo1.set('location','会议室');

  let todo2 : AV.Object = new AV.Object('Todo');
  todo2.set('title','维护文档');
  todo2.set('content','每天 16：00 到 18：00 定期维护文档');
  todo2.set('location','当前工位');

  let todo3 : AV.Object = new AV.Object('Todo');
  todo3.set('title','发布 SDK');
  todo3.set('content','每周一下午 15：00');
  todo3.set('location','SA 工位');

  let localTodos:Array<AV.Object> = [todo1,todo2,todo3];// 构建一个 AV.object 数组
  AV.Object.saveAll<AV.Object []>(localTodos).then(
    (cloudTodos)=>{
      let relation: AV.Relation = todoFolder.relation('containedTodos');// 创建 AV.Relation
      for(let todo of cloudTodos){
        relation.add(todo);// 建立针对每一个 Todo 的 Relation
      }
      todoFolder.save();// 保存到云端
    },(error)=>{

    });
}

function code_pointer_comment_one_to_many_todoFolder(done){
  let comment : AV.Object = new AV.Object('Comment');// 构建 Comment 对象
  comment.set('like',1);// 如果点了赞就是 1，而点了不喜欢则为 -1，没有做任何操作就是默认的 0
  comment.set('content','这个太赞了！楼主，我也要这些游戏，咱们团购么？');

  // 假设已知被分享的该 TodoFolder 的 objectId 是 5735aae7c4c9710060fbe8b0
  let targetTodoFolder : AV.Object = AV.Object.createWithoutData('TodoFolder','5735aae7c4c9710060fbe8b0');
  comment.set('targetTodoFolder',targetTodoFolder);
  comment.save();
}

function code_create_geoPoint(){
  // 第一个参数是： latitude ，纬度
  // 第二个参数是： longitude，经度
  let point1 : AV.GeoPoint = new AV.GeoPoint(39.9,116.4);

  // 以下都是可用的创建 AV.GeoPoint 不同的方法
  let point2 : AV.GeoPoint = new AV.GeoPoint([12.7,72.2]);
  let point3 : AV.GeoPoint = new AV.GeoPoint({latitude: 30, longitude: 30});
}

function code_data_protocol_save_date(done){
  let testDate : Date = new Date('2016-06-04');
  let testAVObject = new AV.Object('TestClass');
  testAVObject.set('testDate', testDate);
  testAVObject.save();
}

function code_fetch_todo_by_objectId(done){
  // 第一个参数是 className，第二个参数是 objectId
  let todo : AV.Object = AV.Object.createWithoutData('Todo','5745557f71cfe40068c6abe0');
  let title = todo.get('title');// 读取 title
  let content = todo.get('content');// 读取 content
}

function code_update_todo_content_with_objectId(done){
  // 第一个参数是 className，第二个参数是 objectId
  let todo : AV.Object = AV.Object.createWithoutData('Todo','5745557f71cfe40068c6abe0');
  // 修改属性
  todo.set('content','每周工程师会议，本周改为周三下午3点半。');
  // 保存到云端
  todo.save();
}
