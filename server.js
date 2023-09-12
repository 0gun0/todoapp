const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient
app.set('vew engine', 'ejs')

var db;
MongoClient.connect('mongodb+srv://sparta:aaaa4321@cluster0.mcun02k.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    if (에러) return console.log(에러);
    //서버띄우는 코드 여기로 옮기기

    db = client.db('todoapp');
    
    app.listen('8080', function(){
      console.log('listening on 8080')
    });
  })


// 누군가가 / pet으로 방문하면,
// pet에 관련된 안내문을 띄워주자

app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.')
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.')
});

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html')
});

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html')
});

// 어떤사람이 / add 경로로 post 요청을 하면.. ??릃 해주세요

app.post('/add', function (요청, 응답) {
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
      var 총게시물갯수 = 결과.totalPost
  
      db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date }, function (에러, 결과) {
        db.collection('counter').updateOne({name:'게시물갯수'},{ $inc: {totalPost:1} },function(에러, 결과){
      if(에러){return console.log(에러)}
          응답.send('전송완료');
        })
      })
  
    })
  })

// /list로 GET요청으로 접속하면 HTML을 보여줌. 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 hmtl을 보여줌

app.get('/list', function(요청, 응답){

    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', {posts: 결과});
    });


app.delete('/delete', function(요청, 응답){
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id); //object자료 다루기 스킬
    //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post').deleteOne(요청.body,function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다'});
    })


})


});