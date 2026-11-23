// Ad breaks for the website mini game, via Google's Ad Placement API (AdSense for H5 games).
// LPAds.next(name, done)       a short ad between rounds; done() always runs (ad shown or not)
// LPAds.reward(name, handlers) an optional "watch an ad for a reward"; handlers.available(show) only fires
//                              when an ad is ready, so the button is never shown without an ad behind it.
// With no publisher ID in ads-config.js nothing is loaded and both calls fall straight through.
// Local preview only: add ?adsdemo to the URL to see the flow with a stand-in break (no real ad, no Google).
(function () {
  'use strict';
  var cfg = window.LP_ADS || {};
  var on = /^ca-pub-\d{10,20}$/.test(cfg.client || '');
  var demo = !on && /[?&]adsdemo\b/.test(location.search) && /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
  window.adsbygoogle = window.adsbygoogle || [];
  function push(o) { window.adsbygoogle.push(o); }
  function mute(m) { document.dispatchEvent(new CustomEvent('lp:ad', { detail: { playing: m } })); }

  if (on) {
    var s = document.createElement('script');
    s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.client);
    s.setAttribute('data-ad-frequency-hint', cfg.frequency || '90s');
    if (cfg.test) s.setAttribute('data-adbreak-test', 'on');
    document.head.appendChild(s);
    push({ preloadAdBreaks: 'on', sound: 'on' }); // adConfig
  }

  // a calm stand-in so the owner can review the flow locally before AdSense is live
  function demoBreak(label, ms, cb) {
    var d = document.createElement('div');
    d.className = 'ad-demo';
    d.innerHTML = '<div><small>Ad break preview</small><b>' + label + '</b><span>A real Google ad plays here once AdSense is switched on.</span><i></i></div>';
    document.body.appendChild(d);
    mute(true);
    setTimeout(function () { d.remove(); mute(false); cb(); }, ms);
  }

  window.LPAds = {
    enabled: on || demo,
    next: function (name, done) {
      if (demo) return demoBreak('Between rounds', 2200, done);
      if (!on) return done();
      push({ type: 'next', name: name,
        beforeAd: function () { mute(true); }, afterAd: function () { mute(false); },
        adBreakDone: function () { done(); } });
    },
    reward: function (name, h) {
      if (demo) { h.available(function () { demoBreak('Rewarded ad', 2600, function () { h.viewed(); if (h.done) h.done(); }); }); return; }
      if (!on) { if (h.done) h.done({ breakStatus: 'notReady' }); return; }
      push({ type: 'reward', name: name,
        beforeAd: function () { mute(true); }, afterAd: function () { mute(false); },
        beforeReward: function (showAdFn) { h.available(showAdFn); },
        adViewed: function () { h.viewed(); },
        adDismissed: function () { if (h.dismissed) h.dismissed(); },
        adBreakDone: function (info) { if (h.done) h.done(info); } });
    }
  };
})();
