(function(){
  "use strict";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav scroll state ---- */
  var nav = document.getElementById('nav');
  function onScroll(){
    if(window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    var first = document.getElementById('work');
    if(first && first.getBoundingClientRect().top > window.innerHeight * 0.55){
      document.querySelectorAll('.nav-links a').forEach(function(a){ a.classList.remove('active'); });
    }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  function setMenu(open){
    menu.classList.toggle('open', open);
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  toggle.addEventListener('click', function(){ setMenu(!menu.classList.contains('open')); });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setMenu(false); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && menu.classList.contains('open')){ setMenu(false); toggle.focus(); }
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 840 && menu.classList.contains('open')){ setMenu(false); }
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
    core: ['core', 'backend', 'integrations', 'security'],
    backend: ['backend', 'core', 'platforms', 'integrations', 'security', 'performance'],
    security: ['security', 'backend', 'core'],
    performance: ['performance', 'backend', 'platforms', 'core'],
    platforms: ['platforms', 'core', 'backend', 'performance'],
    integrations: ['integrations', 'core', 'backend'],
    supporting: ['supporting', 'backend', 'core'],
    secondary: ['secondary', 'platforms', 'supporting']
  };
  var chips = document.querySelectorAll('#ecoWrap .chip');
  var categories = document.querySelectorAll('#ecoWrap .eco-category, #ecoWrap .eco-secondary-wrap');

  function highlightEco(chip){
    var g = chip.getAttribute('data-group');
    var allow = related[g] || [g];

    chips.forEach(function(c){
      var cg = c.getAttribute('data-group');
      if(c === chip){
        c.classList.add('is-hovered');
        c.classList.remove('hl', 'dim');
      } else if(allow.indexOf(cg) !== -1){
        c.classList.add('hl');
        c.classList.remove('is-hovered', 'dim');
      } else {
        c.classList.add('dim');
        c.classList.remove('is-hovered', 'hl');
      }
    });

    categories.forEach(function(cat){
      var hasActive = cat.querySelector('.is-hovered, .hl');
      if(hasActive){
        cat.classList.add('cat-lit');
        cat.classList.remove('cat-dim');
      } else {
        cat.classList.add('cat-dim');
        cat.classList.remove('cat-lit');
      }
    });
  }

  function clearEco(){
    chips.forEach(function(c){
      c.classList.remove('hl', 'dim', 'is-hovered');
    });
    categories.forEach(function(cat){
      cat.classList.remove('cat-lit', 'cat-dim');
    });
  }

  chips.forEach(function(chip){
    chip.setAttribute('tabindex', '0');
    chip.addEventListener('mouseenter', function(){ highlightEco(chip); });
    chip.addEventListener('mouseleave', clearEco);
    chip.addEventListener('focus', function(){ highlightEco(chip); });
    chip.addEventListener('blur', clearEco);
  });

  if(!hasFinePointer){
    chips.forEach(function(chip){
      chip.addEventListener('click', function(ev){
        ev.stopPropagation();
        var isAlready = chip.classList.contains('is-hovered');
        clearEco();
        if(!isAlready){ highlightEco(chip); }
      });
    });
    document.addEventListener('click', clearEco);
  }

  /* ---- resume tabs (ARIA + arrow keys) ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.resume-tab'));
  function activateTab(tab, focus){
    tabs.forEach(function(t){
      var on = (t === tab);
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      document.getElementById(t.getAttribute('data-pane')).classList.toggle('active', on);
    });
    if(focus){ tab.focus(); }
  }
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){ activateTab(tab, false); });
    tab.addEventListener('keydown', function(e){
      var n = null;
      if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){ n = tabs[(i + 1) % tabs.length]; }
      else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ n = tabs[(i - 1 + tabs.length) % tabs.length]; }
      else if(e.key === 'Home'){ n = tabs[0]; }
      else if(e.key === 'End'){ n = tabs[tabs.length - 1]; }
      if(n){ e.preventDefault(); activateTab(n, true); }
    });
  });

  /* ---- contact form — Web3Forms submission ---- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', async function(e){
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

    try {
      var response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      var json = await response.json();
      if(response.ok && json.success){
        note.textContent = '✓ Message sent — I\'ll get back to you shortly!';
        note.classList.add('show', 'success');
        form.reset();
      } else {
        note.textContent = '✗ ' + (json.message || 'Something went wrong. Please email me directly at katariatarun786@gmail.com');
        note.classList.add('show', 'error');
      }
    } catch(err) {
      note.textContent = '✗ Network error. Please email me directly at katariatarun786@gmail.com';
      note.classList.add('show', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  });

  /* ---- webhook feed marquee content (signature element) ---- */
  var events = [
    {m:'POST', p:'/stripe/v1/webhook', s:'200', e:'signature.verified'},
    {m:'POST', p:'/api/sheets/append', s:'200', e:'access.row.inserted'},
    {m:'POST', p:'/cron/sheet.sync', s:'200', e:'wp_user.created'},
    {m:'POST', p:'/webhook/expedify', s:'200', e:'whatsapp.notified'},
    {m:'POST', p:'/ajax/contact.request', s:'200', e:'request.accepted'},
    {m:'POST', p:'/openai/chat', s:'200', e:'description.generated'},
    {m:'POST', p:'/webhook/woo/order', s:'200', e:'b2b.price_applied'},
    {m:'POST', p:'/api/pdf/brochure', s:'200', e:'brochure.generated'},
    {m:'POST', p:'/api/gd/frame', s:'200', e:'image.rendered'},
    {m:'POST', p:'/wp-json/wpjb/v1/job', s:'200', e:'job.draft_created'},
    {m:'POST', p:'/webhook/whatsapp', s:'200', e:'cta.sent'},
    {m:'POST', p:'/ajax/save.candidate', s:'200', e:'candidate.saved'}
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