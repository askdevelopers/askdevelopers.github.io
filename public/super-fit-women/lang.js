/* Website language: English, Gujarati or Hindi. Loaded in <head> (not deferred) on every page, before app.js.
   Which language:  ?lang=gu|hi|en in the link  >  the visitor's choice (language menu, saved)  >
   first visit: the state of the visitor's IP address (get.geojs.io, see STATES)  >  browser language  >  English.
   Translations are website/i18n/<lang>.json, keyed by the English text; anything missing stays English.
   The page stays hidden until the language is known (html.lang-wait in styles.css, at most WAIT_MS).
   app.js runs inside SFW.ready(), after the page is translated. Tooling: tools/website-i18n/README.md */
(function(){
  'use strict';
  var LANGS=['en','gu','hi'],KEY='sfw-lang',V='fd0f9ad5',WAIT_MS=1500,GEO='https://get.geojs.io/v1/ip/geo.json';
  // Indian state or territory (from the IP address) -> language; everywhere else gets English
  var STATES=[['gujarat','gu'],['daman','gu'],['dadra','gu'],
    ['rajasthan','hi'],['uttarpradesh','hi'],['madhyapradesh','hi'],['bihar','hi'],['jharkhand','hi'],['chhattisgarh','hi'],
    ['chattisgarh','hi'],['haryana','hi'],['delhi','hi'],['himachal','hi'],['uttarakhand','hi'],['uttaranchal','hi'],['chandigarh','hi']];

  var root=document.documentElement;
  function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function put(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function ok(l){return LANGS.indexOf(l)>=0?l:null}
  function fromBrowser(){
    var ls=navigator.languages||[navigator.language||''];
    for(var i=0;i<ls.length;i++){var l=ok(String(ls[i]).slice(0,2).toLowerCase());if(l==='gu'||l==='hi')return l}
    return 'en';
  }
  function fromGeo(g){
    if(!g||g.country_code!=='IN')return null;
    var r=String(g.region||'').toLowerCase().replace(/[^a-z]/g,'');
    for(var i=0;i<STATES.length;i++)if(r.indexOf(STATES[i][0])>=0)return STATES[i][1];
    return null;
  }

  var extract=/[?&]i18n=extract\b/.test(location.search); // tools/website-i18n/extract.py
  var asked=ok((location.search.match(/[?&]lang=([a-z]{2})\b/)||[])[1]);
  if(asked)put(KEY,asked); // a shared ?lang=gu link counts as the visitor's choice
  var lang=extract?'en':asked||ok(get(KEY)),dict=null,domReady=false,langReady=false,done=false,cbs=[];

  /* ---------------------------------------------------------------- translate the page */
  var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEMPLATE:1,SVG:1,VIDEO:1,TEXTAREA:1,SELECT:1};
  var ATOMIC={SVG:1,IMG:1,BR:1,INPUT:1,VIDEO:1};
  var INLINE={A:1,B:1,I:1,EM:1,STRONG:1,SMALL:1,SPAN:1,CODE:1,U:1,MARK:1,SUP:1,SUB:1,ABBR:1,TIME:1,Q:1,S:1,SVG:1,IMG:1,BR:1,INPUT:1};
  var ATTRS=['alt','aria-label','placeholder','title','data-pre','data-suf'];
  function tag(el){return el.nodeName.toUpperCase()}
  function no(el){return el.getAttribute('translate')==='no'}
  function atomic(el){return ATOMIC[tag(el)]||no(el)}
  function hasText(el){for(var n=el.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&/\S/.test(n.nodeValue))return true;return false}
  function inlineOnly(el){for(var c=el.firstElementChild;c;c=c.nextElementSibling){if(!INLINE[tag(c)])return false;if(!atomic(c)&&!inlineOnly(c))return false}return true}
  function words(s){return /\p{L}/u.test(s)}
  function clean(s){return s.replace(/[ \t\n\r\f]+/g,' ').trim()}
  // A "unit" is an element with its own text and only inline tags inside, e.g. <p>See our <a>policy</a>.</p>.
  // Its key is the text with numbered tags: "See our <0>policy</0>." (<n/> for icons, images, line breaks).
  function ser(el,nodes){
    var s='';
    for(var n=el.firstChild;n;n=n.nextSibling){
      if(n.nodeType===3)s+=n.nodeValue;
      else if(n.nodeType===1){var i=nodes.push(n)-1;s+=atomic(n)?'<'+i+'/>':'<'+i+'>'+ser(n,nodes)+'</'+i+'>'}
    }
    return s;
  }
  function fill(el,str,nodes){
    while(el.firstChild)el.removeChild(el.firstChild);
    var re=/<(\d+)\/>|<(\d+)>|<\/(\d+)>/g,stack=[el],last=0,m,top,n;
    while((m=re.exec(str))){
      top=stack[stack.length-1];
      if(m.index>last)top.appendChild(document.createTextNode(str.slice(last,m.index)));
      last=re.lastIndex;
      if(m[1]){n=nodes[+m[1]];if(n)top.appendChild(n)}
      else if(m[2]){n=nodes[+m[2]];if(n){while(n.firstChild)n.removeChild(n.firstChild);top.appendChild(n);stack.push(n)}else stack.push(top)}
      else if(stack.length>1)stack.pop();
    }
    if(last<str.length)stack[stack.length-1].appendChild(document.createTextNode(str.slice(last)));
  }
  // walk(el, onUnit(el,key,nodes), onText(textNode,key), onAttr(el,name,key)): the same walk translates and extracts
  function walk(el,unit,text,attr){
    if(SKIP[tag(el)]||no(el))return;
    ATTRS.forEach(function(a){var v=el.getAttribute(a);if(v&&words(v))attr(el,a,clean(v))});
    if(hasText(el)&&inlineOnly(el)){
      var nodes=[],key=clean(ser(el,nodes));
      if(words(key))unit(el,key,nodes);
      $all(el,'*').forEach(function(c){ATTRS.forEach(function(a){var v=c.getAttribute(a);if(v&&words(v))attr(c,a,clean(v))})});
      return;
    }
    for(var n=el.firstChild;n;n=n.nextSibling){
      if(n.nodeType===3){var k=clean(n.nodeValue);if(k&&words(k))text(n,k)}
      else if(n.nodeType===1)walk(n,unit,text,attr);
    }
  }
  function $all(el,sel){return Array.prototype.slice.call(el.querySelectorAll(sel))}
  function headTexts(cb){
    if(document.title)cb(clean(document.title),function(v){document.title=v});
    $all(document,'meta[name="description"],meta[property="og:title"],meta[property="og:description"]').forEach(function(m){
      var v=clean(m.getAttribute('content')||'');if(v)cb(v,function(t){m.setAttribute('content',t)});
    });
  }
  function keep(orig,v){var a=orig.match(/^\s*/)[0],b=orig.match(/\s*$/)[0];return a+v+b}
  function translate(){
    headTexts(function(k,set){if(dict[k])set(dict[k])});
    walk(document.body,
      function(el,k,nodes){if(dict[k])fill(el,dict[k],nodes)},
      function(n,k){if(dict[k])n.nodeValue=keep(n.nodeValue,dict[k])},
      function(el,a,k){if(dict[k])el.setAttribute(a,keep(el.getAttribute(a),dict[k]))});
  }
  function dump(){ // every English text on the page, for tools/website-i18n/extract.py
    var out=[];function add(k){if(out.indexOf(k)<0)out.push(k)}
    headTexts(add);
    walk(document.body,function(el,k){add(k)},function(n,k){add(k)},function(el,a,k){add(k)});
    var pre=document.createElement('pre');pre.id='i18n-extract';pre.textContent=JSON.stringify(out);document.body.appendChild(pre);
  }

  /* ---------------------------------------------------------------- startup */
  function finish(){
    if(done||!domReady||!langReady)return;
    done=true;clearTimeout(timer);
    if(extract)dump();
    else if(dict){try{translate()}catch(e){}}
    root.classList.remove('lang-wait');
    cbs.splice(0).forEach(function(cb){cb()});
  }
  function use(l){
    lang=l;root.lang=l;
    if(l==='en'){langReady=true;finish();return}
    fetch('i18n/'+l+'.json?v='+V).then(function(r){return r.ok?r.json():null}).then(function(d){if(!done)dict=d}).catch(function(){})
      .then(function(){if(!dict){lang='en';root.lang='en'}langReady=true;finish()});
  }
  function getJSON(url,ms){
    var ctl=window.AbortController?new AbortController():null,t=setTimeout(function(){if(ctl)ctl.abort()},ms);
    return fetch(url,ctl?{signal:ctl.signal}:{}).then(function(r){clearTimeout(t);return r.ok?r.json():null});
  }

  var timer=0;
  if(lang!=='en'){
    root.classList.add('lang-wait');
    // never keep the page hidden for long: show it in English if the network is slow
    timer=setTimeout(function(){dict=null;lang='en';root.lang='en';langReady=true;finish()},WAIT_MS+1500);
  }
  if(lang)use(lang);
  else{ // first visit: pick the language from the IP address (state), once
    getJSON(GEO,WAIT_MS).then(function(g){
      var l=fromGeo(g);
      if(g)put(KEY,l||'en'); // only remembered when the lookup worked, so a failed lookup is retried next page
      return l||fromBrowser();
    }).catch(fromBrowser).then(use);
  }
  document.addEventListener('DOMContentLoaded',function(){domReady=true;finish()});

  window.SFW={
    langs:LANGS,
    lang:function(){return lang},
    /** English text in app.js -> current language; {name} parts are filled from vars */
    t:function(s,vars){
      var v=(dict&&dict[s])||s;
      if(vars)v=v.replace(/\{(\w+)\}/g,function(m,k){return k in vars?vars[k]:m});
      return v;
    },
    ready:function(cb){if(done)cb();else cbs.push(cb)},
    setLang:function(l){if(!ok(l))return;put(KEY,l);
      if(asked)location.search=location.search.replace(/([?&])lang=[a-z]{2}\b&?/,'$1').replace(/[?&]$/,'');else location.reload()}
  };
})();
