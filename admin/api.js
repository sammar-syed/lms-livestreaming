var express = require("express");
var app = express();
var fs = require('fs');
var formidable = require('formidable'),
    path = require('path');

app.use(express.static(__dirname));

var key = '/etc/letsencrypt/api.kmbkk.com/privkey.pem';
var crt = '/etc/letsencrypt/api.kmbkk.com/fullchain.pem';
var fileName = 'apiServer.js';
if(process.env.DEVELOP){
    // key = path.join(__dirname,'/cert/vidu.shuochentech.com.key');
    // crt = path.join(__dirname,'/cert/vidu.shuochentech.com.cert');
    key = path.join(__dirname,'/cert/http.public.key.pem');
    crt = path.join(__dirname,'/cert/http.cert.pem');
    // fs.writeFile(fileName,'var apiServer="https://localhost:3000"',function(error){
    //     if (error) {
    //         console.log('写=>'+fileName+' 失败')
    //       } else {
    //         console.log('写=>'+fileName+' 成功了')
    //       }
    // })

}else{
    // fs.writeFile(fileName,'var apiServer="https://kurento.11x1.com:3000"',function(error){
    //     if (error) {
    //         console.log('写=>'+fileName+' 失败')
    //       } else {
    //         console.log('写=>'+fileName+' 成功了')
    //       }
    // })
}
console.log('key', key);
console.log('crt', crt);
var server = require("https").createServer({
  key: fs.readFileSync(key),
  cert: fs.readFileSync(crt)
},app);
var io = require("socket.io")(server);
users = [];
connections = [];

var listenPort = process.env.PORT || 3000;
server.listen(listenPort);
console.log("Server running...  and listen port is "+listenPort);


//Configurations
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100,
  host     : process.env.DB_SERVER || '122.155.180.152',
  port     : process.env.DB_PORT || 3306,
  user     : process.env.DB_USER || 'testkmbkk',
  password : process.env.DB_PASSWORD || 'Zd4Ywdasdf324bsLdHdP6W4',
  database : process.env.DB_DATABASE || 'testkmbkk'
});

app.all('/*', function(req, res, next) {
    // console.log('app all')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });



//Frontend APIs

app.get("/login",function(req,res){
    console.log('The user is: ', req.query.name,getHash(req.query.password));
    var ret = pool.query('SELECT * from users where name="'+req.query.name+'" and password ="'+getHash(req.query.password)+'";', function (error, results, fields) {
        console.log('login info', results)
        if (error) res.json(error);
        else res.json(results);
    });
});


function getPublickGroupId(success,failed){
    pool.query('select * from users where name="PUBLICGROUP" and cid=0',function(error2,results2,filds2){
        if(error2){
            failed({
                error:"select PUBLICGROUP error"
            })
            return;
        }
        var groupInfo={}
        if(results2.length>0){
           groupInfo = JSON.parse(JSON.stringify(results2[0]))
        }
         
        if(groupInfo.id == undefined){
            
            generateUserId(function(newNum){
                pool.query('insert into users(userid,name,password,type,cid) values('+newNum+',"PUBLICGROUP","'+getHash('111111')+'",2,0);', function (error3, results3, fields3) {
                    if(error3){
                        failed({
                            error:"insert PUBLICGROUP error"
                        })
                        return;
                    }
                    // result3=> {"fieldCount":0,"affectedRows":1,"insertId":334,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
                    var insertInfo = JSON.parse(JSON.stringify(results3));
                    success(insertInfo.insertId);

                });
            },function(error){
                failed(error);
            })

            return;
        }

        success(groupInfo.id)

    })
}

String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g,"");
};
app.get("/autologin",function(req,res){
    var mac = req.query.mac.trim();
    console.log('The user is:', mac);
    var ret = pool.query('SELECT * from users where name="'+mac+'";', function (error, results, fields) {
        console.log('login info', results)
        console.log('autologin, error=>',error)
        if (!error && results.length>0){
            var userInfo = JSON.parse(JSON.stringify(results))
            activeUser(userInfo[0].userid,1,function(){
                res.json(results);
            },function(){
                res.json(results);
            });
            
            
            return
        } 

        getPublickGroupId(function(groupId){
            generateUserId(function(newNum){
                pool.query('insert into users(userid,name,password,type,cid,ip) values('+newNum+',"'+mac+'","'+getHash('111111')+'",'+0+','+groupId+',"'+req.query.ip+'");', function (error3, results3, fields3) {
                        
                    console.log('insert results => ',results3)
                    if (error3){
                        res.json(error3);
                    } 
                    var insertInfo = JSON.parse(JSON.stringify(results3))
                    var sql = 'select * from users where id='+insertInfo.insertId+';'
                    console.log(sql)
                    pool.query(sql,function(error4,results4,fileds4){

                        if(error4){
                            res.json(error4)
                        }else{
                            res.json(results4)
                        }
                    })
                });       
            },function(errorc){
                res.json(errorc)
            })
        },function(error){
            res.json(error)
        });
        
    });
});


