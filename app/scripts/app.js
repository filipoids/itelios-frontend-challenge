var Index = (function (window, document){
	var URLDATE = 'products.json';
	var data;	

	return {
		getJSON: function (url, callback){
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
					callback(JSON.parse(xmlhttp.responseText));
				}
			}
			
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		},
		limitDescriptDots: function (source, size) {
			return source.length > size ? source.slice(0, size - 1) + "…" : source;
		},
		replaceUrlImages:function (urlImage) {

			return urlImage.replace('//www.itelios.com.br/arquivos/imagens/', 'images/')

		},
		replacePriceConditions: function (price) {

			return price.replace('ou até ', '').
				   		 replace(' sem juros', '');

		},
		template: function (response) {
			for (var i = 0; i < response[0].data.recommendation.length; i++ ) {
				this.createTemplate(response[0].data.recommendation[i], '.content-slider');
			}

			this.createTemplate(response[0].data.item, '.content-main-product');

			this.startCarousel();
		},
		createTemplate: function (response, obj) {
			var html = '';
			html += '<div class="item-product">';
			html += '	<div class="image-entry">';
			html += '		<img src="' + Index.replaceUrlImages(response.imageName) + '" />';
			html += '	</div>';
			html += '	<div class="description-entry">';
			html += '		<h3 class="description-product">' + Index.limitDescriptDots(response.name, 80) + '</h3>';
			html += '		<p class="por">Por: <strong>' + response.price + '</strong></p>';
			html += '		<p class="or">ou <strong> ' + Index.replacePriceConditions(response.productInfo.paymentConditions) + '</strong> sem juros</p>';
			html += '	</div>';
			html += '	<button type="button" id="add-cart" class="button-cart-add">adicionar ao carrinho <i class="material-icons">add_shopping_cart</i></button>'
			html += '</div>';

			document.querySelector(obj).innerHTML += html;
		},
		startCarousel:function(){
			var carousel = document.querySelector('.content-slider');
			var carouselItens = carousel.querySelectorAll('.item-product');
			var carouselWidth = carouselItens.length * carouselItens[0].offsetWidth;

			this.itemWidth = carouselItens[0].offsetWidth;
			this.actualItem = 0;
			this.maxCarouselItens = carouselItens.length;

			this.createButtonsCarousel();

			carousel.style.width = carouselWidth +'px';
		},
		createButtonsCarousel:function(carouselItens){
			var obj = '';

			for(var i = 0; i<this.maxCarouselItens; i++){
				obj += '<span class="circle" data-i='+i+'></span>'
			}
			
			document.querySelector('.pagination').innerHTML += obj;
			
			this.addCarouselButtonsListener();
		},
		addCarouselButtonsListener:function(){
			var buttons = document.querySelectorAll('.pagination .circle');
			buttons[0].classList.add('active');
			
			for(var i = 0; i < buttons.length; i++){
				buttons[i].addEventListener('click', this.buttonCarouselListener.bind(this));
			}
		},
		buttonCarouselListener:function(e){
			document.querySelector('.content-slider').style.left = -(e.currentTarget.getAttribute('data-i') * this.itemWidth) + 'px';

			document.querySelector('.circle.active').classList.remove('active');
			e.currentTarget.classList.add('active');
		},
		init: function(){
			this.getJSON(URLDATE, Index.template.bind(this));
		}

	}
})(window, document);

Index.init();