var OV;
var session;
var publisher;

function joinSession(sName,uName,option) {
	if(!option){
		option = {}
	}
	console.log("sessionId="+sName+",uName="+uName)
	if(window.OADNative && window.OADNative.joinSession && option.useNativeSession()){
		console.log("OADNative.joinSession")
        window.OADNative.joinSession(OPENVIDU_SERVER_URL,sName,OPENVIDU_SERVER_SECRET,uName);
		return;
    }else{
		console.log("window.OADNative.joinSession is null ")
	}

	OV = new OpenVidu();
	session = OV.initSession();
	session.on('streamCreated', event => {
		console.warn('streamCreated', user)
		var subscriber = session.subscribe(event.stream, 'video-container');
		subscriber.on('videoElementCreated', event => {
			setVideoWidth();	
		});
	});

	function printJSON(obj,depth){
		
		for(let key in obj){
			let val = obj[key];
			let valType = typeof val;
			if(valType === 'string' || valType === 'number' || valType === 'boolean'){
				console.warn(key+":"+val);
			}else if(valType === 'null'){
				console.warn(key+": null");
			}else if(valType === 'array'){
				if(depth){
					console.warn(key+": array ..............");
					printJSON(val,depth -1);
				}
			}else if(valType === 'object'){
				if(depth){
					console.warn(key+": obj ..............");
					printJSON(val,depth -1);
				}
			}
		}
	}


	// On every asynchronous exception...
	session.on('exception', (exception) => {
		// console.warn(JSON.stringify(exception));
		console.warn('exception type = '+typeof exception);
		console.warn('excption',exception);
		// printJSON(exception,3);
	});

	session.on('streamDestroyed', event => {});
	console.log('sessionName = ',sName)
	getSesstionByName(sName).then(token => {
		console.log(" sessionId =>",token,uName)
		session.connect(token, { clientData: uName })
			.then(() => {
				console.log('session connection',arguments)
				publisher = OV.initPublisher('video-container', {
					audioSource: undefined, // The source of audio. If undefined default microphone
					videoSource: false, // The source of video. If undefined default webcam
					publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
					publishVideo: false,  	// Whether you want to start publishing with your video enabled or not
					resolution: '144x144',//'640x480',1280x720 ,160x144 , 1920x1080// The resolution of your video
					frameRate: 10,			// The frame rate of your video
					insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'	
					mirror: false       	// Whether to mirror your local video or not
				});
				publisher.on('videoElementCreated', function (event) {
					event.element['muted'] = true;
					setVideoWidth();
					publisher.publishAudio(false);
				});
				session.publish(publisher);
			},(error)=>{
				console.error("session connection error ,",error)
			})
			.catch(error => {
				console.log('There was an error connecting to the session:', error.code, error.message);
			});
	});
}

function speak(v){
	if(!publisher){
		console.warn('openvidu init failed');
		return;
	}
	console.log('speak:'+v);
	publisher.publishAudio(v);
}

function setVideoWidth() {
	$("#video-container > video").each(function () {
		$(this).css("width", "1px");
		$(this).css("height", "1px");
		if( user && user.type == 0){
			setVideoVolume((user.user_volume/10))
		}
	});
}

function setVideoVolume(v){
	$("#video-container > video").each(function () {
		$(this).prop("volume", v);
	});
	if(window.OADNative&&window.OADNative.setVideoVolume){
		window.OADNative.setVideoVolume(v)
	}
}

function changeStatus(v){
	var u = api_url + 'active/?active='+v+'&userid=' + user.userid;
	$.ajax({
	  type: 'get',
	  url: u,
	  success: function (d) {
	  }
	});
}

window.onbeforeunload = function (e) {
	if (session) session.disconnect();
	localStorage.removeItem("user");
	changeStatus(0);
	setTimeout(() => {
		changeStatus(1);
	}, 5000);
	e = e || window.event;
    if (e) {
        e.returnValue = 'Are you sure to leave?';
    }
    return 'Are you sure to leave?';
};

var OPENVIDU_SERVER_URL = kmsServer || "https://kms.kmbkk.com:4443";
var OPENVIDU_SERVER_SECRET = "MY_SECRET";
function getSesstionByName(mySessionId) {
	return createSession(mySessionId).then(sessionId => createToken(sessionId));
}

function createSession(sessionId) { 
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: OPENVIDU_SERVER_URL + "/api/sessions",
			data: JSON.stringify({ customSessionId: sessionId }),
			headers: {
				"Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
				"Content-Type": "application/json"
			},
			success: response => resolve(response.id),
			error: (error , textStatus, errorThrown) => {
				// console.error('readyState=',error.readyState);
				// console.error('status=',error.status);
				// console.error('statusText=',error.statusText);
				// console.error('responseText=',error.responseText);
				// console.error('textStatus=',textStatus);
				// console.error('errorThrown=',errorThrown);

				if (error.status === 409) {
					resolve(sessionId);
				} else {
					console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
					console.error('createSesionError=>',error)
					if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + OPENVIDU_SERVER_URL + '\"\n\nClick OK to navigate and accept it. ' +
						'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' + OPENVIDU_SERVER_URL + '"')) {
						location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
					}
				}
			}
		});
	});
}

function createToken(sessionId) {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: "POST",
			url: OPENVIDU_SERVER_URL + "/api/tokens",
			data: JSON.stringify({ session: sessionId }),
			headers: {
				"Authorization": "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
				"Content-Type": "application/json"
			},
			success: response => resolve(response.token),
			error: error => reject(error)
		});
	});
}