/**
 * 读取路径信息
 * @param {string} path 路径
 */
 function getStat(path){
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats);
            }
        })
    })
}
 
/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir){
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if(err){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}
app.get('/tmp_uploads/*', function (req, res, next) {

     var fileRoot= path.join(__dirname, 'tmp_uploads');
     var prefix = "tmp_uploads/";
     var urlAddress = req.originalUrl;
     var fileName = urlAddress.substring(urlAddress.indexOf(prefix)+prefix.length);
    　//第一种方式
      //var f="F:/ftproot/NW.js.docx";
      //var f="f:/ftproot/我是中文的语言.txt"
      ////var f = req.params[0];
      //f = path.resolve(f);
      //console.log('Download file: %s', f);
      //res.download(f);
     
      //第二种方式
      var filePath=fileRoot+"/"+fileName;
      fs.access(filePath,fs.F_OK,(error)=>{
          if(error){
            res.json(404,{msg:'file do not found'});
            return;
          }
          var f = fs.createReadStream(filePath);
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-Disposition': 'attachment; filename='+fileName
        });
        f.pipe(res);

      })
      
    });
/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir){
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if(!status){
        mkdirStatus = await mkdir(dir);
    }
    console.log('dirExists return,mkdirStatus=');
    console.log(mkdirStatus);
    return mkdirStatus;
}
async function saveFile(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'tmp_uploads');
    console.log('dirExists before path=>'+form.uploadDir);
    await dirExists(form.uploadDir);
    console.log('dirExists after')
    try {
        form.on('error', function (err) {
            console.log('Error occurred during processing - ' + err);
        });
        form.on('end', function () {
            console.log('All the request fields have been processed.');
        });
        form.parse(req, function (err, fields, files) {
            console.log("save file ="+JSON.stringify(files));
            res.status(200).json(files);
        });
    } catch (error) {
        console.log("upload-file error ,"+JSON.stringify(error))
    }
    
}

app.post('/upload-file', (req, res) => {
    console.log("upload-file")
    saveFile(req,res);
    
    
});

