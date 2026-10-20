(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Communes (liste À CONFIRMER) + carte schématique ---------- */
var C=[['Grésy-sur-Aix',45.7227,5.9380,1],['Aix-les-Bains',45.6886,5.9153],['Mouxy',45.6840,5.9350],['Pugny-Chatenod',45.6950,5.9530],['Tresserve',45.6760,5.8990],['Drumettaz-Clarafond',45.6620,5.9220],['Méry',45.6400,5.9370],['Viviers-du-Lac',45.6510,5.8960],['Le Bourget-du-Lac',45.6460,5.8600],['Brison-Saint-Innocent',45.7250,5.8880],['La Biolle',45.7590,5.9280],['Saint-Offenge',45.7280,6.0000],['Entrelacs',45.7870,5.9460]];
var dl=$('#dl-communes');C.forEach(function(c){var o=document.createElement('option');o.value=c[0];dl.appendChild(o)});
/* dataLayer (GTM / GA4) */
window.dataLayer=window.dataLayer||[];
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="tel:"]');if(a)window.dataLayer.push({event:'click_to_call',call_location:a.dataset.loc||'autre',phone:'+33647823216'})});
(function map(){
  var W=600,H=690,lon0=5.80,lon1=6.04,lat1=45.815,k=W/(lon1-lon0),ky=k*1.42;
  function P(lat,lon){return[(lon-lon0)*k,(lat1-lat)*ky]}
  var lake=[[45.645,5.862],[45.655,5.875],[45.675,5.893],[45.695,5.899],[45.715,5.893],[45.74,5.882],[45.765,5.872],[45.79,5.866],[45.805,5.858],[45.809,5.85],[45.79,5.838],[45.765,5.835],[45.74,5.838],[45.71,5.845],[45.685,5.85],[45.665,5.848],[45.65,5.853]];
  var d='M'+lake.map(function(p){return P(p[0],p[1]).map(function(v){return v.toFixed(1)}).join(',')}).join(' L')+'Z';
  var g=P(45.7227,5.9380),s='';
  s+='<defs><pattern id="gr" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#E4E0D8" stroke-width="1"/></pattern></defs>';
  s+='<rect width="'+W+'" height="'+H+'" fill="url(#gr)"/>';
  s+='<path d="'+d+'" fill="#CFE0E6" stroke="#B5CDD6" stroke-width="1.5"/>';
  s+='<text x="'+(P(45.735,5.858)[0])+'" y="'+(P(45.735,5.858)[1])+'" font-family="Mono" font-size="11" fill="#5C7C88" letter-spacing="2" transform="rotate(-78 '+P(45.735,5.858).join(' ')+')">LAC DU BOURGET</text>';
  s+='<circle class="ring" cx="'+g[0]+'" cy="'+g[1]+'" r="210" fill="rgba(242,98,27,.06)" stroke="#F2621B" stroke-width="1.5" stroke-dasharray="6 6"/>';
  C.forEach(function(c){var p=P(c[1],c[2]);if(c[3])return;var right=c[2]>5.905;s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.5" fill="#16171B"/><text x="'+(p[0]+(right?9:-9))+'" y="'+(p[1]+4)+'" text-anchor="'+(right?'start':'end')+'" font-family="Inter" font-size="12.5" font-weight="600" fill="#16171B">'+c[0]+'</text>'});
  s+='<circle cx="'+g[0]+'" cy="'+g[1]+'" r="18" fill="rgba(242,98,27,.22)"><animate attributeName="r" values="12;24;12" dur="2.4s" repeatCount="indefinite"/></circle><circle cx="'+g[0]+'" cy="'+g[1]+'" r="8" fill="#F2621B" stroke="#fff" stroke-width="3"/>';
  s+='<g transform="translate('+(g[0]-75)+','+(g[1]-58)+')"><rect width="150" height="32" rx="16" fill="#16171B"/><text x="16" y="21" font-family="Inter" font-size="13" font-weight="700" fill="#fff">Bogey TP · Grésy</text></g>';
  s+='<text x="20" y="'+(H-20)+'" font-family="Mono" font-size="11" fill="#5A5B60">↓ CHAMBÉRY</text>';
  s+='<text x="'+(W-18)+'" y="'+(H-20)+'" text-anchor="end" font-family="Mono" font-size="10" fill="#7a7b80">CARTE SCHÉMATIQUE · RAYON À CONFIRMER</text>';
  $('#map').innerHTML='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid '+(innerWidth<821?'meet':'slice')+'" aria-hidden="true">'+s+'</svg>';
})();

/* ---------- Formulaire multi-étapes ---------- */
var TYPES=[['Terrassement','i-terr'],['VRD & réseaux','i-net'],['Eaux pluviales','i-drop'],['Enrobé / accès','i-road'],['Démolition','i-demo'],['Location de matériel','i-mach'],['Autre','i-dots']];
var SLOTS=['Dès que possible','Matin','Midi','Après-midi','Après 18 h','Samedi'];
var tw=$('#types');
TYPES.forEach(function(t,i){var l=document.createElement('label');l.className='opt';l.innerHTML='<input type="radio" name="type" value="'+t[0]+'"'+'><span><svg><use href="#'+t[1]+'"/></svg>'+t[0]+'</span>';tw.appendChild(l)});
var sw=$('#slots');
SLOTS.forEach(function(t,i){var l=document.createElement('label');l.className='opt';l.innerHTML='<input type="radio" name="slot" value="'+t+'"'+(i===0?' checked':'')+'><span>'+t+'</span>';sw.appendChild(l)});

var form=$('#q'),steps=$$('fieldset',form),cur=0,bars=$$('#prog i'),pl=$('#progL'),files=[];
function show(n,focus){steps.forEach(function(f,i){f.classList.toggle('on',i===n)});cur=n;bars.forEach(function(b,i){b.classList.toggle('on',i<=n)});pl.textContent='Étape '+(n+1)+' sur 4 · '+steps[n].dataset.label;if(focus){var e=steps[n].querySelector('input:not([type=radio]):not([type=file]),textarea,input[type=radio]:checked,input[type=radio]');if(e)try{e.focus({preventScroll:true})}catch(_){}}}
function err(el,msg){var w=el.closest('.fld');if(w){w.classList.toggle('err',!!msg);var m=w.querySelector('.err-msg');if(m)m.textContent=msg||''}}
function errK(k,msg){var m=form.querySelector('[data-err="'+k+'"]');if(m)m.textContent=msg||''}
var telRe=/^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
function valid(n){var ok=true;
  if(n===0){var t=form.querySelector('input[name=type]:checked');errK('type',t?'':'Choisissez un type de travaux.');ok=!!t}
  if(n===1){var c=$('#commune');var v=c.value.trim().length>=2;err(c,v?'':'Indiquez la commune du chantier.');ok=v}
  if(n===2){var d=$('#desc');var v2=d.value.trim().length>=10;err(d,v2?'':'Quelques mots sur le projet (10 caractères minimum).');ok=v2}
  if(n===3){var p=$('#tel');var v3=telRe.test(p.value.trim());err(p,v3?'':'Numéro invalide, ex. 06 12 34 56 78.');var r=$('#rgpd').checked;errK('rgpd',r?'':'Merci de cocher la case pour que l\'on puisse vous rappeler.');ok=v3&&r}
  return ok}
$$('[data-next]',form).forEach(function(b){b.addEventListener('click',function(){if(valid(cur))show(cur+1,true)})});
$$('[data-prev]',form).forEach(function(b){b.addEventListener('click',function(){show(cur-1,true)})});
form.addEventListener('change',function(e){if(e.target.name==='type')errK('type','');if(e.target.id==='rgpd')errK('rgpd','')});
form.addEventListener('input',function(e){var w=e.target.closest('.fld.err');if(w){w.classList.remove('err');var m=w.querySelector('.err-msg');if(m)m.textContent=''}});
form.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&cur<3){e.preventDefault();if(valid(cur))show(cur+1,true)}});
/* photos */
var pin=$('#photos'),th=$('#thumbs'),drop=$('#drop');
function addFiles(list){var msg='';Array.prototype.forEach.call(list,function(f){if(!/^image\//.test(f.type)){msg='Seules les images sont acceptées.';return}if(f.size>10*1024*1024){msg='« '+f.name+' » dépasse 10 Mo.';return}if(files.length>=5){msg='5 photos maximum.';return}files.push(f)});errK('photos',msg);th.innerHTML='';files.forEach(function(f){var i=new Image();i.alt=f.name;i.src=URL.createObjectURL(f);th.appendChild(i)});drop.querySelector('b').textContent=files.length?files.length+' photo'+(files.length>1?'s':'')+' ajoutée'+(files.length>1?'s':'')+' · en ajouter':'Ajouter des photos du terrain'}
pin.addEventListener('change',function(){addFiles(pin.files);pin.value=''});
['dragenter','dragover'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add('over')})});
['dragleave','drop'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove('over');if(ev==='drop'&&e.dataTransfer)addFiles(e.dataTransfer.files)})});
/* ================================================================
   FORM_ENDPOINT — adresse d'envoi du formulaire de devis.
   ⚠ PLACEHOLDER : remplacer « XXXXXXXX » par l'identifiant Formspree réel
   (https://formspree.io → New form → copier l'URL /f/…), ou par tout autre
   endpoint POST acceptant du multipart/form-data et répondant 2xx.
   Tant que le placeholder est présent, AUCUNE donnée n'est transmise :
   l'envoi échoue proprement (message d'erreur + numéro à appeler).
   Note : l'envoi de photos via Formspree nécessite une offre payante.
   ================================================================ */
