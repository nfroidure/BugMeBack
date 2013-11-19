var screenshot='';

chrome.extension.onMessage.addListener(function(data) {
  var form=document.createElement('form');
  form.innerHTML='<form action="#">'
    +'	<p><label>'+chrome.i18n.getMessage("summary_label")+'*<br />'
    +'<input type="text" id="summary" placeholder="'
      +chrome.i18n.getMessage("summary_placeholder")+'" required="required" /></p>'
    +'	<p><label>'+chrome.i18n.getMessage("url_label")+'<br />'
    +'<input type="text" id="url"'+(bugUrl?
      ' value="'+bugUrl+'" disabled="disabled"':
      ' required="required"')+' /></p>'
    +'	<p><label>'+chrome.i18n.getMessage("browser_label")+'<br />'
    +'<input type="text" id="browser" value="'+window.navigator.userAgent
      +'" disabled="disabled" /></p>'
    +'	<p><label>'+chrome.i18n.getMessage("screen_label")+'<br />'
    +'<input type="text" id="screen" value="'
    +'width: '+data.infos.screen.width+', height: '+data.infos.screen.height
    +', scrollX: '+data.infos.screen.scrollX
    +', scrollY: '+data.infos.screen.scrollY
    +'" disabled="disabled" /></p>'
    +'	<p><label>'+chrome.i18n.getMessage("whatdone_label")+'*<br />'
    +'<textarea id="whatdone" placeholder="'
      +chrome.i18n.getMessage("whatdone_placeholder")
      +'" required="required"></textarea></p>'
    +'	<p><label>'+chrome.i18n.getMessage("whathad_label")+'*<br />'
    +'<textarea id="whathad" placeholder="'
      +chrome.i18n.getMessage("whathad_placeholder")
      +'" required="required"></textarea></p>'
    +'	<p><label>'+chrome.i18n.getMessage("whatshould_label")+'*<br />'
    +'<textarea id="whatshould" placeholder="'
      +chrome.i18n.getMessage("whatshould_placeholder")
      +'" required="required"></textarea></p>'
    +'	<p><label>'+chrome.i18n.getMessage("console_label")+'<br />'
    +'<textarea id="console" disabled="disabled">'
      +data.infos.console+'</textarea></p>'
    +'	<p><label><input type="checkbox" id="security" /> '
      +chrome.i18n.getMessage("security_label")+'</label></p>'
    +(screenshot?'	<p><img src="'+screenshot
      +'" alt="'+chrome.i18n.getMessage("screenshot_alt")+'" /></p>':'')
    +'	<p><label>'+chrome.i18n.getMessage("usermail_label")+'<br />'
    +'<input type="email" id="usermail" placeholder="'
      +chrome.i18n.getMessage("usermail_placeholder")+'" /></p>'
    +(data.infos.reportUrl.indexOf('http:')===0?
      '	<p>'+chrome.i18n.getMessage("unsecure_label")+'</p>':'')
    +'	<p><input type="submit" value="'
      +chrome.i18n.getMessage("submit")+'" /></p>'
    +'</form>';
  form.addEventListener('submit', function(event) {
    event.stopPropagation();
    event.preventDefault();
    var content='';
    switch(data.infos.reportType) {
      case 'application/json':
        content=JSON.stringify({
          'entry':{
            'label':document.getElementById('summary').value,
            'url':document.getElementById('url').value,
            'browser':document.getElementById('browser').value,
            'screen':document.getElementById('screen').value,
            'whatdone':document.getElementById('whatdone').value,
            'whathad':document.getElementById('whathad').value,
            'whatshould':document.getElementById('whatshould').value,
            'console':document.getElementById('console').value,
            'usermail':document.getElementById('usermail').value,
            'security':(document.getElementById('security').checked?1:0),
            'screenshot':screenshot
          }
        });
      break;
      case 'multipart/form-data':
      case 'application/x-www-form-urlencoded':
        content=new FormData();
        content.append('label',document.getElementById('summary').value);
        content.append('url',document.getElementById('url').value);
        content.append('browser',document.getElementById('browser').value);
        content.append('screen',document.getElementById('screen').value);
        content.append('whatdone',document.getElementById('whatdone').value);
        content.append('whathad',document.getElementById('whathad').value);
        content.append('whatshould',document.getElementById('whatshould').value);
        content.append('console',document.getElementById('console').value);
        content.append('usermail',document.getElementById('usermail').value);
        content.append('security',(document.getElementById('security').checked?1:0));
        if(data.infos.reportType=='multipart/form-data') {
          var binary = atob(screenshot.split(',')[1]);
          var array = [];
          for(var i = 0; i < binary.length; i++)
          array.push(binary.charCodeAt(i));
          content.append('screenshot',new Blob([new Uint8Array(array)], {
            type: screenshot.split(';')[0].split(':')[1]
          }));
        } else {
          content.append('screenshot',screenshot);
        }
      break;
      case 'text/plain':
      default:
        content='## BugMeBack manual bug report ##\n'
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
          +'Screenshot (dataUri):'+screenshot+'\n'
          +'See http://github.com/nfroidure/BugMeBack to know how to automate bug reporting.';
    }
    if(data.infos.reportUrl.indexOf('http:')===0
      ||data.infos.reportUrl.indexOf('https:')===0) {
      while(document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      var p=document.createElement('p');
      p.innerHTML=chrome.i18n.getMessage("sending")+' '+data.infos.reportUrl+'.';
      document.body.appendChild(p);
      var req = new XMLHttpRequest();
      req.open(
      "POST",
      data.infos.reportUrl,
      true);
      req.onload = function() {
        while(document.body.firstChild) {
          document.body.removeChild(document.body.firstChild);
        }
        var p=document.createElement('p');
        if(req.status==200||req.status==201) {
          p.innerHTML=chrome.i18n.getMessage("sent");
        } else {
          p.innerHTML=chrome.i18n.getMessage("error")
            +' (code:'+req.status+', response:'+req.responseText+').';
        }
        document.body.appendChild(p);
      };
      req.send(content);
    }
    /* Can't use mailto because of the 2048 chars limit
    else if(data.infos.reportUrl.indexOf('mailto:')===0) {
      while(document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      var p=document.createElement('p');
      p.innerHTML='<a href="mailto:'+data.infos.reportUrl.substring(7)
        +'?subject=Bug+report&content='+encodeURIComponent(content)
        +'">Clic to send</a>';
      document.body.appendChild(p);
    }*/
    else {
      while(document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
      }
      var p=document.createElement('p');
      p.innerHTML='<label>'+chrome.i18n.getMessage("bugreport")
        +'<br /><textarea>'+content+'</textarea><br />'
        +chrome.i18n.getMessage("bugreport_help")+'</label>';
      document.body.appendChild(p);
      p.getElementsByTagName('textarea')[0].select();
    }
  });
  document.body.appendChild(form);
});

window.addEventListener('load',function() {
  chrome.tabs.captureVisibleTab(null,null,function(dataUri) {
    screenshot=(dataUri?dataUri:'');
    chrome.tabs.getSelected(null,function(tab) {
      if(tab&&tab.url&&dataUri) {
        bugUrl=tab.url;
        chrome.tabs.executeScript(tab.id, {
          file: 'get_infos.js',
          allFrames: false
        });
      } else {
        var p=document.createElement('p');
        p.innerHTML=chrome.i18n.getMessage("restricted");
        document.body.appendChild(p);
      }
    });
  });
});

