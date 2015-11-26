"use strict";

var APP = {
	
	response : {},
	products : [],
	itemsTpl : '',
	productsContainer : '',

	productTpl : '',

	searchInput : '',

	init : function() {
		APP.searchInput = document.getElementById('search');

		APP.itemsTpl = document.getElementById('itemsTpl').innerHTML;
		APP.productsContainer = document.getElementById('products');
		APP.productTpl = document.getElementById('productTpl').innerHTML;

		APP.getJSON("data.json").then(function(json) {
			APP.response = json;
  		APP.initSearch(json);
  		APP.renderTemplate(APP.itemsTpl, json, APP.productsContainer);
		}, function(error) {
  		console.log('nay...');
		}).catch(function(error) {
  		console.log(error);
		});
	},

	initSearch : function(data) {		
		horsey(APP.searchInput, {
  		suggestions: APP.populateAutocomplete(data),
  		set: function(value) {
  			APP.searchInput.value = value;
  		}
		});
	},

	populateAutocomplete : function(data) {
		var arr = [];
		data.categories.map(function(category) {
			category.items.map(function(product) {
				APP.products.push(product);
				arr.push(product.name);
			});
		});
		return arr;
	},

	renderTemplate : function(template, data, target) {
		target.innerHTML = Mustache.render(template, data);
	},

	getJSON : function(url) {
	  var promise = new RSVP.Promise(function(resolve, reject){
	    var client = new XMLHttpRequest();
	    client.open("GET", url);
	    client.onreadystatechange = handler;
	    client.responseType = "json";
	    client.setRequestHeader("Accept", "application/json");
	    client.send();

	    function handler() {
	      if (this.readyState === this.DONE) {
	        if (this.status === 200) { resolve(this.response); }
	        else { reject(this); }
	      }
	    };
	  });

	  return promise;
	},

	search : function() {
		var product;
		APP.products.map(function(item) {
			if ( item.name == APP.searchInput.value ) {
				product = item;
			}
		});
		if ( APP.searchInput.value == '' ) {
			APP.renderTemplate(APP.itemsTpl, APP.response, APP.productsContainer);
		} else {
			APP.renderTemplate(APP.productTpl, product, APP.productsContainer);
		}
	}
};

document.addEventListener('DOMContentLoaded', function(){	
	APP.init();

	document.getElementById('search-button').addEventListener('click', function() {
		APP.search();
	});

	document.addEventListener('keydown', function(e) {
		var key = window.event ? e.keyCode : e.which;
    if ( key == 13 ) APP.search();
	});

});