var FORM_ENDPOINT='https://formspree.io/f/XXXXXXXX';
var ENDPOINT_READY=!/X{4,}/.test(FORM_ENDPOINT);
function sendLead(fd,files){
  if(!ENDPOINT_READY)return Promise.reject(new Error('FORM_ENDPOINT non configuré'));
  fd.delete('photos');files.forEach(function(f){fd.append('photos',f,f.name)});
  return fetch(FORM_ENDPOINT,{method:'POST',body:fd,headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r});
}
var sendBtn=$('#sendBtn'),sendErr=$('#sendErr');
form.addEventListener('submit',function(e){e.preventDefault();if(!valid(3))return;
  var fd=new FormData(form);sendErr.hidden=true;sendBtn.disabled=true;var lbl=sendBtn.textContent;sendBtn.textContent='Envoi en cours…';
  sendLead(new FormData(form),files).then(function(){sendBtn.disabled=false;sendBtn.textContent=lbl;done(fd)},function(err){sendBtn.disabled=false;sendBtn.textContent=lbl;sendErr.hidden=false;window.dataLayer.push({event:'quote_submit_error',error:String(err&&err.message||err)});if(window.console)console.warn('[Bogey TP] Envoi du devis impossible :',err&&err.message)});
});
function done(fd){window.dataLayer.push({event:'quote_submit',type_travaux:fd.get('type'),profil:fd.get('profil'),commune:fd.get('commune'),nb_photos:files.length,creneau:fd.get('slot')});var rows=[['Travaux',fd.get('type')],['Profil',fd.get('profil')],['Commune',fd.get('commune')],['Photos',files.length?files.length+' jointe(s)':'aucune'],['Téléphone',fd.get('tel')],['Rappel',fd.get('slot')]];
  $('#recap').innerHTML='';rows.forEach(function(r){var dt=document.createElement('dt');dt.textContent=r[0];var dd=document.createElement('dd');dd.textContent=r[1]||'—';$('#recap').appendChild(dt);$('#recap').appendChild(dd)});
  steps.forEach(function(f){f.classList.remove('on')});$('#thanks').classList.add('on');bars.forEach(function(b){b.classList.add('on')});pl.textContent='Demande envoyée';$('#thanks').focus({preventScroll:true});
  $('#devis').scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
}
$('#again').addEventListener('click',function(){form.reset();sendErr.hidden=true;files=[];th.innerHTML='';$('#thanks').classList.remove('on');$$('.fld.err').forEach(function(w){w.classList.remove('err')});form.querySelector('input[name=slot]').checked=true;show(0,true)});
function setType(v){var r=form.querySelector('input[name=type][value="'+v.replace(/"/g,'')+'"]');if(r){r.checked=true;errK('type','')}}
/* liens « Devis pour ce service » → formulaire pré-rempli */
$$('[data-type]').forEach(function(a){a.addEventListener('click',function(){setType(a.dataset.type);if(a.dataset.desc&&!$('#desc').value)$('#desc').value=a.dataset.desc;show(1,false);setTimeout(function(){$('#commune').focus({preventScroll:true})},600)})});
/* barre de devis du hero */
var prof='Particulier';
$$('.tabs button').forEach(function(b){b.addEventListener('click',function(){$$('.tabs button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-selected','false')});b.classList.add('on');b.setAttribute('aria-selected','true');prof=b.dataset.prof})});
$('#heroForm').addEventListener('submit',function(e){e.preventDefault();var hv=$('#hp').value;if(hv)setType(hv);var pr=form.querySelector('input[name=profil][value="'+prof+'"]');if(pr)pr.checked=true;var c=$('#hc').value.trim();if(c)$('#commune').value=c;var mob=innerWidth<821;show(mob||!hv?0:(c?2:1),false);$('#devis').scrollIntoView({behavior:RM?'auto':'smooth'});if(!mob&&hv)setTimeout(function(){(c?$('#desc'):$('#commune')).focus({preventScroll:true})},700)});

