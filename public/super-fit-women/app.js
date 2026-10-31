(function(){
  'use strict';
  // Refuse to render inside someone else's frame (clickjacking), for hosts that can't send X-Frame-Options.
  if(window.top!==window.self){try{window.top.location=window.self.location.href}catch(e){document.documentElement.style.display='none'}return}

  // T(text): English text -> the page language (lang.js, website/i18n/<lang>.json). Starts once the page is translated.
  var T=window.SFW?SFW.t:function(s,v){return v?s.replace(/\{(\w+)\}/g,function(m,k){return k in v?v[k]:m}):s};
  if(window.SFW)SFW.ready(init);else init();
  function init(){

  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO='IntersectionObserver' in window;
  function $$(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel))}
  function onView(els,cb,opts){
    if(!hasIO){els.forEach(function(el){cb(el,true)});return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){cb(e.target,e.isIntersecting,io)})},opts||{threshold:.15});
    els.forEach(function(el){io.observe(el)});
  }

  /* theme toggle */
  var root=document.documentElement,themeBtn=document.getElementById('themeBtn');
  try{var saved=localStorage.getItem('lw-theme');if(saved==='dark'||saved==='light')root.setAttribute('data-theme',saved)}catch(e){}
  if(themeBtn)themeBtn.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    var next=cur==='dark'?'light':'dark';root.setAttribute('data-theme',next);
    try{localStorage.setItem('lw-theme',next)}catch(e){}
  });
  var yr=document.getElementById('yr');if(yr)yr.textContent=String(new Date().getFullYear());

  /* mobile menu */
  var nav=document.querySelector('nav.top'),menu=document.getElementById('menuBtn');
  if(nav&&menu){
    var setMenu=function(open){nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',open?'true':'false');menu.setAttribute('aria-label',open?T('Close menu'):T('Open menu'))};
    menu.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
    $$('#links a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
    document.addEventListener('click',function(e){if(!nav.contains(e.target))setMenu(false)});
  }

  /* scroll reveal */
  var reveals=$$('.reveal');
  if(reduce||!hasIO)reveals.forEach(function(el){el.classList.add('in')});
  else onView(reveals,function(el,vis,io){if(vis){el.classList.add('in');io.unobserve(el)}},{threshold:.12});

  /* rotating headline words */
  $$('.rotator').forEach(function(r){
    var words=$$('span',r);if(!words.length)return;
    var i=0;words[0].classList.add('on');
    if(reduce||words.length<2)return;
    setInterval(function(){
      var cur=words[i];cur.classList.remove('on');cur.classList.add('out');
      i=(i+1)%words.length;var nxt=words[i];nxt.classList.remove('out');
      void nxt.offsetWidth;nxt.classList.add('on');
      setTimeout(function(){cur.classList.remove('out')},600);
    },2600);
  });

  /* count-up numbers */
  onView($$('[data-count]'),function(el,vis,io){
    if(!vis)return;io&&io.unobserve(el);
    var end=parseFloat(el.getAttribute('data-count'))||0,suffix=el.getAttribute('data-suffix')||'';
    if(reduce){el.textContent=end.toLocaleString()+suffix;return}
    var t0=null,dur=1400;
    (function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString()+suffix;if(p<1)requestAnimationFrame(step)})(performance.now());
  },{threshold:.6});

  /* marquee rows: duplicate the items once so the -50% loop is seamless */
  $$('.m-track').forEach(function(t){
    $$(':scope > *',t).forEach(function(n){var c=n.cloneNode(true);c.setAttribute('aria-hidden','true');$$('img',c).forEach(function(i){i.alt=''});t.appendChild(c)});
  });

  /* videos: play only while on screen, never with reduced motion */
  var vids=$$('video[data-autoplay]');
  vids.forEach(function(v){v.muted=true;v.setAttribute('muted','');v.playsInline=true;if(reduce){v.removeAttribute('autoplay');v.pause()}});
  if(!reduce)onView(vids,function(v,vis){
    if(v.closest('.st-phone'))return; // driven by the story
    if(vis){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause();
  },{threshold:.35});

  /* "see it in motion": three moments played like stories. Each clip runs once and its bar follows the clip; the end of a clip moves to the next moment. */
  function initStory(story){
    var tabs=$$('.st-tab',story),panels=$$('.st-panel',story),bars=$$('.st-bar',story),
        clips=$$('.st-phone video',story),cards=$$('.st-card',story),
        phone=story.querySelector('.st-phone'),pauseBtn=story.querySelector('.st-pause'),list=story.querySelector('.st-tabs'),
        n=clips.length,cur=0,seen=false,live=!reduce,userPaused=false,held=false,focusIn=false,raf=0;
    if(!n||!phone)return;

    function running(){return live&&seen&&!userPaused&&!held&&!document.hidden}
    function setP(p){story.style.setProperty('--p',p.toFixed(4))} // CSSOM, allowed by the CSP
    function frame(){
      var v=clips[cur];
      if(v.duration){var p=Math.min(1,v.currentTime/v.duration);setP(p);if(p>.5)clips[(cur+1)%n].preload='auto'}
      raf=requestAnimationFrame(frame);
    }
    function goStatic(){ // autoplay refused or a clip failed: posters + manual switching
      if(!live)return;live=false;cancelAnimationFrame(raf);
      story.classList.remove('is-live','is-paused','is-holding');story.style.removeProperty('--p');
      clips.forEach(function(c){c.pause()});
    }
    function sync(){
      cancelAnimationFrame(raf);
      var run=running();
      story.classList.toggle('is-paused',live&&!run);
      clips.forEach(function(c,j){
        if(run&&j===cur){c.preload='auto';var pr=c.play();if(pr&&pr.catch)pr.catch(function(e){if(e&&e.name==='NotAllowedError')goStatic()})}
        else if(!c.paused)c.pause();
      });
      if(run)raf=requestAnimationFrame(frame);
    }
    function tick(panel){
      $$('[data-tick]',panel).forEach(function(el){
        var end=+el.getAttribute('data-tick'),pre=el.getAttribute('data-pre')||'',suf=el.getAttribute('data-suf')||'',id=(el._tk||0)+1;el._tk=id;
        if(!live||!seen){el.textContent=pre+end+suf;return}
        var t0=0;
        (function step(t){if(el._tk!==id)return;if(!t0)t0=t;var p=Math.min(1,(t-t0)/900);
          el.textContent=pre+Math.round(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)})(performance.now());
      });
    }
    function go(i){
      cur=(i+n)%n;story.setAttribute('data-m',String(cur));
      tabs.forEach(function(t,j){var on=j===cur;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1});
      panels.forEach(function(p,j){p.classList.toggle('on',j===cur)});
      bars.forEach(function(b,j){b.classList.toggle('on',j===cur);b.classList.toggle('done',j<cur)});
      cards.forEach(function(c,j){var d=(j-cur+n)%n;c.classList.toggle('is-cur',d===0);c.classList.toggle('is-next',d===1);c.classList.toggle('is-prev',d===n-1)});
      clips.forEach(function(c,j){var on=j===cur;c.classList.toggle('on',on);if(on&&live){try{c.currentTime=0}catch(e){}}});
      if(live&&clips[cur].error)goStatic();
      if(live)setP(0);
      tick(panels[cur]);
      sync();
    }

    clips.forEach(function(c,j){
      c.loop=false;
      c.addEventListener('ended',function(){
        if(j!==cur||!live)return;
        if(focusIn){try{c.currentTime=0}catch(e){}sync();return} // keyboard focus inside: replay, don't rotate (APG)
        go(cur+1);
      });
      c.addEventListener('error',function(){if(j===cur)goStatic()}); // only the clip on screen can stop the story
    });

    tabs.forEach(function(t,j){
      t.addEventListener('click',function(){go(j)});
      t.addEventListener('keydown',function(e){
        var k=e.key,to=null;
        if(k==='ArrowRight'||k==='ArrowDown')to=j+1;else if(k==='ArrowLeft'||k==='ArrowUp')to=j-1;
        else if(k==='Home')to=0;else if(k==='End')to=n-1;
        if(to===null)return;e.preventDefault();go(to);tabs[cur].focus();
      });
    });
    cards.forEach(function(c,j){c.addEventListener('click',function(){go(j)})});

    if(live&&pauseBtn)pauseBtn.addEventListener('click',function(){
      userPaused=!userPaused;pauseBtn.classList.toggle('is-play',userPaused);
      pauseBtn.setAttribute('aria-label',userPaused?T('Play moments'):T('Pause moments'));sync();
    });

    // stories gestures: short tap = skip (left 35% goes back), press and hold = pause
    // gestures: hold = pause; horizontal swipe = next/previous; tap (click) = skip by side.
    // Taps use 'click' because browsers send none for a tap that only stops a scroll fling.
    var hT=0,down=false,x0=0,justHeld=false,swiped=false;
    phone.addEventListener('pointerdown',function(e){
      if(e.button>0)return;down=true;x0=e.clientX;justHeld=false;swiped=false;clearTimeout(hT);
      hT=setTimeout(function(){if(down&&live){held=true;story.classList.add('is-holding');sync()}},220);
    });
    function release(e,cancel){
      if(!down)return;down=false;clearTimeout(hT);
      if(held){held=false;justHeld=true;story.classList.remove('is-holding');sync();return}
      if(cancel)return;
      var dx=e.clientX-x0;
      if(Math.abs(dx)>24){swiped=true;go(dx<0?cur+1:cur-1)}
    }
    phone.addEventListener('pointerup',function(e){release(e,false)});
    phone.addEventListener('pointercancel',function(e){release(e,true)});
    phone.addEventListener('pointerleave',function(e){release(e,true)});
    phone.addEventListener('click',function(e){
      if(justHeld||swiped){justHeld=false;swiped=false;return}
      var r=phone.getBoundingClientRect();go(e.clientX-r.left<r.width*.35?cur-1:cur+1);
    });
    phone.addEventListener('contextmenu',function(e){e.preventDefault()});

    story.addEventListener('focusin',function(e){var fv=false;try{fv=e.target.matches(':focus-visible')}catch(x){}focusIn=fv&&e.target!==pauseBtn});
    story.addEventListener('focusout',function(e){if(!story.contains(e.relatedTarget))focusIn=false});
    document.addEventListener('visibilitychange',sync);

    var mq=window.matchMedia('(max-width:980px)');
    function orient(){if(list)list.setAttribute('aria-orientation',mq.matches?'horizontal':'vertical')}
    orient();if(mq.addEventListener)mq.addEventListener('change',orient);else if(mq.addListener)mq.addListener(orient);

    // Reduce Motion switched on while the page is open: stop the story
    var rmq=window.matchMedia('(prefers-reduced-motion: reduce)');
    function onRM(){if(rmq.matches)goStatic()}
    if(rmq.addEventListener)rmq.addEventListener('change',onRM);else if(rmq.addListener)rmq.addListener(onRM);

    if(live)story.classList.add('is-live');
    go(0);
    onView([phone],function(_,vis){var was=seen;seen=vis;if(vis&&!was)tick(panels[cur]);sync()},{threshold:.5}); // the phone, not the whole section: plays on landscape phones too
  }
  var storyEl=document.querySelector('.story');if(storyEl)initStory(storyEl);

  /* carousels: arrows, dots, autoplay (pauses on hover/touch/focus), coverflow active slide */
  $$('.carousel').forEach(function(c){
    var track=c.querySelector('.c-track'),slides=$$('.c-slide',c),dots=c.querySelector('.c-dots');
    if(!track||!slides.length)return;
    var active=0,timer=null,delay=parseInt(c.getAttribute('data-autoplay')||'0',10);
    if(dots)slides.forEach(function(_,i){
      var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',T('Go to slide {n}',{n:i+1}));
      b.addEventListener('click',function(){go(i,true)});dots.appendChild(b);
    });
    function go(i,user){
      i=(i+slides.length)%slides.length;var s=slides[i];
      track.scrollTo({left:s.offsetLeft-(track.clientWidth-s.clientWidth)/2,behavior:reduce?'auto':'smooth'});
      if(user)restart();
    }
    function mark(){
      var mid=track.scrollLeft+track.clientWidth/2,best=0,bd=1e9;
      slides.forEach(function(s,i){var d=Math.abs(s.offsetLeft+s.clientWidth/2-mid);if(d<bd){bd=d;best=i}});
      active=best;
      slides.forEach(function(s,i){s.classList.toggle('is-active',i===best)});
      if(dots)$$('button',dots).forEach(function(b,i){b.setAttribute('aria-current',i===best?'true':'false')});
      // in coverflow video carousels only the centred clip plays
      slides.forEach(function(s,i){var v=s.querySelector('video');if(!v||reduce)return;if(i===best){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()});
    }
    var raf=0;track.addEventListener('scroll',function(){cancelAnimationFrame(raf);raf=requestAnimationFrame(mark)},{passive:true});
    var prev=c.querySelector('.c-prev'),next=c.querySelector('.c-next');
    if(prev)prev.addEventListener('click',function(){go(active-1,true)});
    if(next)next.addEventListener('click',function(){go(active+1,true)});
    function stop(){if(timer){clearInterval(timer);timer=null}}
    function restart(){stop();if(delay&&!reduce)timer=setInterval(function(){go(active+1)},delay)}
    ['mouseenter','touchstart','focusin'].forEach(function(ev){c.addEventListener(ev,stop,{passive:true})});
    ['mouseleave','focusout'].forEach(function(ev){c.addEventListener(ev,restart)});
    if(c.classList.contains('cover')){var mid=Math.floor(slides.length/2);requestAnimationFrame(function(){track.scrollLeft=slides[mid].offsetLeft-(track.clientWidth-slides[mid].clientWidth)/2;mark()})}
    else mark();
    onView([c],function(_,vis){if(vis)restart();else stop()},{threshold:.3});
  });

  /* feature tabs (features page); the URL hash picks the first tab */
  var tabs=$$('.f-tab');
  if(tabs.length){
    var select=function(t,focus){
      tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on?'true':'false');x.tabIndex=on?0:-1;
        var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});
      if(focus)t.focus();
      if(history.replaceState)history.replaceState(null,'','#'+t.getAttribute('data-key'));
      $$('.reveal',document.getElementById(t.getAttribute('aria-controls'))).forEach(function(el){el.classList.add('in')});
    };
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){select(t)});
      t.addEventListener('keydown',function(e){
        if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length],true)}
      });
    });
    var key=(location.hash||'').slice(1),start=tabs.filter(function(t){return t.getAttribute('data-key')===key})[0]||tabs[0];
    select(start);
  }


  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function getKey(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function putKey(k,v){try{localStorage.setItem(k,v)}catch(e){}}

  /* language menu next to the theme button. Choosing a language saves it and reloads the page (lang.js). */
  var NAMES={en:['English','EN'],gu:['ગુજરાતી','ગુ'],hi:['हिन्दी','हि']};
  if(window.SFW&&themeBtn){
    var curLang=SFW.lang(),pick=document.createElement('div');pick.className='lang-pick';
    pick.innerHTML='<button class="lang-btn" type="button" aria-haspopup="true" aria-expanded="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span></span></button><div class="lang-menu" role="menu" hidden></div>';
    var langBtn=pick.firstChild,langMenu=pick.lastChild;
    langBtn.lastChild.textContent=NAMES[curLang][1];
    langBtn.setAttribute('aria-label',T('Language')+': '+NAMES[curLang][0]);
    langMenu.setAttribute('aria-label',T('Language'));
    SFW.langs.forEach(function(l){
      var o=document.createElement('button');o.type='button';o.lang=l;o.textContent=NAMES[l][0];
      o.setAttribute('role','menuitemradio');o.setAttribute('aria-checked',l===curLang?'true':'false');
      o.addEventListener('click',function(){if(l===curLang)openLang(false,true);else SFW.setLang(l)});
      langMenu.appendChild(o);
    });
    var langItems=$$('button',langMenu);
    var openLang=function(open,focusBtn){
      langMenu.hidden=!open;langBtn.setAttribute('aria-expanded',open?'true':'false');
      if(open)langItems[Math.max(0,SFW.langs.indexOf(curLang))].focus();else if(focusBtn)langBtn.focus();
    };
    langBtn.addEventListener('click',function(){openLang(langMenu.hidden)});
    langMenu.addEventListener('keydown',function(e){
      var i=langItems.indexOf(document.activeElement);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();langItems[(i+(e.key==='ArrowDown'?1:-1)+langItems.length)%langItems.length].focus()}
      else if(e.key==='Escape'){e.stopPropagation();openLang(false,true)}
      else if(e.key==='Tab')openLang(false);
    });
    document.addEventListener('click',function(e){if(!pick.contains(e.target)&&!langMenu.hidden)openLang(false)});
    themeBtn.parentNode.insertBefore(pick,themeBtn);
  }

  /* translated policy pages: say that the English text is the one that counts */
  var legal=document.querySelector('main.legal');
  if(legal&&window.SFW&&SFW.lang()!=='en'){
    var note=document.createElement('p'),toEn=document.createElement('button');
    note.className='lang-note';note.textContent=T('This page is translated for your convenience. If the translation differs from the English text, the English text applies.')+' ';
    toEn.type='button';toEn.className='inline-link';toEn.lang='en';toEn.textContent='Read in English';
    toEn.addEventListener('click',function(){SFW.setLang('en')});
    note.appendChild(toEn);
    var upd=legal.querySelector('.updated');
    if(upd)upd.parentNode.insertBefore(note,upd.nextSibling);else legal.insertBefore(note,legal.firstChild);
  }

  /* tester sign-up: one anonymous create in Cloud Firestore (testers collection), from the form on the home page
     (#tester) or the first-visit invite below. firestore.rules allow create only, so nobody can read the list from
     the web. Optional ?src=whatsapp on the link is saved as the source, to see which share worked. */
  // TEMPORARY: once TESTER_UNTIL passes, the section, its links and the invite go away on every page and the nav
  // button goes back to "Get the app". Firestore refuses sign-ups from the same moment.
  var TESTER_UNTIL=Date.parse('2026-12-01T00:00:00+05:30'),testerOpen=Date.now()<TESTER_UNTIL;
  if(!testerOpen){
    var ts=document.getElementById('tester');if(ts)ts.parentNode.removeChild(ts);
    $$('[data-tester]').forEach(function(a){
      if(a.getAttribute('data-tester')==='nav'){a.href='index.html#download';a.textContent=T('Get the app')}
      else a.parentNode.removeChild(a);
    });
  }
  var FS='projects/super-fit-women/databases/(default)/documents',JOINED='sfw-tester-joined',
      src=((location.search.match(/[?&]src=([^&]*)/)||[])[1]||'website').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,30)||'website';
  // Instant access (tools/testers/README.md › Automatic invites). With the group and opt-in links set, the success
  // screen shows them straight away, and TESTER_HOOK (the Apps Script mailer's web app URL) emails them, with the
  // automatic-Premium note, within seconds. All empty = the manual flow: "we'll email your invite within 1–2 days".
  var TESTER_GROUP_URL='',
      TESTER_OPTIN_URL='',
      TESTER_HOOK='',
      instant=!!(TESTER_GROUP_URL&&TESTER_OPTIN_URL);
  function instantDone(done){
    var link=function(href,label){return '<a class="btn btn-primary btn-sm" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>'};
    done.querySelector('h3').textContent=T("You're in! Get the app now");
    var ol=document.createElement('ol');ol.className='t-now';
    ol.innerHTML='<li><span>'+esc(T('Join our tester group: tap Join group, with the Google account on your phone.'))+'</span>'+link(TESTER_GROUP_URL,T('Join the tester group'))+'</li>'+
      '<li><span>'+esc(T('Open the test page, tap Become a tester, then install the app from Google Play.'))+'</span>'+link(TESTER_OPTIN_URL,T('Open the Google Play test page'))+'</li>';
    var p=done.querySelector('p');done.insertBefore(ol,p);
    p.textContent=T("We've also emailed you these links from askdevelopers001@gmail.com. Check your spam folder too.");
  }
  if(instant){var step=document.getElementById('tStepInvite');if(step)step.innerHTML='<span><b>'+esc(T('Get the app straight away:'))+'</b> '+
    esc(T('join our tester group and open the Google Play test page. We email you both links too.'))+'</span>'}
  function testerForm(tf,status,done,source,onDone){
    var btn=tf.querySelector('button[type=submit]'),label=btn.textContent;
    var fail=function(input,msg){status.textContent=msg;if(input){input.setAttribute('aria-invalid','true');input.focus()}};
    var newId=function(){
      var a=new Uint8Array(10);(window.crypto||window.msCrypto).getRandomValues(a);
      return Array.prototype.map.call(a,function(b){return('0'+b.toString(16)).slice(-2)}).join('');
    };
    $$('input',tf).forEach(function(i){i.addEventListener('input',function(){i.removeAttribute('aria-invalid');status.textContent=''})});
    tf.addEventListener('submit',function(e){
      e.preventDefault();
      if(btn.disabled)return;
      var f=tf.elements,email=f.email.value.trim().toLowerCase(),phone=f.phone?f.phone.value.trim():'',name=f.name?f.name.value.trim():'';
      if(f.website.value)return; // honeypot: bots fill every field
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return fail(f.email,T('Please enter a valid email address.'));
      if(!/^[+0-9 ()-]{0,20}$/.test(phone))return fail(f.phone,T('Please use only digits, spaces and + ( ) - in the phone number.'));
      if(!f.agree.checked)return fail(f.agree,T('Please tick the box to confirm.'));
      var fields={email:{stringValue:email},source:{stringValue:source}};
      if(phone)fields.phone={stringValue:phone};
      if(name)fields.name={stringValue:name.slice(0,60)};
      btn.disabled=true;btn.textContent=T('Sending…');status.textContent='';
      fetch('https://firestore.googleapis.com/v1/'+FS+':commit',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({writes:[{
          update:{name:FS+'/testers/'+newId(),fields:fields},
          currentDocument:{exists:false},
          updateTransforms:[{fieldPath:'createdAt',setToServerValue:'REQUEST_TIME'}]
        }]})
      }).then(function(r){
        if(!r.ok)throw new Error(String(r.status));
        putKey(JOINED,'1');
        if(TESTER_HOOK)fetch(TESTER_HOOK,{method:'POST',mode:'no-cors',keepalive:true}).catch(function(){}); // wake the mailer now
        if(instant)instantDone(done);
        tf.hidden=true;done.hidden=false;done.focus();
        if(onDone)onDone();
      }).catch(function(err){
        btn.disabled=false;btn.textContent=label;
        fail(null,err&&err.message==='403'?T('Please check your details and try again.'):T("We couldn't send that. Check your connection and try again, or email askdevelopers001@gmail.com."));
      });
    });
  }
  var tf=document.getElementById('testerForm');
  if(tf)testerForm(tf,document.getElementById('testerStatus'),document.getElementById('testerDone'),src);

  // First visit: invite to the test once, a few seconds after the page opens (not on policy pages, not to people who
  // already joined). "First visit" is remembered in the browser, not by IP address: mobile networks put many
  // people behind one IP, so an IP check would skip most real first-time visitors.
  var ASKED='sfw-tester-asked';
  function invite(){
    if(document.hidden){document.addEventListener('visibilitychange',invite,{once:true});return}
    if(getKey(ASKED)||getKey(JOINED))return;
    putKey(ASKED,String(Date.now()));
    var sec=document.getElementById('tester'),r=sec&&sec.getBoundingClientRect();
    if(r&&r.top<innerHeight&&r.bottom>0)return; // already looking at the sign-up form
    if(document.querySelector('dialog[open]'))return;
    var d=document.createElement('dialog');d.className='t-pop';d.setAttribute('aria-labelledby','tpop-h');
    d.innerHTML='<div class="t-pop-in">'+
      '<button class="t-pop-x" type="button" aria-label="'+esc(T('Close'))+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'+
      '<span class="t-pop-ic" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>'+
      '<p class="overline">'+esc(T('Early access · 15-day tester program'))+'</p>'+
      '<h2 id="tpop-h">'+esc(T('Be one of our first testers'))+'</h2>'+
      '<p class="t-pop-lead">'+esc(T('Get Super Fit Women before it reaches Google Play. Try it with 1 month of Premium free, and tell us what to improve.'))+'</p>'+
      '<form novalidate>'+
        '<label class="field"><span>'+esc(T('Google account email'))+'</span><input type="email" name="email" maxlength="120" autocomplete="email" inputmode="email" placeholder="you@gmail.com" required><small>'+esc(T('The account you use for the Play Store on your Android phone.'))+'</small></label>'+
        '<label class="hp" aria-hidden="true">Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>'+
        '<label class="check"><input type="checkbox" name="agree" required><span>'+esc(T('I have an Android phone, and I agree to be contacted about the test.'))+' <a class="inline-link" href="privacy.html#testers">'+esc(T('Privacy policy'))+'</a></span></label>'+
        '<button class="btn btn-primary" type="submit">'+esc(T('Join the test'))+'</button>'+
        '<p class="t-status" role="status" aria-live="polite"></p>'+
      '</form>'+
      '<div class="t-done" hidden tabindex="-1"><span class="t-done-ic" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>'+
        '<h3>'+esc(T("You're on the list!"))+'</h3><p>'+esc(T("We'll email your invite link within 1–2 days from askdevelopers001@gmail.com. Check your spam folder too."))+'</p></div>'+
      '<button class="t-pop-later" type="button">'+esc(T('Not now'))+'</button>'+
    '</div>';
    document.body.appendChild(d);
    var form=d.querySelector('form'),later=d.querySelector('.t-pop-later');
    testerForm(form,d.querySelector('.t-status'),d.querySelector('.t-done'),(src+'-popup').slice(0,40),function(){later.textContent=T('Close')});
    var close=function(){d.close()};
    d.querySelector('.t-pop-x').addEventListener('click',close);
    later.addEventListener('click',close);
    d.addEventListener('click',function(e){if(e.target===d)close()}); // tap outside the card
    d.addEventListener('close',function(){d.parentNode.removeChild(d)});
    d.showModal();
  }
  // no storage (blocked in some private modes): it couldn't remember the invite was shown, so don't show it at all
  var canStore=function(){try{localStorage.setItem('sfw-t','1');localStorage.removeItem('sfw-t');return true}catch(e){return false}};
  if(testerOpen&&canStore()&&!getKey(ASKED)&&!getKey(JOINED)&&!legal&&location.hash!=='#tester'&&typeof HTMLDialogElement==='function')
    setTimeout(invite,3500);
  }
})();
