//Selecors
const container = document.querySelector(".users-container");
const info = document.querySelector(".app-info");
const emptyVal = document.querySelector(".error-msg-empty");
const networkError = document.querySelector(".network-error");
const userError = document.querySelector(".user-error");
const inputVal = document.getElementById("val");
const searchBtn = document.getElementById("search");
const viewBtn = document.getElementById("view");
const tryAgainBtn = document.querySelector(".tryagn");
const reloadBtn = document.querySelectorAll(".reload");
const img = document.querySelector(".dis-img");
const userName = document.querySelector(".username");
const bio = document.querySelector(".bio");
const follower = document.getElementById("flw");
const followin = document.getElementById("flwin");
const comp = document.getElementById("co");
const repo = document.getElementById("rep");
const gist = document.getElementById("gis");
const blog = document.getElementById("blg");
const popupMsg = document.querySelector(".welcome-msg-popup");
const deletePopup = document.getElementById("remove-popup");
const toggler = document.querySelector(".theme-toggler");
const ovrlay = document.querySelector(".overlay");
const limitError = document.querySelector(".limit-error");
let limitTime = document.getElementById("limit-time");
let x = 0;
//Event Listeners
inputVal.addEventListener("keyup", pressEnter);
searchBtn.addEventListener("click", render);
tryAgainBtn.addEventListener("click", closeModalError);
reloadBtn.forEach((el) => {
  el.addEventListener("click", reload);
});
ovrlay.addEventListener("click", closeModalError);
deletePopup.addEventListener("click", removePopup);
toggler.addEventListener("click", themeSwap);
document.addEventListener("scroll", popupSlide);
//Functions
  window.setTimeout(() => {
    toggler.classList.remove("d-none");
  }, 4000);
function popupSlide() {
  window.setTimeout(() => {
    popupMsg.style.display = "inline";
  }, 5500);
}
function pressEnter(e) {
  if (e.keyCode === 13) {
    render();
  }
}
function reload() {
  window.location.reload();
}
function render() {
  if (inputVal.value === "") {
    emptyVal.style.display = "block";
    info.style.display = "none";
  } else {
    setTimeout(() => {
      container.classList.remove("d-none");
    }, 1000);
    emptyVal.style.display = "none";
    networkError.classList.add("d-none");
    info.style.display = "none";
    test();
    ratelimit();
  }
  inputVal.value = "";
}
function apiData() {
  return fetch(apiUrl(inputVal.value)).then((res) => {
    return res.json();
  });
}
function apiUrl(value) {
  return `https://api.github.com/users/${value}`;
}

function test() {
  apiData()
    .then((data) => {
      let err = data.message;
      const userData = data.name;
      const bioData = data.bio;
      const profileData = data.html_url;
      const userAvatar = data.avatar_url;
      const followerData = data.followers;
      const followingData = data.following;
      const companyData = data.company;
      const repoData = data.public_repos;
      const gistData = data.public_gists;
      const blogData = data.blog;

      if (err === "Not Found") {
        container.classList.add("d-none");
        ovrlay.classList.remove("d-none");
        setTimeout(() => {
          userError.classList.remove("d-none");
        }, 350);
      } else {
        container.classList.remove("d-none");
        userName.innerHTML = userData;
        bio.innerHTML = bioData;
        viewBtn.href = profileData;
        img.innerHTML =
          `<img
              src="` +
          userAvatar +
          `"
              alt="Avatar"
            />`;
        follower.innerHTML = followerData;
        followin.innerHTML = followingData;
        comp.innerHTML = companyData;
        repo.innerHTML = repoData;
        gist.innerHTML = gistData;
        blog.innerHTML = blogData;
        blog.href = blogData;
      }
    })
    .catch((e) => {
      container.classList.add("d-none");
      ovrlay.classList.remove("d-none");
      setTimeout(() => {
        networkError.classList.remove("d-none");
      }, 350);
      console.log(e);
    });
}
function ratelimit() {
  fetch("https://api.github.com/rate_limit")
    .then((res) => res.json())
    .then((data) => {
      const left = data.resources.core.remaining;
      const timestap = data.resources.core.reset;
      if (left === 60) {
        container.classList.add("d-none");
        limitError.classList.remove("d-none");
        ovrlay.classList.remove("d-none");
        document.body.classList.add("overflw");
      } else{
        container.classList.remove("d-none");
        limitError.classList.add("d-none");
        ovrlay.classList.add("d-none");
        document.body.classList.remove("overflw");
      }
      let current = new Date().getTime();
      let epoch = new Date(timestap * 1000).getTime();
      let diff = epoch - current;
      let hr = Math.floor(diff / (1000 * 60 * 60));
      console.log(hr);
      let min = Math.floor(diff / (1000 * 60));
      console.log(min);
      let sec = Math.floor(diff / 1000);
      console.log(sec);
      if (hr === 0 || hr === 1) {
        limitTime.innerHTML = "In an hour";
      }
      if (min <= 50) {
        limitTime.innerHTML = `In ${min} minutes`;
      }
      if (min <= 1) {
        limitTime.innerHTML = `In a minute`;
      }
      if (sec === 30) {  
        limitTime.innerHTML = `In a few seconds`;
      }
    });
}
function closeModalError() {
  setTimeout(() => {
    userError.classList.add("d-none");
    networkError.classList.add("d-none");
    limitError.classList.add("d-none");
    ovrlay.classList.add("d-none");
  }, 200);
}
function removePopup(e) {
  e.target.parentElement.parentElement.classList.add("eliminate");
  setTimeout(() => {
    e.target.parentElement.parentElement.remove();
  }, 800);
}
function themeSwap(e) {
  let main = e.target;
  let sub = e.target.children[0];
  x++;
  sub.classList.remove("switch");
  setTimeout(() => {
    sub.classList.add("switch");
  });
  if (x % 2 == 0) {
    main.style = "background: #252729 !important";
    sub.classList.add("fa-sun");
    sub.classList.remove("fa-moon");
    setTimeout(() => {
      document.body.classList.remove("normalmode");
    }, 600);
  } else {
    main.style = "background: #212529 !important";
    sub.classList.add("fa-moon");
    sub.classList.remove("fa-sun");
    setTimeout(() => {
      document.body.classList.add("normalmode");
    }, 600);
  }
}