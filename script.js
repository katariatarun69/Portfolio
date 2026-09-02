(function(){
  "use strict";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav scroll state ---- */
  var nav = document.getElementById('nav');
  function onScroll(){
    if(window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
  });

  /* ---- active section indicator ---- */
  var sections = ['work','about','experience','contact'].map(function(id){ return document.getElementById(id); }).filter(Boolean);
  var navAnchors = document.querySelectorAll('.nav-links a');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          navAnchors.forEach(function(a){
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    sections.forEach(function(s){ io.observe(s); });
  }

  /* ---- hero load-in ---- */
  var hero = document.querySelector('.hero');
  window.requestAnimationFrame(function(){
    setTimeout(function(){ hero.classList.add('loaded'); }, 150);
  });

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window && !reduceMotion){
    var rio = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, {threshold:0.12});
    revealEls.forEach(function(el){ rio.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- custom cursor ---- */
  var cursor = document.getElementById('cursor');
  var hasFinePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(hasFinePointer){
    window.addEventListener('mousemove', function(e){
      cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    }, {passive:true});
    document.querySelectorAll('a, button, summary, .chip').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('is-link'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('is-link'); });
    });
    document.querySelectorAll('.project-visual').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('is-view'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('is-view'); });
    });
  } else {
    cursor.style.display = 'none';
  }

  /* ---- magnetic buttons ---- */
  if(hasFinePointer && !reduceMotion){
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2) * 0.25;
        var y = (e.clientY - r.top - r.height/2) * 0.25;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
    });
  }

  /* ---- project case study toggles ---- */
  document.querySelectorAll('.project-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = document.getElementById(btn.getAttribute('data-target'));
      var open = target.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var label = btn.querySelector('.toggle-label');
      if(label){ label.textContent = open ? 'Hide the case study' : 'Read the case study'; }
    });
  });

  /* ---- skills ecosystem hover relationships ---- */
  var related = {
    core:['core','cms','api'],
    cms:['cms','core'],
    data:['data','core'],
    api:['api','core'],
    commerce:['commerce','core','data'],
    sec:['sec','core'],
    perf:['perf','core'],
    tools:['tools','core'],
    front:['front']
  };
  var chips = document.querySelectorAll('#ecoWrap .chip');
  chips.forEach(function(chip){
    chip.addEventListener('mouseenter', function(){
      var g = chip.getAttribute('data-group');
      var allow = related[g] || [g];
      chips.forEach(function(c){
        var cg = c.getAttribute('data-group');
        if(allow.indexOf(cg) !== -1){ c.classList.add('hl'); c.classList.remove('dim'); }
        else { c.classList.add('dim'); c.classList.remove('hl'); }
      });
    });
    chip.addEventListener('mouseleave', function(){
      chips.forEach(function(c){ c.classList.remove('hl'); c.classList.remove('dim'); });
    });
  });

  /* ---- resume tabs ---- */
  document.querySelectorAll('.resume-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.resume-tab').forEach(function(t){ t.classList.remove('active'); });
      document.querySelectorAll('.resume-pane').forEach(function(p){ p.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-pane')).classList.add('active');
    });
  });

  /* ---- contact form — Web3Forms submission ---- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var nameEl  = document.getElementById('f-name');
    var emailEl = document.getElementById('f-email');
    var msgEl   = document.getElementById('f-message');
    var btn     = document.getElementById('formSubmitBtn');
    var note    = document.getElementById('formNote');
    var ok = true;

    /* clear previous errors & note */
    document.getElementById('err-name').textContent    = '';
    document.getElementById('err-email').textContent   = '';
    document.getElementById('err-message').textContent = '';
    note.className = 'form-note';
    note.textContent = '';

    /* validate */
    if(!nameEl.value.trim()){
      document.getElementById('err-name').textContent = 'Please enter your name.'; ok = false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(emailEl.value.trim())){
      document.getElementById('err-email').textContent = 'Please enter a valid email.'; ok = false;
    }
    if(msgEl.value.trim().length < 10){
      document.getElementById('err-message').textContent = 'Message should be at least 10 characters.'; ok = false;
    }
    if(!ok) return;

    /* loading state */
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var data = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    })
    .then(function(res){ return res.json(); })
    .then(function(json){
      if(json.success){
        note.textContent = '✓ Message sent — I\'ll get back to you shortly!';
        note.classList.add('show', 'success');
        form.reset();
      } else {
        note.textContent = '✗ Something went wrong. Please email me directly at katariatarun786@gmail.com';
        note.classList.add('show', 'error');
      }
    })
    .catch(function(){
      note.textContent = '✗ Network error. Please email me directly at katariatarun786@gmail.com';
      note.classList.add('show', 'error');
    })
    .finally(function(){
      btn.disabled = false;
      btn.textContent = 'Send message';
    });
  });

  /* ---- webhook feed marquee content (signature element) ---- */
  var events = [
    {m:'POST', p:'/webhook/stripe', s:'200', e:'payment.succeeded'},
    {m:'POST', p:'/webhook/whatsapp', s:'200', e:'notification.sent'},
    {m:'POST', p:'/webhook/klaviyo', s:'200', e:'profile.subscribed'},
    {m:'GET',  p:'/wp-json/wp/v2/candidates', s:'200', e:'private=true'},
    {m:'POST', p:'/webhook/expedify', s:'200', e:'lead.created'},
    {m:'POST', p:'/api/sheets/append', s:'200', e:'row.inserted'},
    {m:'POST', p:'/webhook/stripe', s:'200', e:'checkout.completed'},
    {m:'GET',  p:'/wp-json/woocommerce/orders', s:'200', e:'order.synced'}
  ];
  function renderFeed(){
    var track = document.getElementById('feedTrack');
    var html = '';
    for(var loop=0; loop<2; loop++){
      events.forEach(function(ev){
        html += '<span class="feed-item"><span class="method">'+ev.m+'</span> '+ev.p+' <span class="sep">·</span> <span class="status">'+ev.s+'</span> <span class="sep">·</span> '+ev.e+'</span>';
      });
    }
    track.innerHTML = html;
  }
  renderFeed();

})();