/* ---------- Vidéo « méthode » ---------- */
var vb=$('#vid'),vv=vb.querySelector('video');
/* source légère (720p) sur mobile ou Save-Data ; chargée seulement au premier clic */
var vLight=matchMedia('(max-width:820px)').matches||!!(navigator.connection&&navigator.connection.saveData);
if(vLight&&vv.dataset.posterM)vv.poster=vv.dataset.posterM;
function vSrc(){if(!vv.getAttribute('src')){vv.src=vLight?vv.dataset.srcM:vv.dataset.srcD}}
function tog(){vSrc();if(vv.paused){vv.play();vv.controls=false;vb.classList.add('playing')}else{vv.pause();vb.classList.remove('playing')}}
vb.addEventListener('click',tog);vb.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});

/* ---------- Header compact + barre mobile ---------- */
var mini=$('#mini'),st=$('#sticky'),bar=$('#heroForm'),dv=$('#devis'),ft=$('footer'),inForm=false,inFoot=false;
function vis(el){var r=el.getBoundingClientRect();return r.top<innerHeight-40&&r.bottom>40}
function upd(){var past=$('.panel').getBoundingClientRect().bottom<0;inForm=vis(dv);inFoot=vis(ft);mini.classList.toggle('show',past&&innerWidth>820);st.classList.toggle('show',past&&!inForm&&!inFoot&&!document.body.classList.contains('menu-open'));$$('a',mini).forEach(function(a){a.tabIndex=past?0:-1})}
addEventListener('scroll',upd,{passive:true});upd();

