/* Website visitor statistics: Google Analytics 4, free. It is the "Super Fit Women website" web stream of Firebase
   project super-fit-women, so app and website numbers sit in the same Analytics property (filter by stream).
   Analytics only: no ads, no Google signals, no ad personalisation.
   - EEA, UK and Switzerland: analytics_storage stays "denied" (we show no consent banner), so Google gets cookieless
     pings and sets no cookies there.
   - Off completely for: Global Privacy Control, the opt-out on privacy.html, localhost/file previews and the i18n
     extractor (?i18n=extract).
   - ?src=whatsapp (our share links) is reported as the campaign source, the same as utm_source=whatsapp.
   Events (also in README.md): page_view and scrolls/outbound clicks (automatic), share, sign_up (tester form),
   select_content (any element with data-track="name"). The language shown is sent as site_language.
   Loaded with defer on every page after lang.js; app.js calls SFWtrack(). Keep the CSP in every page in sync. */
(function(){
  'use strict';
  var ID='G-C91CLF6T0G',OFF='sfw-no-analytics';
  var EEA=['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT',
    'RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
  function optedOut(){try{return localStorage.getItem(OFF)==='1'}catch(e){return false}}
  var preview=location.protocol==='file:'||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var off=optedOut()||navigator.globalPrivacyControl===true||/[?&]i18n=extract\b/.test(location.search)||preview;
  window['ga-disable-'+ID]=off;

  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments)}

  /** SFWtrack('share',{method:'whatsapp'}): send one event (no-op when analytics is off) */
  window.SFWtrack=function(name,params){if(!off)gtag('event',name,params||{})};
  /** privacy.html: the "Turn off statistics" switch */
  window.SFWanalytics={
    off:function(){return off},
    set:function(enabled){
      try{if(enabled)localStorage.removeItem(OFF);else localStorage.setItem(OFF,'1')}catch(e){}
      off=!enabled||navigator.globalPrivacyControl===true;window['ga-disable-'+ID]=off;
      if(!enabled)['_ga','_ga_'+ID.slice(2)].forEach(function(c){
        document.cookie=c+'=; Max-Age=0; path=/';
        document.cookie=c+'=; Max-Age=0; path=/; domain=.'+location.hostname;
      });
    },
    gpc:navigator.globalPrivacyControl===true
  };
  if(off)return;

  var no={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
  gtag('consent','default',Object.assign({analytics_storage:'denied',region:EEA},no));
  gtag('consent','default',Object.assign({analytics_storage:'granted'},no));
  gtag('set','ads_data_redaction',true);
  gtag('js',new Date());

  function start(){
    var lang=window.SFW?SFW.lang():'en',loc=location.href;
    var src=(location.search.match(/[?&]src=([a-z0-9_-]{1,30})/i)||[])[1];
    if(src&&!/[?&]utm_source=/.test(loc))loc=loc.replace(/#.*$/,'')+'&utm_source='+src.toLowerCase()+'&utm_medium=share';
    gtag('set',{site_language:lang}); // sent with every event
    gtag('config',ID,{
      page_location:loc,
      allow_google_signals:false,
      allow_ad_personalization_signals:false
    });
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;
    document.head.appendChild(s);
  }
  // wait for lang.js so the page_view carries the language actually shown
  if(window.SFW)SFW.ready(start);else start();

  // data-track="name" on a link or button: one select_content event per click
  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest&&e.target.closest('[data-track]');
    if(el)window.SFWtrack('select_content',{content_type:el.getAttribute('data-track'),item_id:location.pathname.split('/').pop()||'index.html'});
  },true);
})();
