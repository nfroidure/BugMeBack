var bugInfo='', bugUrl='', bugScreenshot='';

chrome.extension.onRequest.addListener(function(info) {
	bugInfo=info.report;
	var consoleLogs='';
	if(info.messages)
		{
		for(var i=0, j=info.messages.length; i<j; i++)
			{
			var k=0;
			while(info.messages[i][k])
				{
				consoleLogs+=(k>0?' ':'')+info.messages[i][k];
				k++;
				}
			consoleLogs+='\n';
			}
		}
	var form=document.createElement('form');
	form.innerHTML='<form action="#">'
		+'	<p><label>'+chrome.i18n.getMessage("summary_label")+'*<br />'
		+'<input type="text" id="summary" placeholder="'+chrome.i18n.getMessage("summary_placeholder")+'" required="required" /></p>'
		+'	<p><label>'+chrome.i18n.getMessage("url_label")+'<br />'
		+'<input type="text" id="url"'+(bugUrl?' value="'+bugUrl+'" disabled="disabled"':' required="required"')+' /></p>'
		+'	<p><label>'+chrome.i18n.getMessage("browser_label")+'<br />'
		+'<input type="text" id="browser" value="'+window.navigator.userAgent+'" disabled="disabled" /></p>'
		+'	<p><label>'+chrome.i18n.getMessage("screen_label")+'<br />'
		+'<input type="text" id="screen" value="'+info.screen+'" disabled="disabled" /></p>'
		+'	<p><label>'+chrome.i18n.getMessage("whatdone_label")+'*<br />'
		+'<textarea id="whatdone" placeholder="'+chrome.i18n.getMessage("whatdone_placeholder")+'" required="required"></textarea></p>'
		+'	<p><label>'+chrome.i18n.getMessage("whathad_label")+'*<br />'
		+'<textarea id="whathad" placeholder="'+chrome.i18n.getMessage("whathad_placeholder")+'" required="required"></textarea></p>'
		+'	<p><label>'+chrome.i18n.getMessage("whatshould_label")+'*<br />'
		+'<textarea id="whatshould" placeholder="'+chrome.i18n.getMessage("whatshould_placeholder")+'" required="required"></textarea></p>'
		+'	<p><label>'+chrome.i18n.getMessage("console_label")+'Console content:<br />'
		+'<textarea id="console" disabled="disabled">'+consoleLogs+'</textarea></p>'
		+'	<p><label><input type="checkbox" id="security" /> '+chrome.i18n.getMessage("security_label")+'</label></p>'
		+(bugScreenshot?'	<p><img src="'+bugScreenshot+'" alt="'+chrome.i18n.getMessage("screenshot_alt")+'" /></p>':'')
		//+(bugInfo.indexOf('mailto:')===0?'	<p><label>'+chrome.i18n.getMessage("mail_label")+'<br />'
		//+'<input type="email" id="mail" placeholder="'+chrome.i18n.getMessage("mail_placeholder")+'" required="required" /></p>':'')
		+'	<p><label>'+chrome.i18n.getMessage("usermail_label")+'<br />'
		+'<input type="email" id="usermail" placeholder="'+chrome.i18n.getMessage("usermail_placeholder")+'" /></p>'
		+(bugInfo.indexOf('http:')===0?'	<p>'+chrome.i18n.getMessage("unsecure_label")+'</p>':'')
		+'	<p><input type="submit" value="'+chrome.i18n.getMessage("submit")+'" /></p>'
		+'</form>';
		form.addEventListener('submit', function(event) {
			event.stopPropagation();
			event.preventDefault();
			if(!bugInfo)
				{
				var content='## BugMeBack manual bug report ##\n'
					+'Summary:'+document.getElementById('summary').value+'\n'
					+'Url:'+document.getElementById('url').value+'\n'
					+'Browser:'+document.getElementById('browser').value+'\n'
					+'Screen:'+document.getElementById('screen').value+'\n'
					+'What did you do:'+document.getElementById('whatdone').value+'\n'
					+'What happened:'+document.getElementById('whathad').value+'\n'
					+'What should have happened:'+document.getElementById('whatshould').value+'\n'
					+'Console content:'+document.getElementById('console').value+'\n'
					+'User mail:'+document.getElementById('usermail').value+'\n'
					+'Security issue:'+(document.getElementById('security').checked?'yes':'no')+'\n'
					+'Screenshot (dataUri):'+bugScreenshot;
				while(document.body.firstChild)
					document.body.removeChild(document.body.firstChild);
				var p=document.createElement('p');
				p.innerHTML='<label>'+chrome.i18n.getMessage("bugreport")+'<br /><textarea>'+content+'</textarea><br />'+chrome.i18n.getMessage("bugreport_help")+'</label>';
				document.body.appendChild(p);
				p.getElementsByTagName('textarea')[0].select();
				}
			/* Can't use mailto because of the 2048 chars limit
			else if(bugInfo.indexOf('mailto:')===0)
				{
				if(!bugInfo)
					bugInfo='mailto:'+document.getElementById('mail').value;
				while(document.body.firstChild)
					document.body.removeChild(document.body.firstChild);
				var p=document.createElement('p');
				p.innerHTML='<a href="mailto:'+bugInfo.substring(7)+'?subject=Bug+report&content='+encodeURIComponent(content)+'">Clic to send</a>';
				document.body.appendChild(p);
				// chrome.windows.create({'url':'mailto:'+bugInfo.substring(7)+'?subject=Bug+report&content='+encodeURIComponent(content)},null);
				}*/
			else if(bugInfo.indexOf('http:')===0||bugInfo.indexOf('https:')===0)
				{
				var content={'entry':{'label':document.getElementById('summary').value,
					'url':document.getElementById('url').value,
					'browser':document.getElementById('browser').value,
					'screen':document.getElementById('screen').value,
					'whatdone':document.getElementById('whatdone').value,
					'whathad':document.getElementById('whathad').value,
					'whatshould':document.getElementById('whatshould').value,
					'console:':document.getElementById('console').value,
					'usermail':document.getElementById('usermail').value,
					'security':(document.getElementById('security').checked?1:0),
					'screenshot':bugScreenshot}};
				while(document.body.firstChild)
					document.body.removeChild(document.body.firstChild);
				var p=document.createElement('p');
				p.innerHTML=chrome.i18n.getMessage("sending")+' '+bugInfo+'.';
				document.body.appendChild(p);
				var req = new XMLHttpRequest();
				req.open(
					"POST",
					bugInfo,
					true);
				req.onload = function()
					{
					while(document.body.firstChild)
						document.body.removeChild(document.body.firstChild);
					var p=document.createElement('p');
					if(req.status==200||req.status==201)
						p.innerHTML=chrome.i18n.getMessage("sent");
					else
						p.innerHTML=chrome.i18n.getMessage("error")+' (code:'+req.status+', response:'+req.responseText+').';
					document.body.appendChild(p);
					};
				req.send(JSON.stringify(content));
				}
			});
	document.body.appendChild(form);
	});

window.addEventListener('load',function(){
	chrome.tabs.captureVisibleTab(null,null,function(dataUri){
		bugScreenshot=(dataUri?dataUri:'');
		chrome.tabs.getSelected(null,function(tab){
			if(tab&&tab.url&&dataUri)
				{
				bugUrl=tab.url;
				chrome.tabs.executeScript(tab.id, {file: 'get_infos.js', allFrames: false});
				}
			else
				{
				var p=document.createElement('p');
				p.innerHTML=chrome.i18n.getMessage("restricted");
				document.body.appendChild(p);
				}
			});
		});
	});