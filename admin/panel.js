var user;
var contacts = "";
var name;
let audioName = "";
var cid;
var url = apiServer;
var loginName; //帐户名
var loginPassword; //帐户登录密码
var searchText = ""; //输入探索内容
var audiofileList = []; //media文件列表
var audiofileCache = {}; //media文件缓存区
var scheduledList = []; //scheduled文件列表
var selectFileId = ""; //选中预设文件id
var currentPlayFileId = -1; //MEDIA列表中当前播放文件id
var currentPlayScheduledFileId = -1; //SCHEDULED列表中当前播放文件id
var isStartBellSelect = false;
var isEndBellSelect = false;
var socket = getSocket();
function onKickEventHandle() {
  logout(user.userId, function () {
    console.log("logout...... ");
    window.location.replace("index.html");
  });
}
function resizeList() {
  console.log("resize!");
  document.querySelector("#student-list").style = `max-height: calc(${
    document.querySelector("html").clientHeight
  }px - 30rem); overflow-y: auto;`;

  document.querySelector("#media-list").style = `max-height: calc(${
    document.querySelector("html").clientHeight
  }px - 36rem); overflow-y: auto;`;

  document.querySelector("#play-list").style = `max-height: calc(${
    document.querySelector("html").clientHeight
  }px - 56rem); overflow-y: auto;`;

  if (document.querySelector("html").clientWidth < 1200) {
    document.querySelector("#student-list").style = `max-height: calc(${
      (document.querySelector("html").clientHeight - 350) / 2
    }px); min-height:30rem; overflow-y: auto;`;

    document.querySelector("#media-list").style = `max-height: calc(${
      (document.querySelector("html").clientHeight - 450) / 2
    }px); min-height:25rem; overflow-y: auto;`;

    document.querySelector(
      "#play-list"
    ).style = `height:18rem; overflow-y: auto;`;
  }

  // if (document.querySelector("html").clientWidth < 430) {
  //   document.querySelector("#student-list").style = `max-height: calc(${
  //     document.querySelector("html").clientHeight - 300
  //   }px); overflow-y: auto;`;

  //   document.querySelector("#media-list").style = `max-height: calc(${
  //     document.querySelector("html").clientHeight - 360
  //   }px); overflow-y: auto;`;
  // }
}
window.addEventListener("resize", (e) => {
  resizeList();
});
window.addEventListener("load", (e) => {
  resizeList();
});
$(function () {
  $("#student-list").sortable({
    update: function (event, ui) {
      $("#student-list div").each(function (index) {
        var id = $(this).text().split(" - ")[1].split("Status")[0];
        var u = url + "/sort/?sort_id=" + index + "&userid=" + id;
        $.ajax({
          type: "get",
          url: u,
          success: function (d) {
            console.log("Success");
          },
        });
      });
    },
  });

  $("#student-list").disableSelection();
});

