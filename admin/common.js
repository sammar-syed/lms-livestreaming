


function login(name,pass,success,failed){
    var url = apiServer+'/login?name=' + name + '&password=' + pass;
    console.log('login', url)
        if (name != undefined && name != "" && pass != undefined && pass != "") {
          $.ajax({
            type: 'get',
            url: url,
            success: function (data) {
              console.log('request url', url)
              console.log('return', data)
              if (data != undefined && data.length > 0) {
                if(success){
                    success(data)
                }
              }
              else {
                alert('User does not exist.');
              }
            }
          })
        }
        else {
          alert("Username and password fields must be filled correctly.");
        }
}
function logout(userId,success,failed){

  updateActiveStatus(0,userId,success,failed);    
    
}
function updateActiveStatus(active,userId,success,failed){
	console.log(active);
  var u = apiServer + '/active/?active='+ (active? '1': '0') +'&userid=' + userId;
  console.log('updateActiveStatus--- ',userId)
  $.ajax({
      type: 'get',
      url: u,
      success: function (d) {
          if(success){
              success(d)
          }
      },
      errir: function(err){
        console.log("updateActiveStatus error=>"+JSON.stringify(err))
        if(failed){
          failed(err)
        }
      }
  });
}

function getUserInfoByUserId(userId,success,failed){
  var u = apiServer + '/users/?userid=' + userId;
  console.log('getUserInfo ',u)
  $.ajax({
      type: 'get',
      url: u,
      success: function (data) {
          if(success){
            console.log('userInfo',data)
              if(data && data.length>0){
                let userInfo = data[0];
                setUserInfo(userInfo);
                success(userInfo);
              }else{
                if(failed){
                  failed('null data');
                }
                
              }
              
          }
      },
      errir: function(err){
        console.log("updateActiveStatus error=>"+JSON.stringify(err))
        if(failed){
          failed(err)
        }
      }
  });
}

function onLoginSuccess(loginInfo){
  setUserInfo(loginInfo);
  if(!loginInfo){
    console.error('onLoginSuccess', 'loginInfo is null')
    return;
  }
  updateActiveStatus(1,loginInfo.userid,function(d){
        console.log('updateActiveStatus => d=',JSON.stringify(d))
        if (loginInfo.type == 0) {

             window.location.replace("student.html?user=" + loginInfo.userid + "&name=" + name);
        }
        else if (loginInfo.type == 1) {
            window.localStorage.setItem("cid" + loginInfo.userid, loginInfo.cid);
            window.location.replace("teacher.html?user=" + loginInfo.userid + "&name=" + name);
        }
        else {
            alert("Invalid credentials. Please use teacher or student account login");
        }
      },function(error){
        alert("error =>."+error);
  })
}

function onAdminLoginSuccess(loginInfo){
  setUserInfo(loginInfo);
  updateActiveStatus(1,loginInfo.userid,function(data){
        console.log('onAdminLoginSuccess  updateActiveStatus return => ',data)
        if (loginInfo.type == 1) {
          window.localStorage.setItem("cid" + loginInfo.userid, loginInfo.cid);
          window.location.replace("panel.html?user=" + loginInfo.userid + "&name=" + loginInfo.name);
        }
        else if (loginInfo.type == 3) {
          window.location.replace("superadmin.html?user=" + loginInfo.userid + "&name=" + loginInfo.name);
        }
        else {
          alert("Invalid credentials.");
        }
      },function(error){
        alert("error =>."+error);
  })
}



function setUserInfo(userInfo){
  window.__cacheInfo = userInfo;
  console.log('setUserInfo:',userInfo);
  if(window.localStorage){
    window.localStorage.setItem("user", JSON.stringify(userInfo));
	
		  window.localStorage.setItem("user-"+userInfo.type, userInfo.userid);
	
  }else{
    console.warn('common', 'web does not support localStoreage');
    window.localStorage={
      "user":JSON.stringify(userInfo)
    }
  }
  
}
function getUserInfo(){
  let info = undefined;
  if(window.__cacheInfo){
    return window.__cacheInfo;
  }
  console.log('window.localStorage',window.localStorage)
  if(window.localStorage){
    info = window.localStorage.getItem("user");

  }
  if(!info){
    return undefined;
  }
  window.__cacheInfo = JSON.parse(info);
  return window.__cacheInfo;
}

//获取url中的参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  console.log(window.location);
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  console.log(r);
  if (r != null) return unescape(r[2]); return null; //返回参数值
 }

 function goAdminHome(){
   window.location = 'admin/index.html';
 }
 function goHome(){
  window.location = 'index.html';
 }