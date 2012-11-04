BugMeBack
============

BugMeBack is a free GNU/GPL extension for both Google Chrome and Opera that allows your users to report bugs with a form that :
* ask all the elements to reproduce and understand the bug
* give the user agent, screen size and url of the bug
* give the console contents (console.log calls and javascript errors)
* takes a screenshot of the page

Finally, the user can send the bug :
* by copy/pasting the bug report in a mail
* automaticaly with a POST request containing a JSon/urlencoded/Text report when the page contains this kind of meta tag :
`<link rel="bugreport" type="application/json" href="https://app.ecogom.fr.ewk/bug.dat" />`

Hope you'll find it usefull, feel free to commit (especially if you want to translate it in your language), suggest improvement or claim issues.

The extension in the Google Chrome Store : https://chrome.google.com/webstore/detail/bugmeback/hgmagcomobmjhaomdoihiggpdekaehmg
Also available on the Opera extensions website : https://addons.opera.com/en/extensions/details/bugmeback/

A blog post in french about BugMeBack : http://www.insertafter.com/articles-bugmeback.html

A thread about this proposal on the WhatWG list : http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2012-October/037745.html

Testing
-------------
* opera : drag the config.xml file on the opera window
* chrome : tools>extensions check the developper mode and choose load unpacked add-on.

Contributors
-------------
* nfroidure : http://twitter.com/nfroidure

License
-------
This program excluding it's sounds is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>
