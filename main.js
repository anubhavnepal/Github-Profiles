//Selecors
const container = document.querySelector(".users-container");
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
tryAgainBtn.addEventListener("click", refreshAgain);
reloadBtn.forEach((el) => {
  el.addEventListener("click", reload);
});
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
  } else {
    getUserDetails();
    emptyVal.style.display = "none";
    networkError.classList.add("d-none");
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

function getUserDetails() {
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
        document.body.classList.add("overflw");
        inputVal.readOnly = true;
        ovrlay.classList.remove("d-none");
        setTimeout(() => {
          userError.classList.remove("d-none");
        }, 350);
      } else {
        document.body.classList.remove("overflw");
        setTimeout(() => {
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
          if (blogData === "") {
            blog.innerHTML = "-";
            blog.style = "cursor:text; text-decoration:none; color:inherit";
          } else {
            blog.innerHTML = "link";
            blog.style = "cursor:pointer; text-decoration:underline; color:#0066CC";
            blog.href = blogData;
         }
         if (companyData === null) {
           comp.innerHTML = "-";
         }
        }, 400);
      } 
    })
    .catch(() => {
      inputVal.readOnly = true;
      container.classList.add("d-none");
      ovrlay.classList.remove("d-none");
      document.body.classList.add("overflw");
      setTimeout(() => {
        networkError.classList.remove("d-none");
      }, 350);
    });
}
function ratelimit() {
  fetch("https://api.github.com/rate_limit")
    .then((res) => res.json())
    .then((data) => {
      const left = data.resources.core.remaining;
      const timestap = data.resources.core.reset;
      if (left === 0) {
        inputVal.readOnly = true;
        document.body.classList.add("overflw");
        container.innerHTML = "";
         setTimeout(() => {
        limitError.classList.remove("d-none");
      }, 350);
        ovrlay.classList.remove("d-none");
      }
      let current = new Date().getTime();
      let epoch = new Date(timestap * 1000).getTime();
      let diff = epoch - current;
      let hr = Math.floor(diff / (1000 * 60 * 60));
      let min = Math.floor(diff / (1000 * 60));
      let sec = Math.floor(diff / 1000);
      if (hr === 0 || hr === 1) {
        limitTime.innerHTML = "In an hour";
      }
      if (min <= 50) {
        limitTime.innerHTML = `In ${min} minutes`;
      }
      if (min <= 1) {
        limitTime.innerHTML = `In a minute`;
      }
      if (sec <= 30) {
        limitTime.innerHTML = `In a few seconds`;
      }
    });
}
function refreshAgain() {
  setTimeout(() => {
    document.body.classList.remove("overflw");
    inputVal.readOnly = false;
    container.classList.add("d-none");
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