/* ---------- Google Maps : chargement uniquement au clic (aucun cookie avant) ---------- */
var GMAP_SRC='https://www.google.com/maps?q='+encodeURIComponent('Bogey TP, 549 Chemin des Bogeys, 73100 Grésy-sur-Aix')+'&z=14&output=embed&hl=fr';
var gb=$('#gmapBtn'),gm=$('#gmap'),mw=gm&&gm.closest('.map-wrap');
if(gb){gb.addEventListener('click',function(){var on=mw.classList.contains('on');
  if(!on){if(!gm.firstChild){var f=document.createElement('iframe');f.src=GMAP_SRC;f.title='Carte Google Maps : Bogey TP, 549 Chemin des Bogeys, Grésy-sur-Aix';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.allowFullscreen=true;gm.appendChild(f)}gm.hidden=false;mw.classList.add('on');gb.lastChild.textContent='Revenir au plan';window.dataLayer.push({event:'map_google_open'})}
  else{gm.hidden=true;mw.classList.remove('on');gb.lastChild.textContent='Afficher la carte Google'}
  gb.setAttribute('aria-expanded',String(!on))})}

/* ---------- Mentions légales / confidentialité (modales via :target) ---------- */
var lastFocus=null;
function lpSync(){var id=location.hash.slice(1),el=id&&document.getElementById(id),isLp=!!(el&&el.classList.contains('lp'));document.body.classList.toggle('lp-open',isLp);if(isLp){el.focus({preventScroll:true});el.scrollTop=0}else if(lastFocus){lastFocus.focus({preventScroll:true});lastFocus=null}}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-modal]');if(a&&!document.body.classList.contains('lp-open'))lastFocus=a;var x=e.target.classList&&e.target.classList.contains('lp')?e.target:null;if(x){e.preventDefault();closeLp()}});
function closeLp(){var y=scrollY;location.hash='';scrollTo(0,y);lpSync()}
$$('.lp-x').forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();closeLp()})});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('lp-open'))closeLp()});
addEventListener('hashchange',lpSync);lpSync();

