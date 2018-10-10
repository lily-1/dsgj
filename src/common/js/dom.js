export function getRect(el) {
	if (el instanceof window.SVGElement) {
		let rect = el.getBoundingClientRect();
		return {
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height
		};
	} else {
		return {
			top: el.offsetTop,
			left: el.offsetLeft,
			width: el.offsetWidth,
			height: el.offsetHeight
		};
	}
};

export function getData(el, name, val) {
	const prefix = 'data-';
	name = prefix + name;
	if (val) {
		return el.setAttribute(name, val);
	} else {
		return el.getAttribute(name);
	}
};
