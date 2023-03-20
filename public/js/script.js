class StickyNavigation {
	
	constructor() {
		this.currentId = null;
		this.currentTab = null;
		this.tabContainerHeight = 70;
		let self = this;
		$('.et-hero-tab').click(function() { 
			self.onTabClick(event, $(this)); 
		});
		$(window).scroll(() => { this.onScroll(); });
		$(window).resize(() => { this.onResize(); });
	}
	
	onTabClick(event, element) {
		event.preventDefault();
		let scrollTop = $(element.attr('href')).offset().top - this.tabContainerHeight + 1;
		$('html, body').animate({ scrollTop: scrollTop }, 600);
	}
	
	onScroll() {
		this.checkTabContainerPosition();
    this.findCurrentTabSelector();
	}
	
	onResize() {
		if(this.currentId) {
			this.setSliderCss();
		}
	}
	
	checkTabContainerPosition() {
		let offset = $('.et-hero-tabs').offset().top + $('.et-hero-tabs').height() - this.tabContainerHeight;
		if($(window).scrollTop() > offset) {
			$('.et-hero-tabs-container').addClass('et-hero-tabs-container--top');
		} 
		else {
			$('.et-hero-tabs-container').removeClass('et-hero-tabs-container--top');
		}
	}
	
	findCurrentTabSelector(element) {
		let newCurrentId;
		let newCurrentTab;
		let self = this;
		$('.et-hero-tab').each(function() {
			let id = $(this).attr('href');
			let offsetTop = $(id).offset().top - self.tabContainerHeight;
			let offsetBottom = $(id).offset().top + $(id).height() - self.tabContainerHeight;
			if($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
				newCurrentId = id;
				newCurrentTab = $(this);
			}
		});
		if(this.currentId != newCurrentId || this.currentId === null) {
			this.currentId = newCurrentId;
			this.currentTab = newCurrentTab;
			this.setSliderCss();
		}
	}
	
	setSliderCss() {
		let width = 0;
		let left = 0;
		if(this.currentTab) {
			width = this.currentTab.css('width');
			left = this.currentTab.offset().left;
		}
		$('.et-hero-tab-slider').css('width', width);
		$('.et-hero-tab-slider').css('left', left);
	}
	
}

new StickyNavigation();

let image = document.getElementById('back-img');
let title =document.getElementById('title');
/**********************************LOGO LOGIC****************************************** */
// let sec= document.createElement("li");
let anchor= document.createElement("a")
anchor.href="#tab-home";
anchor.classList.add("et-hero-tab");
anchor.id="dyTab";
let img= document.createElement("img");
img.src="static/images/logo.png";
img.alt="Logo";
img.width="40";
img.height="40";
img.style="border-radius: 50%; margin-right: -2px; width: 35%; height: 80%;";
img.classList="inline-block align-text-top";

const text= document.createTextNode("SiCON 2023");
console.log(text);

anchor.appendChild(img);
anchor.appendChild(text);
// sec.appendChild(anchor);
/*********************************LOGO LOGIC END****************************************** */

const element= document.getElementById("navbase");
const child= document.getElementById("home");
const myTarget= document.getElementById("tab-home");

window.addEventListener('scroll',function() {
	let value= window.scrollY;
	console.log(value);
	// title.style.top = (value * 0.8)-100 + 'px';
	image.style.top = value * 0.8 + 'px';
	title.style.top = (value * 0.9)+81.5 + 'px';
	title.style.opacity = 1-(value/1000);
	if(myTarget.offsetTop - window.scrollY-75 <= 0){
		document.getElementsByClassName('et-hero-tabs-container')[0].style.backgroundColor = 'black';
		document.getElementsByClassName('et-hero-tabs-container')[0].style.opacity = 0.9;
		element.insertBefore(anchor,child);
	}
	else{
		document.getElementsByClassName('et-hero-tabs-container')[0].style.backgroundColor = 'transparent';
		let rem=document.getElementById('dyTab');
		rem.remove();
	}

})
