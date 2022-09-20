const list = document.getElementsByClassName("video_custom");
for (let i = 0; i < 5; i++) {
  list[i].hidden = true;
}
const masterButton = document.getElementById("role2");
const clientButton = document.getElementById("role1");
masterButton.onchange = () => {
  const list = document.getElementsByClassName("video_custom");
  for (let i = 0; i < 5; i++) {
    list[i].hidden = false;
  }
};
clientButton.onchange = () => {
  const list = document.getElementsByClassName("video_custom");
  for (let i = 0; i < 5; i++) {
    list[i].hidden = true;
  }
};

// radioButton.onclick = ()=>
// {
//     console.log("click");
// }
// radioButton.onselect = ()=>
// {
//     console.log("selected")
// }
// radioButton. = ()=>
// {
//     console.log("selected")
// }
// document.querySelector("input[type='radio'][name=role]:checked").value;
