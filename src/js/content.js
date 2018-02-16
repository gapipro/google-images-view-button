(function(){
	var GoogleImagesViewButton = {
		data:{
			buttonAdded:false,
			log:false,
			observer: null,
			observerConfig: {
				childList: true,
				attributes: true,
				attributeFilter: ['src'],
				subtree: true
			}
		},

		init:function(){
			this.log("View Image script loaded");

			if(this.isSearchPage()) {
				this.startObserving();
			}

		},

		isSearchPage: function(){
			return window.location.href.indexOf('/search') !== -1;
		},

		stopObserving: function() {
			if (this.data.observer != null) {
				this.data.observer.disconnect();
			}
		},

		startObserving: function() {
			var self = this;
			var targets = document.querySelectorAll('#search');
			var trackableTargets = [
				'irc_mi'
			];

			this.data.observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'attributes') {
						var mainClassName = (mutation.target.className) ? mutation.target.className.trim() : null;
						if(mainClassName) {
							var classNames = mainClassName.split(' ');
							classNames.forEach(function (className){
								if(trackableTargets.indexOf(className) != -1) {
									self.addButton(mutation.target);
								}
							});
						}
					}
				});
			});

			targets.forEach(function (target) {
				self.data.observer.observe(target, self.data.observerConfig);
			});
		},

		addButton: function(target) {
			var panels = document.querySelectorAll('#irc_cc > div');
			if(panels) {
				for(var i = 0; i < panels.length; i++) {
					var panel = panels[i];
					var isCorrectImage = panel.contains(target);
					if(isCorrectImage) {
						var buttons = panel.querySelectorAll('.irc_but_r td');
						var buttonAdded = panel.querySelector('.viewButton');
						const path = target.getAttribute('src');
						if(!buttonAdded && buttons.length > 0) {
							var firstButton = buttons[0];
							var clone = firstButton.cloneNode(true);
							var aLink = clone.querySelector('a');
							aLink.innerHTML = '<span>View Image</span>';
							aLink.removeAttribute('jsaction');
							aLink.removeAttribute('data-ved');
							aLink.setAttribute('href', path);
							aLink.classList.add('viewButton');
							firstButton.parentElement.appendChild(clone);
						}else {
							var button = panel.querySelector('.viewButton');
							button.setAttribute('href', path);
						}
					}
				}
			}
		},

		log:function(){
			if(this.data.log){
				return console.log.apply(console, arguments);
			}
		}
	};

	GoogleImagesViewButton.init();
})();