/* ---------- vCard ---------- */
$('#vcard').addEventListener('click',function(){var v=['BEGIN:VCARD','VERSION:3.0','N:Bogey;Loïc;;;','FN:Loïc Bogey · Bogey TP','ORG:BOGEY TP','TITLE:Gérant','TEL;TYPE=WORK,VOICE:+33647823216','ADR;TYPE=WORK:;;549 chemin des Bogeys;Grésy-sur-Aix;;73100;France','GEO:45.722681;5.938029','URL:https://www.terrassement-bogeytp.fr/','NOTE:Terrassement · VRD · Démolition','END:VCARD'].join('\r\n');var b=new Blob([v],{type:'text/vcard;charset=utf-8'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='Bogey-TP.vcf';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);window.dataLayer.push({event:'save_contact'})});

/* ---------- Menu mobile ---------- */
var bg=$('#burger'),mm=$('#mmenu');
function menu(o){mm.hidden=!o;bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');bg.querySelector('use').setAttribute('href',o?'#i-close':'#i-menu');document.body.classList.toggle('menu-open',o);upd()}
bg.addEventListener('click',function(){menu(mm.hidden)});
$$('a',mm).forEach(function(a){a.addEventListener('click',function(){menu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape'&&!mm.hidden)menu(false)});

/* ---------- Vidéo hero : légère sur mobile, pas d'autoplay si Save-Data ou mouvement réduit ---------- */
(function(){var v=$('#heroVid'),sd=navigator.connection&&navigator.connection.saveData,mob=matchMedia('(max-width:820px)').matches;
 if(mob)v.poster=v.dataset.posterM;
 if(sd||RM){v.removeAttribute('autoplay');return}
 v.src=mob?v.dataset.srcM:v.dataset.srcD;v.autoplay=true;var p=v.play();if(p&&p.catch)p.catch(function(){});})();

/* ---------- Animations ---------- */
if(!window.gsap){document.documentElement.classList.add('no-gsap');return}
if(RM)return;
document.documentElement.classList.add('js-anim');
var tl=gsap.timeline({defaults:{ease:'expo.out'}});
tl.from('.eyebrow',{y:20,opacity:0,duration:.8})
  .from('h1 .l span',{yPercent:110,duration:1.2,stagger:.12},'-=.6')
  .from('.sub,.trust',{y:16,opacity:0,duration:.8,stagger:.08},'-=.8')
  .fromTo('.panel',{clipPath:'inset(34% 24% 0% 24% round 44px)'},{clipPath:'inset(0% 0% 0% 0% round 44px)',duration:1.6,ease:'power4.inOut'},'-=.9')
  .from('.panel video',{scale:1.25,duration:2.2,ease:'power3.out'},'<')
  .from('.bar',{y:40,opacity:0,duration:1},'-=1.2')
  .from('.chip',{y:18,opacity:0,stagger:.06,duration:.7},'-=.6')
  .from('.dot',{scale:0,stagger:.08,duration:.6,ease:'back.out(3)'},'-=1.4');
if(window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.batch('.rv',{start:'top 88%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:.9,stagger:.08,ease:'power3.out',overwrite:true})}});
  gsap.to('.panel video',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.panel',start:'top top',end:'bottom top',scrub:true}});
  $$('.gi img,.why-media img,.contact-x>img').forEach(function(im){gsap.fromTo(im,{scale:1.12},{scale:1,ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top bottom',end:'bottom top',scrub:true}})});
  gsap.from('#map circle.ring',{attr:{r:0},duration:1.6,ease:'power3.out',scrollTrigger:{trigger:'#map',start:'top 75%'}});
}else{document.documentElement.classList.remove('js-anim')}
})();
