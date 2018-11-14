(function (designWidth) {
  var winWidth = document.body.clientWidth || document.documentElement.clientWidth;
  if (winWidth > designWidth) winWidth = designWidth
  document.querySelector("html").style.fontSize = winWidth * 100 / designWidth + "px";

  window.addEventListener("resize", function () {
    setRem(designWidth);
  });
})(750)


