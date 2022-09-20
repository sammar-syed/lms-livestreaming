

function getSocket(){
    // var url = 'https://socketio-whiteboard-zmx4.herokuapp.com/';
    // var url='http://localhost:3533';
    var url='https://api.kmbkk.com:3035';
    // var url='https://vidu.shuochentech.com';
    if(window.messageSocket){
      return window.messageSocket;
    }
    var socket;
    console.error('socket message =>')
    console.error('socket connect => ',url)
      socket = io.connect(url);
      socket.on('connect', function() {
        console.log('Client has connected to the server!');
		
      });
  
	let currentUser = getUserInfo();
	
      socket.on('drawing', function(d) {
        console.log('drawing',d);
        if(Array.isArray(d) == false){
          return;
        }
        
        let currentUser = getUserInfo();
        var eventObj = d[0];
        if(!eventObj || !currentUser){
          console.log("drawing nothing to do , because user is null, the user and eventObj is => user,obj",currentUser,eventObj)
          return;
        }
        if(currentUser.type != 0){
          console.log('not student account, nothing to do!');
          return;
        }
        if(!eventObj.cid|| eventObj.cid != currentUser.cid){
          console.log('cid not match')
          return;
        }
        if(eventObj.gevent){
          globalEventHandle(eventObj);
  
          return;
        }
        if(!eventObj.userId || eventObj.userId != currentUser.userid){
          console.log('userid not match')
          return;
        }
        if(eventObj.event){
          console.log('handle event',eventObj)
          switch(eventObj.event){
            case "kick":
              if(window.onKickEventHandle){
                window.onKickEventHandle(eventObj) // {userId:} 踢用户下线
              }else{
                console.log('onKickEventHandle is undefined, nothing to do')
              }
              break;
            case "schedule":
              if(window.onScheduleHandle){
                window.onScheduleHandle(eventObj)   // {action:'play|pause|stop'}  操作schedule中对应的audio对象，如播放、暂停、停止。
              }else{
                console.log('onScheduleHandle is undefined, nothing to do')
              }
              break;
            
            case "volume":
              if (window.onVolumeEventHandle) { 
                window.onVolumeEventHandle(eventObj);  // {value:newVolume} 音量改变处理事件。{type:change,value:newValue}
              }else{
                console.log('onVolumeEventHandle is undefined, nothing to do')
              }
              if(window.onChangeVolume){
                window.onChangeVolume(eventObj);
              }
              break;
          case "mirophone":
              if (window.onMicrohponeSetHandle) { 
                window.onMicrohponeSetHandle(eventObj);  // {value:newVolume} 音量改变处理事件。{type:change,value:newValue}
              }else{
                console.log('onMicrohponeSetHandle is undefined, nothing to do')
              }
              break;
            default:
              break;
          }
        }
        console.log('event handle end!')
        
      });
      socket.on('connect_error',function(error){
        console.error('socket error=>',error,url)
      });
	 
	  
      window.messageSocket = socket;
      return socket;
  }
  
  
  function globalEventHandle(eventObj){
    if(eventObj.gevent){
      console.log('gevent',eventObj.gevent)
      switch(eventObj.gevent){
        case "schedule":
          if(window.onScheduleHandle){
            window.onScheduleHandle(eventObj)   // {action:'play|pause|stop'}  操作schedule中对应的audio对象，如播放、暂停、停止。
          }else{
            console.log('onScheduleHandle is undefined, nothing to do')
          }
          break;
        case "bell":
          if(window.onBellHandle){
            window.onBellHandle(eventObj); // 参数中携带播放的url.以及相应action. {url:'',action:'play|pause|stop'}
          }else{
            console.log('onBellHandle is undefined, nothing to do')
          }
          break;
        case "audio_media":
          if(window.onPlayAudioMediaHandle){
            window.onPlayAudioMediaHandle(eventObj); // 参数中携带播放的url.以及相应action. {url:'',action:'play|pause|stop'}
          }else{
            console.log('onPlayAudioMediaHandle is undefined, nothing to do')
          }
              
              break;
    
        default:
          console.warn('globalEventHandle unkown event '+eventObj.gevent);
          break;
      }
    }
  }
  
  
  function dispatchMessage(event,data){
    let obtainMessage=data ||  {};
    obtainMessage.event = event;
    console.log('dispatchMessage',obtainMessage);
    let user = getUserInfo();
    if(!user){
      console.warn('dispatchMessage', 'user is null');
  
    }else{
      obtainMessage.senderId = user.userid;
      obtainMessage.cid = user.cid;
    }
    socket.emit("drawing", [obtainMessage]);
  }
  
  function dispatchGlobalMessage(event,data){
    let obtainMessage=data ||  {};
    obtainMessage.gevent = event;
    console.log('dispatchMessage',obtainMessage);
    let user = getUserInfo();
    if(!user){
      console.warn('dispatchMessage', 'user is null');
  
    }else{
      obtainMessage.senderId = user.userid;
      obtainMessage.cid = user.cid;
    }
    socket.emit("drawing", [obtainMessage]);
  }
  
  function dispatchVolumeChange(userId,volume){
    dispatchMessage('volume',{'userId':userId,'type':'change','value':volume});
  }
  
  function onChangeVolume(obj){
    if(window.bellAudio){
      window.bellAudio.volume = obj.value/10.0;
    }
    if(window.audioMedia){
      window.audioMedia.volume = obj.value/10.0;
    }
    
  }
  function dispatchKickUser(userId){
    dispathMessage('kick',{'userId':userId});
  }
  
  function dispatchBellCommand(url,action){
    let paction = action || 'stop';
    dispatchGlobalMessage('bell',{'url':url,'action':paction});
  }
  
  function onBellHandle(obj){
    console.log('onBellHandle', obj)
    if(!window.bellAudio){
      window.bellAudio = new Audio();
    }else{
      window.bellAudio.pause();
    }
    if(obj.action != 'play'){
      return;
    }
    window.bellAudio.src=obj.url;
    window.bellAudio.play();
  }
  
  
  function dispatchAudioMeidaCommand(url,action){
    let paction = action || 'play';
    dispatchGlobalMessage('audio_media',{'url':url,'action':paction});
  }
  
  function stopAllAudio(){
      if(window.bellAudio){
        window.bellAudio.pause();
      }
      if(window.audioMedia){
        window.audioMedia.pause();
      }
      
      console.log('audioCache;',window.audioCache);
      if(window.audioCache){
        for(let key in window.audioCache){
          console.log('cacheKey:',key)
          let itemAudio = window.audioCache[key];
          if(itemAudio){
            console.log('stop audio:'+key);
            itemAudio.pause();
          }else{
            console.log('stop audio error');
          }
        }  
      }
      
      console.log('playAudioFileLists:',window.playAudioFileLists);
      if(window.playAudioFileLists){
        for(let i=0;i<window.playAudioFileLists.length;i++){
          let itemEl = window.playAudioFileLists[i];
          if(itemEl.audio){
            itemEl.audio.pause();
          }
        }
      }
  }
  
  function onPlayAudioMediaHandle(obj){
    console.log('onPlayAudioMediaHandle', obj)
    if(!window.audioMedia){
      window.audioMedia = new Audio();
    }else{
      window.audioMedia.pause();
    }
    if(obj.action == 'stop'){
      stopAllAudio();
      return;
    }
    if(obj.action != 'play'){
      return;
    }
    if(!obj.url || obj.url.length<5){
      return;
    }
    if(window.audioMedia.src !== obj.url){
      window.audioMedia.src=obj.url;
    }
    window.audioMedia.play();
  }
  
  
  
  
  function dispatchScheduleAction(action){
    dispatchGlobalMessage('schedule',{'action':action});
  }
  
  function dispatchUpdateUserMirophoneState(userId,enable){
    dispatchMessage('mirophone',{'userId':userId,'enable':enable});
  }
  
  function onMicrohponeSetHandle(obj){
    
    console.log('onMicrohponeSetHandle',obj)
    speak(obj.enable);
  }
  
  