$(document).ready(function () {
  setInterval(function () {
    fetchContacts(3);
    console.log("fetchContacts");
  }, 5000);
  let uid = localStorage.getItem("user-1");
  if (uid) {
    console.log("uid is" + uid);
    getUserInfoByUserId(
      uid,
      function () {},
      function () {
        location.replace("index.html");
      }
    );
  }
  function updateUserInfo(userInfo) {
    if (!userInfo) {
      //goAdminHome();
      return;
    }
    window.user = userInfo;
    console.log("userInfo => ", userInfo);
    // var user = userInfo.userid;
    // loginName = userInfo.name;
    loginPassword = userInfo.password;
    $("#userid").val(userInfo.userid);
    $("#loginUserName").text(userInfo.name); //显示登录用户名
    $("#username").append(userInfo.name);
    $("#number").append(userInfo.userid);
    joinSession("group-" + userInfo.cid, "teacher-" + userInfo.userid);

    fetchContacts(userInfo.cid);

    getMediaList();
    getSchedules();
  }
  // 修改密码
  $("#modify").click(function () {
    console.log("修改密码！");
  });
  $("#logout").click(function () {
    console.log("帐户退出！");
    changeStatus(0);
  });
  $("#stopAudioPlay").click(function () {
    let userInfo = getUserInfo();
    if (!userInfo) {
      goAdminHome();
    }
    socket.emit("drawing", [
      { event: "audio", msg: "kick user", cid: userInfo.cid, action: "stop" },
    ]);
  });
  function changeStatus(v) {
    var u = url + "/active/?active=" + v + "&userid=" + user.userid;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        window.location.replace("index.html");
      },
    });
  }

  $("#refreshContacts").click(function () {
    if (!user) {
      console.error("user is null");
      return;
    }
    fetchContacts(user.cid);
  });

  function fetchContacts(cid) {
    let userInfo = getUserInfo();
    if (!userInfo) {
      goAdminHome();
    }
    contacts = "";
    var u = url + "/users/?cid=" + userInfo.cid;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        if (d.length > 0)
          for (var u = 0; u < d.length; u++) {
            var nm = d[u].name.toUpperCase();
            var act =
              d[u].active == 1
                ? " Online"
                : d[u].active == 2
                ? " Busy"
                : " Offline";
            var id = d[u].userid;
            var hidden = d[u].type != 0 ? "hidden" : "";
            contacts +=
              '<div id="cnt-' +
              id +
              '" ' +
              hidden +
              ' class="list-item"><button><i class="fas fa-ellipsis-v"></i></button><p><span><b>' +
              nm +
              " - " +
              id +
              '</b></span><span> status: <span class="status-text">' +
              act +
              '</span></span></p><div class="operation"><input type="range" class="volume" id="vol-' +
              id +
              '" name="vol" min="0" max="10" value="' +
              d[u].user_volume +
              '"><button class="microphone" id="mike-' +
              id +
              '"><i id="mikei-' +
              id +
              '" class="fas fa-microphone"></i></button><span class="status-symbol ' +
              act +
              '"><i class="fas fa-circle"></i></span>' +
              "</div></div>";
          }
        $("#student-list").html(contacts);
        resizeList();
        // 音量
        $(".volume").on("change", function (event) {
          console.log("音量 event => ", event);
          var id = $(this).attr("id").split("-")[1];
          let volume = $("#" + "vol-" + id + "").val();
          console.log("音量  => ", volume);
          var u = url + "/update_vol/?user_volume=" + volume + "&userid=" + id;
          $.ajax({
            type: "get",
            url: u,
            success: function (d) {
              // socket.emit("drawing", [{ "msg": "volume", "volume": volume, "userid": id }]);
              dispatchVolumeChange(id, volume);
            },
          });
        });
        // 麦克
        $(".microphone").on("click", function (event) {
          console.log("点击麦克 event => ", event);

          var mikeId = $(this).attr("id");
          console.log("点击麦克 mikeId => ", mikeId);
          var status = ""; // 状态
          if (!$("#" + mikeId).hasClass("active")) status = "active";
          else status = "inactive";
          var id = $(this).attr("id").split("-")[1];
          console.log("麦克 id, status => ", id, status);
          dispatchUpdateUserMirophoneState(id, status == "active");
        });
      },
    });
  }

  $(document).on("input change", ".user-vol", function () {
    var i = $(this).attr("id");
    var id = i.split("-")[1];
    var volume = $(this).val();
    var u = url + "/update_vol/?user_volume=" + volume + "&userid=" + id;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        socket.emit("drawing", [{ msg: "volume", volume: volume, userid: id }]);
      },
    });
  });

  function uploadFiles(formData) {
    $.ajax({
      url: url + "/upload-file",
      method: "post",
      data: formData,
      processData: false,
      contentType: false,
      xhr: function () {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (event) {});
        return xhr;
      },
    })
      .done(handleSuccess)
      .fail(function (xhr, status) {
        alert(status);
      });
  }

  //创建预播文件
  function createScheduled(path, name, time) {
    console.log("createScheduled name=", name, time);
    let userInfo = getUserInfo();
    if (!userInfo) {
      //goAdminHome();
    }
    var u =
      url +
      "/createSchedule/?file_name=" +
      name +
      "&file_path=" +
      path +
      "&play_time=" +
      time +
      "&user_id=" +
      userInfo.cid;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        console.log("will call getSchedules ", d);
        $("#popup-time").hide();
        getSchedules();
      },
    });
  }

  // 插入音频文件
  function saveMediaInfo(path, name, time) {
    console.log("saveMediaFile name=", path, name, time);
    let userInfo = getUserInfo();
    if (!userInfo) {
      goAdminHome();
    }
    var u =
      url +
      "/saveMediaInfo/?file_name=" +
      name +
      "&file_path=" +
      path +
      "&play_time=" +
      time +
      "&user_id=" +
      userInfo.cid;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        console.log("will call getMediaList ", d);
        $("#popup-mp3").hide();
        $("#popup-radio").hide();
        getMediaList();
      },
    });
  }

  //默认加载英语
  if (sessionStorage.getItem("langs") === "th") {
    loadProperties("th");
  } else {
    loadProperties("en");
  }
  //默认状态
  $("#end").addClass("active");
  $("#end").attr("disabled", true);

  // $("#stop").attr('disabled', true);
  $("#previous").attr("disabled", true);
  $("#next").attr("disabled", true);

  //播放顺序，默认为顺序播放，顺序order|随机random
  if (sessionStorage.getItem("order") === "random") {
    $("#order").hide();
    $("#random").show();
  } else {
    $("#random").hide();
    $("#order").show();
  }

  // MEDIA CENTER
  function getMediaList(userInfo) {
    if (!userInfo) {
      userInfo = window.user;
    }
    if (!userInfo) {
      console.error("getMediaList error user is null");
      return;
    }
    var u =
      url + "/getMediaList/?user_id=" + userInfo.cid + "&search=" + searchText;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        console.log("获取 MEDIA CENTER result=>", d);
        $("#media-list").hide();
        $("#media-list").html("");
        audioBuffer = [];
        if (d.length > 0) {
          audiofileList = d;
          var src = `${fileServer}/`;

          for (var i = 0; i < d.length; i++) {
            // console.log('getMediaList() d[i] => ', d[i]);
            var fid = d[i].file_id;
            audiofileCache[fid] = d[i];
            var audioName = d[i].file_name;
            var audiofile = d[i].file_path;
            var url = audiofile;

            // console.log('getMediaList() audiofile => ', audiofile);
            if (audiofile.indexOf("http") != 0) {
              url = src + audiofile;
            }
            audioBuffer.push(url);
            // console.log('audiofile url=>'+url)
            var date = new Date(d[i].play_time);

            date = date.toLocaleString();
            var top = i * 60 + 40;
            var divId =
              Date.parse(new Date()) + Math.floor(Math.random() * 1000 + 1);
            var item = `<div class="list-item"  id=${divId}>
                   <span class="track-name">${audioName}</span>
                   <audio id="mediaplayer-${fid}" controls="controls" src="${url}">
                   </audio>
                   <div class="operation">
                      <button class="play" onclick="showData('${audioName}')"  id="mediaplay-${fid}" style="border-radius: 50%; color: rgb(47, 255, 158)">
                        <i class="fas fa-play"></i>
                      </button>
                      <button class="stop" id="mediastop-${fid}" style="border-radius: 50%; color: rgb(0, 0, 255)"">
                        <i class="fas fa-stop"></i>
                      </button>
                      <button class="delete" id="mediadelete-${fid}" style="border-radius: 50%; color: rgb(255, 0, 0)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                      <button class="set-time" id="mediaset-${fid}">
                        <i class="far fa-edit"></i>
                      </button>
                   </div>
                  </div>`;
            $("#media-list").append(item);
          }
        }
        $("#media-list").show();
        resizeList();
        //播放
        $(".play").on("click", function () {
          // var all = $(".stop")
          //   .map(function () {
          //     this.hidden = true;
          //   })
          //   .get();

          // console.log("this is about to close", all.join());

          for (var i = 80; i < 120; i++) {
            $("#" + "mediaplay-" + i + "").show();
            $("#" + "mediastop-" + i + "").hide();
          }

          var id = $(this).attr("id").split("-")[1];
          console.log("media play id => ", id);
          var audio;
          //获取之前播放文件，若是播放状态，停止播放
          audio = $("#" + "mediaplayer-" + currentPlayFileId + "").get(0);
          console.log("media stop audio => ", audio);
          if (audio && !audio.paused) {
            audio.pause();
            // dispatchAudioMeidaCommand(audio.src, 'stop');
            $("#" + "mediastop-" + currentPlayFileId + "").hide();
            $("#" + "mediaplay-" + currentPlayFileId + "").show();
          }

          currentPlayFileId = id;

          $("#" + "mediaplay-" + id + "").hide();
          $("#" + "mediastop-" + id + "").show();
          audio = $("#" + "mediaplayer-" + id + "").get(0);
          // 监听播放完成事件
          audio.addEventListener(
            "ended",
            function () {
              audioEnded("media", id);
            },
            false
          );
          audio.volume = 0;
          console.log("media play audio => ", audio);
          // audio.play();
          dispatchAudioMeidaCommand(audio.src, "play");
        });
        //暂停
        $(".stop").on("click", function () {
          var id = $(this).attr("id").split("-")[1];
          console.log("media stop id => ", id);
          $("#" + "mediastop-" + id + "").hide();

          $("#" + "mediaplay-" + id + "").show();
          var audio = $("#" + "mediaplayer-" + id + "").get(0);
          // audio.pause();
          dispatchAudioMeidaCommand(audio.src, "stop");
        });
        //预设定播放
        $(".set-time").on("click", function () {
          console.log("$(this)", $(this));
          selectFileId = $(this).attr("id").split("-")[1];
          console.log("media set-time selectFileId => ", selectFileId);
        });
      },
    });
  }
  //播放完成
  function audioEnded(fileType, id) {
    console.log("播放完成 id => ", id);
    var audio = $("#" + fileType + "player-" + id + "").get(0);
    setTimeout(() => {
      //监听播放完成事件
      console.log("media play audio.paused => ", audio.paused);
      if (audio.paused) {
        $("#" + fileType + "stop-" + id + "").hide();
        $("#" + fileType + "play-" + id + "").show();
      }
    }, 50);
  }
  // SCHEDULED PLAY LIST
  function getSchedules(userInfo) {
    if (!userInfo) {
      userInfo = window.user;
    }
    if (!userInfo) {
      console.error("getSchedules error user is null");
      return;
    }

    //getUserInfoByUserId(uid,function(){ },function(){})
    var u = url + "/getSchedules/?user_id=" + userInfo.cid;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        console.log("getSchedules result=>", d);
        $("#play-list").hide();
        $("#play-list").html("");
        if (d.length > 0) {
          scheduledList = d;
          var src = `${fileServer}/`;

          for (var i = 0; i < d.length; i++) {
            console.log("getSchedules() d[i] => ", d[i]);
            var fid = d[i].file_id;
            var audiofile = d[i].file_path;
            var url = audiofile;
            // console.log('getSchedules() audiofile => ', audiofile);
            if (audiofile.indexOf("http") != 0) {
              url = src + audiofile;
            }
            // console.log('audiofile url=>'+url)
            var play_time = new Date(d[i].play_time);

            play_time = play_time.toLocaleString();
            var dataTmp = play_time.split(" ");
            var data = dataTmp[0];
            var time = dataTmp[1];
            // console.log('play time => ', dataTmp);
            var top = i * 60 + 40;
            var divId =
              Date.parse(new Date()) + Math.floor(Math.random() * 1000 + 1);
            var item = `<div class="list-item"  id=${divId}>
                   <span class="track-name"  >${audiofile}</span>
                   <audio id="scheduledplayer-${fid}" controls="controls" src="${url}">
                   </audio>
                   <p class="track-date">
                    <span>${data}</span>
                    <span>${time}</span>
                   </p>
                   <div class="operation">
                      <button class="play-scheduled" id="scheduledplay-${fid}" style="border-radius: 50%; color: rgb(47, 255, 158)">
                        <i class="fas fa-play"></i>
                      </button>
                      <button class="stop-scheduled" id="scheduledstop-${fid}" style="border-radius: 50%; color: rgb(0, 0, 255)"">
                        <i class="fas fa-stop"></i>
                      </button>
                      <button class="delete-scheduled" id="scheduleddelete-${fid}" style="border-radius: 50%; color: rgb(255, 0, 0)">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                   </div>
                  </div>`;
            $("#play-list").append(item);
          }
        }
        $("#play-list").show();
        resizeList();
        //播放
        $(".play-scheduled").on("click", function () {
          var id = $(this).attr("id").split("-")[1];
          console.log("schedule media play id => ", id);
          var audio;
          //获取之前播放文件，若是播放状态，停止播放
          audio = $(
            "#" + "scheduledplayer-" + currentPlayScheduledFileId + ""
          ).get(0);
          if (audio && !audio.paused) {
            audio.pause();
            $("#" + "scheduledstop-" + currentPlayScheduledFileId + "").hide();
            $("#" + "scheduledplay-" + currentPlayScheduledFileId + "").show();
          }

          currentPlayScheduledFileId = id;

          $("#" + "scheduledplay-" + id + "").hide();
          $("#" + "scheduledstop-" + id + "").show();
          audio = $("#" + "scheduledplayer-" + id + "").get(0);
          // 监听播放完成事件
          audio.addEventListener(
            "ended",
            function () {
              audioEnded("scheduled", id);
            },
            false
          );
          audio.play();
        });
        //暂停
        $(".stop-scheduled").on("click", function () {
          var id = $(this).attr("id").split("-")[1];
          console.log("schedule media stop id => ", id);
          $("#" + "scheduledstop-" + id + "").hide();
          $("#" + "scheduledplay-" + id + "").show();
          var audio = $("#" + "scheduledplayer-" + id + "").get(0);
          audio.pause();
        });
      },
    });
  }

  $(document).on("click", ".del_file", function () {
    var id = $(this).attr("id").split("-")[1];
    deleteMediaInfo(id);
  });

  function deleteMediaInfo(file) {
    var u = url + "/deleteMediaInfo/?file_id=" + file;
    $.ajax({
      type: "get",
      url: u,
      success: function (d) {
        getSchedules(window.user);
      },
    });
  }

  function handleSuccess(data) {
    console.log("handleSuccess(data) data => ", data);
    if (data) {
      // var time = new Date($("#playtime").val());
      var time = new Date();
      time =
        time.getFullYear() +
        "-" +
        (time.getMonth() + 1) +
        "-" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes();
      console.log("handleSuccess(data) time => ", time);
      saveMediaInfo(
        data.audio_file.path.split("tmp_uploads/")[1],
        data.audio_file.name,
        time
      );
    } else {
      alert("No images were uploaded.");
    }
  }

  function loadProperties(lang) {
    $.i18n.properties({
      name: "langs", //属性文件名     命名格式： 文件名_国家代号.properties
      path: "i18n/", //注意这里路径是你属性文件的所在文件夹
      mode: "map",
      language: lang, //这就是国家代号 name+language刚好组成属性文件名：strings+zh -> strings_zh.properties
      callback: function () {
        $("[data-locale]").each(function () {
          $(this).html($.i18n.prop($(this).data("locale")));
          $("#searchText").attr("placeholder", $.i18n.prop("Search..."));
          $("#streamUrl").attr("placeholder", $.i18n.prop("Stream URL"));
          $("#streamName").attr("placeholder", $.i18n.prop("Stream Name"));
          $("#account-reset").attr("value", $.i18n.prop("RESET"));
          $("#account-submit").attr("value", $.i18n.prop("SUBMIT"));
          $("#mp3-reset").attr("value", $.i18n.prop("RESET"));
          $("#mp3-submit").attr("value", $.i18n.prop("SUBMIT"));
          $("#radio-reset").attr("value", $.i18n.prop("RESET"));
          $("#radio-submit").attr("value", $.i18n.prop("SUBMIT"));
          $("#date").attr("placeholder", $.i18n.prop("mm-dd-yyyy"));
          $("#set-time-reset").attr("value", $.i18n.prop("RESET"));
          $("#set-time-submit").attr("value", $.i18n.prop("SUBMIT"));
        });
      },
    });
  }
  //点击泰国国旗
  $("#thaiBtn").on("click", function (event) {
    sessionStorage.setItem("langs", "th");
    loadProperties("th");
  });
  //点击美国国旗
  $("#enBtn").on("click", function (event) {
    sessionStorage.setItem("langs", "en");
    loadProperties("en");
  });
  // speek 开始讲课
  $("#speek").on("click", function (event) {
    var status = ""; // 状态
    $("#speek").addClass("active");
    $("#speek").attr("disabled", true);
    $("#end").removeClass("active");
    $("#end").attr("disabled", false);
    if ($("#speek").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("speak start! status=> ", status);
    speak(true);
  });
  // end 讲课结束
  $("#end").on("click", function (event) {
    var status = ""; // 状态
    $("#end").addClass("active");
    $("#end").attr("disabled", true);
    $("#speek").removeClass("active");
    $("#speek").attr("disabled", false);
    if ($("#end").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("speak end! status=> ", status);
    speak(false);
  });
  // start-bell 上课铃
  $("#start-bell").on("click", function (event) {
    if (!isStartBellSelect) {
      $("#start-bell").addClass("active");
      isStartBellSelect = true;
    } else {
      $("#start-bell").removeClass("active");
      isStartBellSelect = false;
    }
    var status = ""; // 状态
    if ($("#start-bell").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("start bell! status=> ", status);
    if (status == "active") {
      dispatchBellCommand(bellStartAudio, "play");
    } else {
      dispatchBellCommand(bellStartAudio, "stop");
    }
  });
  // end-bell 下课铃
  $("#end-bell").on("click", function (event) {
    if (!isEndBellSelect) {
      $("#end-bell").addClass("active");
      isEndBellSelect = true;
    } else {
      $("#end-bell").removeClass("active");
      isEndBellSelect = false;
    }
    var status = ""; // 状态
    if ($("#end-bell").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("end bell! status=> ", status);
    if (status == "active") {
      dispatchBellCommand(bellEndAudio, "play");
    } else {
      dispatchBellCommand(bellEndAudio, "stop");
    }
  });
  // search 搜索
  $("#searchBtn").on("click", function (event) {
    searchText = $("#searchText").val();
    console.log("search text => ", searchText);
    getMediaList();
  });
  window.playMode = "order";

  function playAudioMedia(playNext) {
    if (!globalAudio.src) {
      playNext = true;
    }

    console.log("playNext = " + playNext + ",audioIndex = " + audioIndex);
    console.log("globalAudio.src old=>" + globalAudio.src);
    // if(!playNext){
    //   // globalAudio.play();
    //   return;
    // }
    if (audioBuffer.length < 1) {
      return;
    }
    if (audioIndex < 0) {
      audioIndex = 0;
    }
    if (audioIndex >= audioBuffer.length) {
      audioIndex = audioBuffer.length - 1;
    }
    dispatchAudioMeidaCommand(audioBuffer[audioIndex], "play");
    globalAudio.volume = 0;
    if (globalAudio.src !== audioBuffer[audioIndex]) {
      globalAudio.pause();
      globalAudio.src = audioBuffer[audioIndex];
    }

    console.log("globalAudio.src old=>" + globalAudio.src);
    globalAudio.play();
  }
  window.globalAudio = new Audio();
  window.audioIndex = -1;
  window.audioBuffer = [];
  window.mediaPlayStop = true;
  window.globalAudio.addEventListener(
    "ended",
    function () {
      if (window.mediaPlayStop) {
        console.log("nothing did, mediaPlayStop:" + window.mediaPlayStop);
        return;
      }
      console.log("play ended");
      if (playMode == "order") {
        audioIndex++;
        if (audioIndex >= audioBuffer.length) {
          audioIndex = 0;
        }
      } else {
        audioIndex = Math.floor(Math.random() * (audioBuffer.length + 1));
        if (audioIndex >= audioBuffer.length) {
          audioIndex = audioBuffer.length - 1;
        }
      }
      playAudioMedia(true);
    },
    false
  );
  // stop 停止播放
  $("#stop").on("click", function (event) {
    // $('#stop').addClass("active");
    // // $("#stop").attr('disabled', true);
    $("#previous").attr("disabled", true);
    $("#next").attr("disabled", true);
    $("#play").removeClass("active");
    $("#play").attr("disabled", false);
    var status = ""; // 状态
    if ($("#stop").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("stop! status=> ", status);
    window.mediaPlayStop = true;
    if (window.globalAudio) {
      window.globalAudio.pause();
    }

    dispatchAudioMeidaCommand(audioBuffer[audioIndex], "stop");
    // globalAudio.pause();
  });
  // play 开始播放
  $("#play").on("click", function (event) {
    if ($("#play").hasClass("active")) {
      $("#play").removeClass("active");
      $("#previous").attr("disabled", true);
      $("#next").attr("disabled", true);
    } else {
      $("#play").addClass("active");
      $("#previous").attr("disabled", false);
      $("#next").attr("disabled", false);
    }
    // $('#play').addClass("active");
    // $("#play").attr('disabled', true);

    // $('#stop').removeClass("active");
    // $("#stop").attr('disabled', false);
    var status = ""; // 状态
    if ($("#play").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("play! status=> ", status);
    window.mediaPlayStop = false;
    playAudioMedia(false);
  });
  // previous 上一曲
  $("#previous").on("click", function (event) {
    // $('#play').addClass("active");
    // $("#play").attr('disabled', true);
    // $('#stop').removeClass("active");
    // $("#stop").attr('disabled', false);
    var status = ""; // 状态
    if (!$("#previous").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("previous! status=> ", status);
    audioIndex--;
    if (audioIndex < 0) {
      audioIndex = audioBuffer.length - 1;
    }
    window.mediaPlayStop = false;
    playAudioMedia(true);
  });
  // next 下一曲
  $("#next").on("click", function (event) {
    // $('#play').addClass("active");
    // $("#play").attr('disabled', true);
    // $('#stop').removeClass("active");
    // $("#stop").attr('disabled', false);
    var status = ""; // 状态
    if (!$("#next").hasClass("active")) status = "active";
    else status = "inactive";
    console.log("next! status=> ", status);
    audioIndex++;
    if (audioIndex >= audioBuffer.length) {
      audioIndex = 0;
    }
    window.mediaPlayStop = false;
    playAudioMedia(true);
  });
  // order 顺序播放
  $("#order").on("click", function (event) {
    sessionStorage.setItem("order", "random");
    $("#order").hide();
    $("#random").show();
    window.playMode = "random";
  });
  // random 随机播放
  $("#random").on("click", function (event) {
    sessionStorage.setItem("order", "order");
    $("#random").hide();
    $("#order").show();
    window.playMode = "order";
  });
  //上传mp3格式文件
  $("#mp3-submit").on("click", function (event) {
    event.preventDefault();

    var files = $("#audio_file").get(0).files,
      formData = new FormData();
    console.log("mp3-submit files => ", files);
    if (files.length === 0) {
      alert("Select atleast 1 file to upload.");
      return false;
    }
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("audio_file", file, file.name);
      uploadFiles(formData);
    }

    console.log("mp3-submit formData => ", formData);
  });
  //删除音频文件
  $(document).on("click", ".delete", function (event) {
    event.preventDefault();
    var r = confirm("Are you sure you want to delete this file?");
    if (r == true) {
      var id = $(this).attr("id").split("-")[1];
      console.log("media delete id => ", id);
      var u = url + "/deleteMediaFile/?file_id=" + id;
      $.ajax({
        type: "get",
        url: u,
        success: function (d) {
          currentPlayFileId = -1;
          getMediaList();
          console.log("Success");
        },
      });
    } else {
    }
  });
  //点击修改密码窗口中重置按钮时
  $("#account-reset").on("click", function (event) {
    $("#oldPassword").val(""); //旧密码
    $("#newPassword").val(""); //新密码
    $("#confirmPassword").val(""); //确认密码
  });
  //点击定时窗口中重置按钮时
  $("#set-time-reset").on("click", function (event) {
    $("#date").val("");
    $("#time").val("");
  });
  //radio窗口中重置按钮时
  $("#radio-reset").on("click", function (event) {
    $("#streamUrl").val(""); //radio文件地址
    $("#streamName").val(""); //radio文件名称
  });
  //预设播放文件
  $("#set-time-submit").on("click", function (event) {
    event.preventDefault();
    var date = $("#date").val();
    var time = $("#time").val();
    console.log("date, time => ", date, time);
    console.log("audiofileCache => ", audiofileCache);
    console.log("selectFileId => ", selectFileId);
    createScheduled(
      audiofileCache[selectFileId].file_path,
      audiofileCache[selectFileId].file_name,
      date + " " + time
    );
  });
  //上传radio格式文件
  $("#radio-submit").on("click", function (event) {
    event.preventDefault();
    console.log("radio-submit #streamUrl => ", $("#streamUrl"));
    var streamUrl = $("#streamUrl").val();
    var streamName = $("#streamName").val();
    console.log(
      "radio-submit streamUrl, streamName => ",
      streamUrl,
      streamName
    );
    if (streamUrl.length === 0) {
      alert("Stream Url is needed.");
      return false;
    }
    if (streamName.length === 0) {
      alert("Stream Name is needed.");
      return false;
    }

    // var time = new Date($("#media_playtime").val());
    var time = new Date();
    time =
      time.getFullYear() +
      "-" +
      (time.getMonth() + 1) +
      "-" +
      time.getDate() +
      " " +
      time.getHours() +
      ":" +
      time.getMinutes();
    saveMediaInfo(streamUrl, streamName, time);
  });
  //删除预设文件
  $(document).on("click", ".delete-scheduled", function (event) {
    event.preventDefault();
    var r = confirm("Are you sure you want to delete this file?");
    if (r == true) {
      var id = $(this).attr("id").split("-")[1];
      console.log("SCHEDULED delete id => ", id);
      var u = url + "/deleteSchedule/?file_id=" + id;
      $.ajax({
        type: "get",
        url: u,
        success: function (d) {
          currentPlayScheduledFileId = -1;
          getSchedules();
          console.log("Success");
        },
      });
    } else {
    }
  });

  /*
        $(document).on("click", ".cntbtn", function () {
          var s = $(this).html().indexOf("Online") != -1 ? 0 : $(this).html().indexOf("Busy") != -1 ? 1 : -1;
          if (s != -1) {
            if (s == 0) $(this).html($(this).html().replace("Online", "Offline").replace("Online", "Offline"));
            else $(this).html($(this).html().replace("Busy", "Online").replace("Busy", "Online"));
            var i = $(this).attr('id');
            var id = i.split("-")[1];
            var u = url + '/active/?active=' + s + '&userid=' + id;
            $.ajax({
              type: 'get',
              url: u,
              success: function (d) {
                console.log("Success");
              }
            });
          }
        });
      */
  $(document).on("click", ".delbtn", function () {
    var r = confirm("Are you sure you want to delete this user?");
    if (r == true) {
      var i = $(this).attr("id");
      var id = i.split("-")[1];
      var u = url + "/delUser/?userid=" + id;
      $.ajax({
        type: "get",
        url: u,
        success: function (d) {
          fetchContacts();
          console.log("Success");
        },
      });
    } else {
    }
  });

  $("#change").click(function () {
    var n = $("#cname").val();
    var cp = $("#cpass").val();
    var p = $("#pass").val();
    if (p !== "" && n != "" && p == cp) {
      var u = url + "/change/?name=" + n + "&pass=" + p;
      $.ajax({
        type: "get",
        url: u,
        success: function (d) {
          console.log("Success");
          if (d.affectedRows == 1) alert("User password changed successfuly.");
          else alert("User password change failed.");
        },
      });
    } else alert("Please fill all required fields correctly.");
  });
  // 修改密码
  $("#account-submit").click(function () {
    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    let userInfo = getUserInfo();
    let loginName = userInfo.name;
    console.log(
      "修改密码，name, loginPassword, oldPassword, newPassword, confirmPassword => ",
      loginName,
      loginPassword,
      oldPassword,
      newPassword,
      confirmPassword
    );
    if (
      loginName &&
      oldPassword.trim().length > 0 &&
      newPassword.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      newPassword === confirmPassword
    ) {
      var u =
        url +
        "/change/?name=" +
        loginName +
        "&pass=" +
        newPassword +
        "&opass=" +
        oldPassword;
      $.ajax({
        type: "get",
        url: u,
        success: function (d) {
          console.log("Success", d);
          if (d.affectedRows == 1) {
            // alert("User password changed successfuly.");
            alert("User password change Success!");
            $("#popup-account").hide();
          } else alert("User password change failed.");
        },
      });
    } else alert("Please fill all required fields correctly.");
  });

  $("#create").click(function () {
    var n = $("#name").val();
    var p = $("#npass").val();
    var cp = $("#ncpass").val();
    var nm = $("#number").val();
    var ip = $("#cip").val();
    let userInfo = getUserInfo();
    if (!userInfo) {
      //goAdminHome();
    }
    if (nm.length != 4) {
      alert("Number must contain exactly 4 digits.");
      return;
    }
    var t = $("#lblusr").hasClass("active") ? 0 : 1;
    if (p !== "" && n != "" && p == cp) {
      var u =
        url +
        "/create/?name=" +
        n +
        "&type=" +
        t +
        "&pass=" +
        p +
        "&num=" +
        nm +
        "&cid=" +
        userInfo.cid +
        "&ip=" +
        ip;
      $.ajax({
        type: "get",
        url: u,
        success: function (d) {
          if (d.affectedRows == 1) alert("User created successfuly.");
          else alert("User creation failed.");
        },
      });
    } else alert("Please fill all required fields correctly.");
  });
  $("#refreshAudioContacts").click(function () {
    getSchedules();
  });

  console.log("document ready=>");
  let userInfo = getUserInfo();
  if (!userInfo) {
    let uid = getUrlParam("user");
    console.log("url uid=" + uid);
    if (!uid) {
      location.replace("admin/index.html");
    }
    getUserInfoByUserId(
      uid,
      function () {
        updateUserInfo(getUserInfo());
      },
      function () {
        location.replace("admin/index.html");
      }
    );
  } else {
    updateUserInfo(userInfo);
  }
});
const showData = (name) => {
  audioName = name;
  document.getElementById("audio-label").innerText = name;
};