app.get("/users/",function(req,res){
    let where=undefined;
    let warray=[]
    if(req.query.cid){
        warray.push('cid='+req.query.cid);
    }
    if(req.query.userid){
        warray.push('userid='+req.query.userid);
    }
    if(warray.length>0){
        where='where '+ warray.join(' and ')
    }
    console.log('users where = '+where)
    let sql = 'SELECT * from users ';
    if(where){
        sql = sql + where;
    }
    sql= sql + ' order by sort_id asc;'
    console.log(sql)
    pool.query(sql, function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/myCont/",function(req,res){
    pool.query('SELECT a.*,ifnull(b.fav_userid,0) as fav from users a LEFT outer JOIN fav_users b on a.userid = b.fav_userid and b.userid = '+req.query.userid+' where a.cid ='+req.query.cid+' order by a.sort_id asc;', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});



app.get("/sort/",function(req,res){
    pool.query('update users set sort_id = '+req.query.sort_id+' where userid = '+req.query.userid+';', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/update_vol/",function(req,res){
    pool.query('update users set user_volume = '+req.query.user_volume+' where userid = '+req.query.userid+';', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/change_group/",function(req,res){
    pool.query('update users set cid = '+req.query.cid+' where userid = '+req.query.userid+';', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});




app.get("/auis/",function(req,res){
    pool.query('SELECT userid from users;', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/customerList/",function(req,res){
    pool.query('SELECT * from users where type = 2 ORDER BY userid ASC;', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/active/",function(req,res){
    console.log('The active is: ', req.query.userid +'user is :'+req.query.active);
    activeUser(req.query.userid,req.query.active,function(results){
        res.json(results);
    },function(error){
        res.json(error);
    })
});

function activeSocketUser(userId,active){
  
    //var user = localStorage.getItem('user');
   
 
        
    console.log(userId + '-----status' + active);
        pool.query('update users set active = '+active+' where userid='+userId+';');
    
   
    return true;
    
}

function activeUser(userId,active,success,faild){
    console.log("activeUser userId="+userId+",active="+active);
    pool.query('update users set active = '+active+' where userid='+userId+';', function (error, results, fields) {
        if (error){
            if(faild){
                faild(error)
            }
        }
        else{
            if(success){
                success(results)
            }
        }
      });
}


//{{ deprecated ...............

    app.get("/saveFile/",function(req,res){
        pool.query('insert into audio_files(file_name,file_path,play_time,user_id) values("'+req.query.file_name+'","'+req.query.file_path+'","'+req.query.play_time+'",'+req.query.user_id+');', function (error, results, fields) {
            if (error) res.json(error);
            else res.json(results);
        });
    });
    
    app.get("/getFiles/",function(req,res){
        console.log("getFiles cid=>"+req.query.user_id)
        pool.query('select * from audio_files where user_id = ? and is_deleted = 0 and is_played = 0',[req.query.user_id], function (error, results, fields) {
            if (error) res.json(error);
            else res.json(results);
        });
    });
    
    app.get("/updateFile/",function(req,res){
        pool.query('update audio_files set is_played = 1 where file_id = ?',[req.query.file_id], function (error, results, fields) {
            if (error) res.json(error);
            else res.json(results);
        });
    });
    
    app.get("/deleteFile/",function(req,res){

        pool.query('update audio_files set is_deleted = 1 where file_id = ?',[req.query.file_id], function (error, results, fields) {
            if (error) res.json(error);
            else res.json(results);
        });
    });
    
//}}




app.get("/createSchedule/",function(req,res){
    pool.query('insert into audio_files(file_name,file_path,play_time,user_id) values("'+req.query.file_name+'","'+req.query.file_path+'","'+req.query.play_time+'",'+req.query.user_id+');', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/getSchedules/",function(req,res){
    console.log("getSchedule cid=>"+req.query.user_id)
	console.log('getSchedules');
    pool.query('select * from audio_files where user_id = ? and is_deleted = 0 and is_played = 0',[req.query.user_id], function (error, results, fields) {
        
        // console.log(JSON.stringify(results))
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/updateSchedule/",function(req,res){
    pool.query('update audio_files set is_played = 1 where file_id = ?',[req.query.file_id], function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/deleteSchedule/",function(req,res){
    pool.query('update audio_files set is_deleted = 1 where file_id = ?',[req.query.file_id], function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});






app.get("/deleteMediaInfo/",function(req,res){

    pool.query('delete from media_files where file_id = ?',[req.query.file_id], function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });

    pool.query('select * from media_files where file_id = ?',[req.query.file_id], function (error, results, fields) {
        if (error){
            console.log('select media_files data error:'+JSON.stringify(error));
            return;
        }
        
        var jsonData = JSON.parse(JSON.stringify(results))
        console.log('jsonData', jsonData)
        var filePath = jsonData[0].file_path;
        var fileRoot= path.join(__dirname, 'tmp_uploads');
        var obsolutePath = fileRoot+'/'+filePath;
        fs.rm(obsolutePath,function(error, results, fields){
            if(error){
                console.log('delete file error!'+obsolutePath);
            }
        })

        pool.query('delete from  audio_files where file_id = "'+filePath+'"', function (error, results, fields) {
            if (error) {
                console.log('delete audio_files data error:'+JSON.stringify(error));
                return;
            }
            
        });

    });
});




app.get("/saveMediaInfo/", function (req, res) {
    pool.query('insert into media_files(file_name,file_path,user_id) values("' + req.query.file_name + '","' + req.query.file_path + '",' + req.query.user_id + ');', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/getMediaList/", function (req, res) {
    console.log("getMediaFiles cid=>" + req.query.user_id+",search="+req.query.search);
    sql = 'select * from media_files where is_deleted = 0 and is_played = 0 and user_id = '+req.query.user_id;
    // if(res.search && res.search.length>0){
    //     sql = sql + ' and file_name like "%'+req.query.search+'%"';
    // }
    if (req.query.search && req.query.search.length > 0) {
        sql = sql + ' and file_name like "%' + req.query.search + '%"';
    }
    console.log('getMediaFiles sql='+sql);
    pool.query(sql, [], function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});


app.get("/updateMediaInfo/", function (req, res) {
    pool.query('update media_files set is_played = 1 where file_id = ?', [req.query.file_id], function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/deleteMediaFile/", function (req, res) {
    pool.query('update media_files set is_deleted = 1 where file_id = ?', [req.query.file_id], function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/setting/",function(req,res){
    console.log('The setting is: ', req.query.dnd);
    pool.query('update users set disturb = '+req.query.dnd+', autoanswer ='+req.query.ans+' where userid='+req.query.userid+';', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/create/",function(req,res){
    console.log('Create: ', req.query.ip);
    // pool.query('insert into users(userid,name,password,type,cid,ip) values('+req.query.num+',"'+req.query.name+'","'+getHash(req.query.pass)+'",'+req.query.type+','+req.query.cid+',"'+req.query.ip+'");', function (error, results, fields) {
    //     if (error) res.json(error);
    //     else res.json(results);
    // });
    

    generateUserId(function(newNum){
        let insertSql = 'insert into users(userid,name,password,type,cid,ip) values('+newNum+',"'+req.query.name+'","'+getHash(req.query.pass)+'",'+req.query.type+','+req.query.cid+',"'+req.query.ip+'");';
        console.log('insert user sql:'+insertSql)
        pool.query(insertSql, function (error, results, fields) {
            if (error) res.json(error);
            else {
                if(results){
                    res.json(results);
                }else{
                    console.error('insert users error,sql info=> '+insertSql)
                    res.json({});
                }
                
            }
        });
    },function(error){
        res.json(error)
    })
});

function generateUserId(success,failed){
    pool.query('select min(userid) as userid from users;',function(error1,results,fields){
        if(error1){
            if(failed){
                failed(error1)
            }
            return;
        }
        console.log('min results1 =>',results)
        var jsonData = JSON.parse(JSON.stringify(results))
        console.log('jsonData', jsonData)
        var newNum = jsonData[0].userid - 1;
        if(newNum<1000){
            failed({
                error:'create user error,user id has empty'
            })
            return;
        }
        if(success){
            success(newNum)
        }
        
    })
}

app.get("/chCreate/",function(req,res){
    pool.query('insert into channels(cid,chName,chLink) values('+req.query.cid+',"'+req.query.chName+'","'+req.query.chLink+'");', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/getChannels/",function(req,res){
    pool.query('select * from channels where cid='+req.query.cid, function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/delChannels/",function(req,res){
    pool.query('delete from channels where id='+req.query.id, function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/favUsers/",function(req,res){
    pool.query('SELECT b.* from fav_users a JOIN users b on a.fav_userid = b.userid where a.userid = '+req.query.userid+' order by b.sort_id asc;', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
      });
});

app.get("/markFav/",function(req,res){
    pool.query('insert into fav_users(userid,fav_userid) values('+req.query.userid+','+req.query.fav_userid+');', function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/delFav/",function(req,res){
    pool.query('delete from fav_users where userid =' +req.query.userid +' and fav_userid =' + req.query.fav_userid, function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

app.get("/createcst/",function(req,res){
    console.log('Create: ', req.query.name);
    generateUserId(function(newNum){
        pool.query('insert into users(userid,name,password,type,cid) values('+newNum+',"'+req.query.name+'","'+getHash(123)+'",2,0);', function (error, results, fields) {
            if (error) res.json(error);
            else res.json(results);
        });
    },function(error){
        res.json(error)
    })
});

app.get("/delUser/",function(req,res){
    console.log('delUser: ', req.query.userid);
    pool.query('delete from users where userid ='+req.query.userid, function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});
app.get("/kickUser/",function(req,res){
    console.log('delUser: ', req.query.userid);
    // pool.query('delete from users where userid ='+req.query.userid, function (error, results, fields) {
    //     if (error) res.json(error);
    //     else res.json(results);
    // });

});
app.get("/change/",function(req,res){
    
    let sql = 'update users set password = "'+getHash(req.query.pass)+'" where name="'+req.query.name+'" and (password="'+getHash(req.query.opass)+'" or password="'+req.query.opass+'");';
    console.log('Change password: ', sql);
    pool.query(sql, function (error, results, fields) {
        if (error) res.json(error);
        else res.json(results);
    });
});

function getHash(p){
    var hash = 0;
    if (p.length == 0) return hash;
    for (i = 0; i < p.length; i++) {
        char = p.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash ; // Convert to 32bit integer
    }
    return hash.toString().slice(1,15);
}

//End Frontend APIs


//Socket Server Methods
// server
let uid = 0;
var socketio_session = new Array();
var stu_user = [];


io.sockets.on("connection", function(socket){
	
	socket.on("getuserId", (user_id) => {
		
		uid = user_id;
		activeSocketUser(user_id,1);
	

	});
    var index = connections.findIndex(function(o){
        return o.id === socket.id;
    })
    if (index == -1) {
        connections.push(socket);
    }
    console.log("New user connected..."+ uid);

    
    // Success!  Now listen to messages to be received
    socket.on('call',function(data){ 
        console.log("Call from " + data[0].caller);
        io.sockets.emit("call",data);
    });

    socket.on('accept',function(data){ 
        console.log("Call accepted by " + data[0].acceptor);
        io.sockets.emit("accept",data);
    });

    socket.on('reject',function(data){ 
        console.log("Call rejected by " + data[0].rejector);
        io.sockets.emit("reject",data);
    });

    socket.on('cancel',function(data){ 
        console.log("Call cancelled by " + data[0].canceller);
        io.sockets.emit("cancel",data);
    });

    socket.on('remove',function(data){ 
        console.log("Data remove: " + data[0].recipient);
        io.sockets.emit("remove",data);
    });

    socket.on('logout',function(data){ 
        console.log("Data logout: " + data[0].user);
        io.sockets.emit("logout",data);
    });

    socket.on('closeSession',function(data){ 
        console.log("Data  closeSession: " + data[0].user);
        io.sockets.emit("closeSession",data);
    });

    socket.on('setting',function(data){ 
        console.log("Data  setting: " + data[0].user);
        io.sockets.emit("setting",data);
    });

    socket.on('share',function(data){ 
        console.log("Data  setting: " + data[0].msg);
        io.sockets.emit("share",data);
    });

	
    socket.on('disconnect',function(reason){
		
     	socket.emit("changeStatus", "0");
		var index = connections.findIndex(function(o){
			return o.id === socket.id;
		});
        if (index !== -1) connections.splice(index, 1);
		 activeSocketUser(uid,0);
          console.log('A user'+ uid +'is disconnected --- '+ connections.length);
		
    });
	
     socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
})

