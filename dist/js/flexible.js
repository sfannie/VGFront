!function(t,e){var i,a=t.document,r=a.documentElement,n=a.querySelector('meta[name="viewport"]'),o=a.querySelector('meta[name="flexible"]'),l=0,m=0,d=e.flexible||(e.flexible={});if(n){var p=n.getAttribute("content").match(/initial\-scale=([\d\.]+)/);p&&(m=parseFloat(p[1]),l=parseInt(1/m))}else if(o){var s=o.getAttribute("content");if(s){var c=s.match(/initial\-dpr=([\d\.]+)/),u=s.match(/maximum\-dpr=([\d\.]+)/);c&&(l=parseFloat(c[1]),m=parseFloat((1/l).toFixed(2))),u&&(l=parseFloat(u[1]),m=parseFloat((1/l).toFixed(2)))}}if(!l&&!m){t.navigator.appVersion.match(/android/gi);var f=t.navigator.appVersion.match(/iphone/gi),v=(t.navigator.appVersion.match(/ipad/gi),t.devicePixelRatio);m=1/(l=f?3<=v&&(!l||3<=l)?2:2<=v&&(!l||2<=l)?2:1:1)}if(r.setAttribute("data-dpr",l),!n)if((n=a.createElement("meta")).setAttribute("name","viewport"),n.setAttribute("content","initial-scale="+m+", maximum-scale="+m+", minimum-scale="+m+", user-scalable=no"),r.firstElementChild)r.firstElementChild.appendChild(n);else{var h=a.createElement("div");h.appendChild(n),a.write(h.innerHTML)}function x(){var e=r.getBoundingClientRect().width/7.5;r.style.fontSize=e+"px",d.rem=t.rem=e}t.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(x,300)},!1),"complete"===a.readyState?a.body.style.fontSize=14*l+"px":a.addEventListener("DOMContentLoaded",function(e){a.body.style.fontSize=14*l+"px"},!1),x(),d.dpr=t.dpr=l,d.refreshRem=x,d.rem2px=function(e){var t=parseFloat(e)*this.rem;return"string"==typeof e&&e.match(/rem$/)&&(t+="px"),t},d.px2rem=function(e){var t=parseFloat(e)/this.rem;return"string"==typeof e&&e.match(/px$/)&&(t+="rem"),t}}(window,window.lib||(window.lib={}));