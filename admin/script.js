document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }
    dropZoneElement.classList.remove("drop-zone--over");
  });
});

function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }
  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

const mp3Reset = document.getElementById("mp3-reset");
const mp3Form = document.getElementById("mp3-form");

// mp3Reset.addEventListener("click", (e) => {
//   e.stopImmediatePropagation();
//   let thumbnailElement = document.querySelector(".drop-zone__thumb");

//   if (thumbnailElement) {
//     thumbnailElement.dataset.label = null;
//     thumbnailElement.style.backgroundImage = null;
//   }
//   mp3Form.reset();
// });

mp3Reset.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  let thumbnailElement = document.querySelector(".drop-zone__thumb");

  if (thumbnailElement) {
    $("div").remove(".drop-zone__thumb");//删除类为drop-zone__thumb节点
    var node = `<span class="drop-zone__prompt" data-locale="upload file">
            Drag & Drop files here <br />
            or <br />
            Click to Upload
          </span>`;
    $('.drop-zone').prepend(node);
    $('#audio_file').val('');//重置mp3文件列表
  }
});

function closePopup(e, closeELement) {
  e.stopImmediatePropagation();
  closeELement.style.display = "none";
  document.body.style.overflow = "initial";
}
function openPopup(e, openELement) {
  e.stopImmediatePropagation();
  document.body.style.overflow = "hidden";
  openELement.style.display = "flex";
  $('#oldPassword').val('');//旧密码
  $('#newPassword').val('');//新密码
  $('#confirmPassword').val('');//确认密码
  $('#date').val('');//日期
  $('#time').val('');//时间

  let thumbnailElement = document.querySelector(".drop-zone__thumb");

  if (thumbnailElement) {
    $("div").remove(".drop-zone__thumb");//删除类为drop-zone__thumb节点
    var node = `<span class="drop-zone__prompt" data-locale="upload file">
            Drag & Drop files here <br />
            or <br />
            Click to Upload
          </span>`;
    $('.drop-zone').prepend(node);
    $('#audio_file').val('');//重置mp3文件列表
  }
  $('#streamUrl').val('');//radio文件地址
  $('#streamName').val('');//radio文件名称
}

// popup mp3
const mp3Popup = document.getElementById("popup-mp3");
const mp3Open = document.getElementById("mp3-open");
const mp3Close = document.getElementById("mp3-close");

const radioPopup = document.getElementById("popup-radio");
const radioOpen = document.getElementById("radio-open");
const radioClose = document.getElementById("radio-close");

const timePopup = document.getElementById("popup-time");
const timeClose = document.getElementById("time-close");

const accountPopup = document.getElementById("popup-account");
const accountOpen = document.getElementById("account-open");
const accountClose = document.getElementById("account-close");

mp3Open.addEventListener("click", (e) => openPopup(e, mp3Popup));
radioOpen.addEventListener("click", (e) => openPopup(e, radioPopup));
accountOpen.addEventListener("click", (e) => openPopup(e, accountPopup));

mp3Close.addEventListener("click", (e) => closePopup(e, mp3Popup));
radioClose.addEventListener("click", (e) => closePopup(e, radioPopup));
timeClose.addEventListener("click", (e) => closePopup(e, timePopup));
accountClose.addEventListener("click", (e) => closePopup(e, accountPopup));

// microphone
const micrphoneSection = document.querySelector(".left-bottom");

micrphoneSection.addEventListener("click", (e) => {
  e.stopImmediatePropagation();
  if (e.target.classList.contains("fa-microphone")) {
    // let statusText = e.target.parentNode.parentNode.querySelector(".status-text");
    // if (e.target.parentNode.nextElementSibling.classList.contains("active")) {
    //   e.target.parentNode.nextElementSibling.classList.remove("active");
    //   statusText.textContent = "offline";
    // } else {
    //   e.target.parentNode.nextElementSibling.classList.add("active");
    //   statusText.textContent = "online";
    // }

    // just turn green microphone
    e.target.parentNode.classList.toggle("active");
  }
});

// edit
const mediaList = document.querySelector("#media-list");
mediaList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("button-style") ||
    e.target.classList.contains("fa-edit")
  ) {
    openPopup(e, timePopup);
  }
});
