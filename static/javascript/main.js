window.addLoadEvent = function(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    };
  }
};
function menu() {
  let menu = document.getElementById('menu')
  let menuContainer = document.getElementById('menu-container')
  menu.onclick = function(e) {
    menuContainer.classList.toggle('hidden');
  };
}
addLoadEvent(menu);
