function Rem() {
	var docEl = document.querySelector('html'),
	oSize = docEl.clientWidth / 7.5;

	if (oSize > 100) {
	  oSize = 100; // 限制rem值 750 / 7.5 = 100
	}

	docEl.style.fontSize = oSize + 'px';
	console.log(oSize);
}
window.addEventListener('resize', Rem, false);
Rem();

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  WeixinJSBridge.call('hideToolbar');
  WeixinJSBridge.call('hideOptionMenu');
});