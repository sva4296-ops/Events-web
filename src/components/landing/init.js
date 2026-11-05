import { toggleTheme } from "@/lib/theme";


/**
 * The landing page's behavior, ported from the design file: story thread, phone,
 * journey, tour, overlays. Returns a cleanup for timers and global listeners.
 */
export function initLanding(page){
  var timers=[],intervals=[];
  var setTimeout=function(f,d){var id=window.setTimeout(f,d);timers.push(id);return id};
  var setInterval=function(f,d){var id=window.setInterval(f,d);intervals.push(id);return id};
  var $=function(s,r){return (r||page).querySelector(s)},$$=function(s,r){return [].slice.call((r||page).querySelectorAll(s))};

  /* ---------- tipuri de eveniment ---------- */
  var T={
    nunta:{label:"Nuntă",top:"Vă invităm la nunta noastră",names:'Maria <span class="amp">&amp;</span> Andrei',plain:"Maria & Andrei",date:"Sâmbătă, 12 septembrie 2027",short:"12.09.2027",place:"Conacul Bellu · Urlați",fund:"Luna de miere în Grecia",yes:"Particip",img:"im01"},
    botez:{label:"Botez",top:"Vă invităm la botezul",names:"Sofia",plain:"Botezul Sofiei",date:"Duminică, 6 iunie 2027",short:"06.06.2027",place:"Biserica Sf. Nicolae · Galați",fund:"Fondul de viitor al Sofiei",yes:"Particip",img:"im02"},
    aniversare:{label:"Aniversare",top:"Sărbătorim împreună",names:'60 de ani <span class="amp">·</span> Bunica Ana',plain:"60 de ani · Bunica Ana",date:"Sâmbătă, 22 mai 2027",short:"22.05.2027",place:"Restaurant Grădina · Brașov",fund:"Excursia la Viena a bunicii",yes:"Vin cu drag",img:"im16"},
    cauza:{label:"Gală caritabilă",top:"Gală caritabilă",names:"Bal pentru Speranță",plain:"Bal pentru Speranță",date:"Vineri, 19 noiembrie 2027",short:"19.11.2027",place:"Palatul Parlamentului · București",fund:"Echipamente pentru pediatrie",yes:"Rezerv un loc",img:"im00"},
    corp:{label:"Corporate",top:"Invitație oficială",names:"Gala TechCorp",plain:"Gala TechCorp",date:"Joi, 9 decembrie 2027",short:"09.12.2027",place:"JW Marriott · București",fund:"Fondul de burse de studiu",yes:"Confirm prezența",img:"im03"},
    memorial:{label:"Comemorare",top:"În amintirea lui",names:"Ion Popescu",plain:"În amintirea lui Ion Popescu",date:"Duminică, 14 martie 2027",short:"14.03.2027",place:"Biserica Sf. Ilie · Ploiești",fund:"Bursa „Ion Popescu” pentru elevi",yes:"Voi fi prezent",img:""},
    alt:{label:"Eveniment",top:"Ești invitat",names:"Evenimentul nostru",plain:"Evenimentul nostru",date:"Sâmbătă, 1 mai 2027",short:"01.05.2027",place:"București",fund:"Fondul evenimentului",yes:"Particip",img:"im05"}
  };
  var memorialBg="radial-gradient(circle at 50% 58%,rgba(255,196,120,.45),rgba(255,196,120,.08) 18%,transparent 34%),linear-gradient(160deg,#3a3448,#1d1a26)";
  function setImg(el,cls){el.className=el.className.replace(/\bim\d\d\b/g,"").trim();if(cls){el.classList.add(cls);el.style.background=""}else{el.style.background=memorialBg}}

  /* ---------- HERO: firul ---------- */
  var stages=[
    {k:"Lansarea",t:"Totul începe cu o invitație vie",d:"Trimiți linkul sau QR-ul, invitații confirmă cu un tap, fără cont, fără aplicații. Tu vezi confirmările în timp real."},
    {k:"Parcursul",t:"Lunile dinainte devin o poveste",d:"Postezi momente din pregătiri, invitații reacționează și contribuie la ceva anume, nu bani într-un plic."},
    {k:"Ziua X",t:"Momentul culminant, trăit împreună",d:"Ecranul live din sală, pozele care curg în timp real de la toți invitații, prin QR."},
    {k:"Recap",t:"Povestea rămâne întreagă",d:"Albumul complet, cu toate pozele tuturor și tot parcursul, păstrat pentru totdeauna."}
  ];
  var pos=[0,33.333,66.666,100],thread=$("#thread"),sFill=$("#sFill"),cap=$("#caption"),views=$$(".view"),cur=0,timer=null,playing=true,DUR=5200;
  var SL=sFill.getTotalLength();sFill.style.strokeDasharray=SL;sFill.style.strokeDashoffset=SL;
  function at(p){var q=sFill.getPointAtLength(SL*p/100);return {l:(q.x/560*100)+"%",t:(q.y/90*100)+"%"}}
  [8,16,25,41,50,58,75,84,92].forEach(function(p){var m=document.createElement("span"),q=at(p);m.className="moment";m.dataset.p=p;m.style.left=q.l;m.style.top=q.t;thread.appendChild(m)});
  var nodes=stages.map(function(s,i){
    var b=document.createElement("button"),q=at(pos[i]);b.className="node";b.dataset.i=i;b.setAttribute("role","tab");b.setAttribute("aria-label",s.k);
    b.style.left=q.l;b.style.top=q.t;
    b.innerHTML='<span class="dot"><i></i></span><span class="lbl">'+s.k+"</span>";
    b.addEventListener("click",function(){go(i,true)});thread.appendChild(b);return b;
  });
  var moments=$$(".moment",thread);
  function go(i,user){
    cur=(i+4)%4;
    nodes.forEach(function(n,j){n.classList.toggle("active",j===cur);n.classList.toggle("done",j<cur);n.setAttribute("aria-selected",j===cur)});
    moments.forEach(function(m){m.classList.toggle("on",+m.dataset.p<=pos[cur])});
    sFill.style.strokeDashoffset=SL*(1-pos[cur]/100);
    cap.innerHTML='<div class="fade"><h3>'+stages[cur].t+"</h3><p>"+stages[cur].d+"</p></div>";
    views.forEach(function(v){v.classList.toggle("show",+v.dataset.v===cur)});
    if(cur===2)fillGrid();
    if(user)setPlaying(false);else restart();
  }
  function restart(){clearTimeout(timer);if(playing)timer=setTimeout(function(){go(cur+1)},DUR)}
  function setPlaying(p){playing=p;$("#playIcon").textContent=p?"❚❚":"▶";$("#playTxt").textContent=p?"Pauză":"Redă povestea";restart()}
  $("#play").addEventListener("click",function(){setPlaying(!playing);if(playing)go(cur+1)});

  /* pozele curg */
  var pics=["im04","im05","im06","im07","im08","im01","im00","im16","im02"],gridT=null,pc=312;
  function addPic(g,n){if(g.children.length>=9)g.removeChild(g.lastChild);var d=document.createElement("div");d.className="im "+pics[n%pics.length];g.insertBefore(d,g.firstChild)}
  function fillGrid(){
    var g=$("#pgrid");g.innerHTML="";clearInterval(gridT);var n=0;
    for(var i=0;i<9;i++)addPic(g,n++);
    gridT=setInterval(function(){if(cur!==2){clearInterval(gridT);return}addPic(g,n++);pc+=Math.ceil(Math.random()*3);$("#photoCount").textContent=pc},1000);
  }

  /* RSVP */
  var conf=86,yes=$("#yes"),no=$("#no");
  function pick(btn,other,isYes){
    if(btn.classList.contains("picked"))return;
    var wasYes=yes.classList.contains("picked");
    btn.classList.add("picked");other.classList.remove("picked");
    conf+=isYes?1:(wasYes?-1:0);$("#conf").textContent=conf;$("#confBar").style.width=(conf/120*100)+"%";setPlaying(false);
  }
  yes.addEventListener("click",function(){pick(yes,no,true)});
  no.addEventListener("click",function(){pick(no,yes,false)});
  $$(".heart").forEach(function(h){h.addEventListener("click",function(){var on=h.classList.toggle("on");h.querySelector("span").textContent=+h.dataset.n+(on?1:0);setPlaying(false)})});

  /* fond, partajat între telefon și secțiunea Contribuții */
  var fund={sum:5420,ppl:42,goal:8000};
  function fmt(n){return n.toLocaleString("ro-RO")}
  function renderFund(){
    var w=Math.min(100,fund.sum/fund.goal*100)+"%";
    $("#hfSum").textContent=fmt(fund.sum);$("#hfPpl").textContent=fund.ppl+" de invitați";$("#hfBar").style.width=w;
    $("#fcSum").textContent=fmt(fund.sum)+" lei";$("#fcPpl").textContent=fund.ppl+" de invitați au contribuit până acum";$("#fcBar").style.width=w;
    if(fund.sum>=fund.goal){$("#fcGo").textContent="Obiectiv atins ✓";$("#fcGo").disabled=true;$("#hfBtn").textContent="Obiectiv atins ✓"}
  }
  function contribute(a,who){
    if(fund.sum>=fund.goal)return;
    fund.sum=Math.min(fund.goal,fund.sum+a);fund.ppl++;renderFund();
    var r=$("#recent"),d=document.createElement("div");d.className="new";d.innerHTML="<span>"+who+"</span><span>"+a+" lei</span>";r.insertBefore(d,r.firstChild);
    if(r.children.length>4)r.removeChild(r.lastChild);
  }
  $("#hfBtn").addEventListener("click",function(){contribute(250,"Un invitat");if(fund.sum<fund.goal)this.textContent="Mulțumim! Mai contribui?";setPlaying(false)});
  var amt=300;
  $$("#amounts button").forEach(function(b){b.addEventListener("click",function(){$$("#amounts button").forEach(function(x){x.classList.remove("on")});b.classList.add("on");amt=+b.dataset.a;if(fund.sum<fund.goal)$("#fcGo").textContent="Contribuie "+amt+" lei"})});
  $("#fcGo").addEventListener("click",function(){contribute(amt,"Tu");if(fund.sum<fund.goal){var b=$("#fcGo");b.textContent="Mulțumim! ♥";setTimeout(function(){if(fund.sum<fund.goal)b.textContent="Contribuie "+amt+" lei"},1600)}});

  /* schimbă tipul de eveniment peste tot */
  function setType(k,scroll){
    var t=T[k];if(!t)return;
    $$("#heroTypes .chip").forEach(function(c){c.classList.toggle("on",c.dataset.t===k)});
    $("#invTop").textContent=t.top;$("#invNames").innerHTML=t.names;$("#evDate").textContent=t.date;$("#evPlace").textContent=t.place;
    $("#fundName").textContent=t.fund;yes.textContent=t.yes;
    $("#recapTitle").textContent=t.plain;$("#recapDate").textContent=t.short+" · păstrat pentru totdeauna";
    setImg($("#invPhoto"),t.img);setImg($("#recapCover"),k==="nunta"?"im08":t.img);
    if(scroll){if(window.innerWidth<1020)$(".stage").scrollIntoView({behavior:"smooth",block:"center"});else window.scrollTo({top:0,behavior:"smooth"})}
    go(0,true);
  }
  $$("#heroTypes .chip").forEach(function(c){c.addEventListener("click",function(){setType(c.dataset.t)})});
  $$(".ev").forEach(function(c){c.addEventListener("click",function(){setType(c.dataset.t,true)})});


  /* ---------- temă ---------- */
  $("#themeBtn").addEventListener("click",toggleTheme);

  /* ---------- parcursul pe luni ---------- */
  var J=[
    {when:"acum 12 luni",k:"−12 luni",n:"Logodna",img:"im01",t:"Ne-am logodit!",d:"Primul moment din poveste. Pagina e creată, iar familia și prietenii află vestea toți odată, nu pe zece grupuri de WhatsApp.",l:64,c:21,s:88,cw:"Tanti Lia",ct:"În sfârșit! Vă iubim, abia așteptăm! 💛",conf:0,fund:0},
    {when:"acum 10 luni",k:"−10 luni",n:"Locația",img:"im00",t:"Am găsit locul perfect",d:"Le arătați invitaților unde va fi petrecerea, cu hartă și sugestii de cazare pentru cei care vin din alte orașe.",l:41,c:9,s:102,cw:"Radu (prieten din facultate)",ct:"Arată superb. Rezerv deja cazarea!",conf:0,fund:0},
    {when:"acum 8 luni",k:"−8 luni",n:"Nașii",img:"im02",t:"Ei sunt nașii noștri",d:"Un moment care contează în România. Nașii primesc acces de co-organizatori și pot posta și ei în poveste.",l:38,c:14,s:110,cw:"Nașa Ioana",ct:"Ne-ați onorat! Suntem alături de voi la fiecare pas.",conf:0,fund:600},
    {when:"acum 6 luni",k:"−6 luni",n:"Invitațiile",img:"im05",t:"Invitațiile au plecat!",d:"Un link, un QR: invitația ajunge la toți. Confirmările vin cu un tap, fără cont. Fondul de contribuții se deschide.",l:57,c:18,s:120,cw:"Bunica Ana",ct:"Am apăsat pe „Particip”. Nepoata m-a ajutat. 😊",conf:86,fund:2900},
    {when:"acum 4 luni",k:"−4 luni",n:"Buchetul",img:"im07",t:"Am ales buchetul",d:"Pregătirile devin momente. Invitații nu doar află: reacționează, comentează, se simt parte din drum.",l:24,c:12,s:114,cw:"Elena",ct:"Bujorii ăștia! Exact stilul vostru.",conf:104,fund:4100},
    {when:"acum 2 luni",k:"−2 luni",n:"Tortul",img:"im06",t:"Degustarea de tort",d:"Cu cât se apropie ziua, cu atât povestea e mai vie. Reamintirile pentru cei care n-au confirmat pleacă automat.",l:52,c:16,s:117,cw:"Mihai P.",ct:"Votez pentru cel cu fistic! 🍰",conf:112,fund:5420},
    {when:"Ziua X",k:"Ziua X",n:"Nunta",img:"im08",t:"Ziua cea mare",d:"Ecranul live în sală, QR-ul pe mese. Peste 300 de poze urcate de invitați în aceeași seară, direct în poveste.",l:186,c:74,s:118,cw:"Familia Ionescu",ct:"Cea mai frumoasă nuntă la care am fost. Felicitări!",conf:118,fund:8000},
    {when:"după eveniment",k:"După",n:"Recap",img:"im04",t:"Povestea rămâne",d:"Albumul complet, cu 1.248 de poze de la toată lumea, plus tot parcursul, păstrat pentru totdeauna, de revăzut la fiecare aniversare.",l:203,c:58,s:120,cw:"Andrei",ct:"Mulțumim că ați fost parte din povestea noastră. ❤️",conf:118,fund:8000}
  ];
  var jFill=$("#jFill"),jTrack=$("#jTrack"),JL=jFill.getTotalLength(),jCur=0,jFr=[0,.135,.27,.41,.555,.7,.85,1];
  jFill.style.strokeDasharray=JL;jFill.style.strokeDashoffset=JL;
  var jNodes=J.map(function(m,i){
    var q=jFill.getPointAtLength(JL*jFr[i]),b=document.createElement("button");
    b.className="jn "+(q.y<115?"up":"down");b.style.left=(q.x/1200*100)+"%";b.style.top=(q.y/230*100)+"%";
    b.setAttribute("aria-label",m.n+", "+m.k);
    b.innerHTML='<span class="dot"><i></i></span><span class="lb"><small>'+m.k+"</small><span>"+m.n+"</span></span>";
    b.addEventListener("click",function(){jGo(i)});jTrack.appendChild(b);return b;
  });
  function count(el,to){var from=+(el.dataset.v||0),t0=performance.now();el.dataset.v=to;
    (function f(now){var p=Math.min(1,(now-t0)/600),v=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));el.textContent=fmt(v);if(p<1)requestAnimationFrame(f)})(t0)}
  function jGo(i,noScroll){
    jCur=Math.max(0,Math.min(J.length-1,i));var m=J[jCur];
    jNodes.forEach(function(n,k){n.classList.toggle("active",k===jCur);n.classList.toggle("done",k<jCur)});
    jFill.style.strokeDashoffset=JL*(1-jFr[jCur]);
    var img=$("#jImg");img.className="im "+m.img;img.classList.remove("swap");void img.offsetWidth;img.classList.add("swap");
    $("#jWhen").textContent=m.when;
    var post=$("#jPost");post.classList.remove("swap");void post.offsetWidth;post.classList.add("swap");
    $("#jTitle").textContent=m.t;$("#jText").textContent=m.d;$("#jCWho").textContent=m.cw;$("#jCText").textContent=m.ct;
    count($("#jLikes"),m.l);count($("#jComm"),m.c);count($("#jSeen"),m.s);
    count($("#mConf"),m.conf);$("#mConfBar").style.width=(m.conf/120*100)+"%";
    count($("#mFund"),m.fund);$("#mFundBar").style.width=(m.fund/8000*100)+"%";
    count($("#mMom"),[1,4,9,16,24,33,51,63][jCur]);
    $("#jPrev").disabled=jCur===0;$("#jNext").disabled=jCur===J.length-1;
    if(!noScroll){var sc=$("#jScroll"),n=jNodes[jCur];if(sc.scrollWidth>sc.clientWidth){sc.scrollTo({left:n.offsetLeft-sc.clientWidth/2,behavior:"smooth"})}}
  }
  $("#jPrev").addEventListener("click",function(){jGo(jCur-1)});
  $("#jNext").addEventListener("click",function(){jGo(jCur+1)});
  jGo(0,true);

  /* marquee Ziua X */
  var mq=$("#mq"),seq=["im04","im05","im06","im07","im08","im01","im16","im00","im02"];
  seq.concat(seq).forEach(function(c){var d=document.createElement("div");d.className="im "+c;mq.appendChild(d)});
  var lc=312;setInterval(function(){lc+=Math.ceil(Math.random()*2);$("#liveCount").textContent=lc},1800);

  /* FAQ */
  $$(".qa button").forEach(function(b){b.addEventListener("click",function(){b.parentNode.classList.toggle("open")})});
  $$(".qa")[0].classList.add("open");

  /* overlay-uri */
  var lastFocus=null;
  function openOv(id){
    $$(".ov.show").forEach(function(o){o.classList.remove("show")});
    var o=page.querySelector("#"+id);if(!o)return;
    lastFocus=document.activeElement;o.classList.add("show");o.scrollTop=0;document.body.style.overflow="hidden";
    setPlaying(false);endTour();
    setTimeout(function(){var c=$(".ov-close",o);if(c)c.focus()},50);
  }
  function closeOv(){$$(".ov.show").forEach(function(o){o.classList.remove("show")});document.body.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  $$("[data-ov]").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();openOv(b.dataset.ov)})});
  $$(".ov-close").forEach(function(b){b.addEventListener("click",closeOv)});

  /* creează: previzualizare live */
  var cType="nunta";
  function slug(s){return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"evenimentul-meu"}
  function renderPrev(){
    var t=T[cType];
    $("#pvType").textContent=t.label;$("#pvName").textContent=$("#fName").value||"Numele evenimentului";
    $("#pvMeta").textContent=($("#fDate").value||"Data")+" · "+($("#fPlace").value||"Locația");
    $("#pvMsg").textContent=$("#fMsg").value;
    setImg($("#pvPhoto"),t.img);
    $("#pvChips").innerHTML=$$("#cToggles .on").map(function(b){return "<span>"+b.dataset.s+"</span>"}).join("");
    $("#pvUrl").textContent="povesteanoastra.ro/"+slug($("#fName").value);
  }
  $$("#cTypes button").forEach(function(b){b.addEventListener("click",function(){
    $$("#cTypes button").forEach(function(x){x.classList.remove("on")});b.classList.add("on");cType=b.dataset.t;
    var t=T[cType];$("#fName").value=t.plain;$("#fDate").value=t.date.replace(/^[^,]+, /,"");$("#fPlace").value=t.place.replace(" · ",", ");renderPrev();
  })});
  $$("#cToggles button").forEach(function(b){b.addEventListener("click",function(){b.classList.toggle("on");renderPrev()})});
  ["#fName","#fDate","#fPlace","#fMsg"].forEach(function(s){$(s).addEventListener("input",renderPrev)});
  $("#copyBtn").addEventListener("click",function(){
    var b=$("#copyBtn"),txt="https://"+$("#pvUrl").textContent;
    if(navigator.clipboard)navigator.clipboard.writeText(txt).catch(function(){});
    b.textContent="Link copiat ✓";setTimeout(function(){b.textContent="Copiază linkul"},1600);
  });
  renderPrev();

  /* reveal la scroll */
  var io="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12}):null;
  $$(".reveal").forEach(function(el){if(io)io.observe(el);else el.classList.add("in")});
  var hdr=$("header"),onScroll=function(){hdr.classList.toggle("scrolled",window.scrollY>10)};window.addEventListener("scroll",onScroll,{passive:true});

  /* ---------- tur ghidat ---------- */
  var tour=[
    {sel:"#hero",t:"Firul poveștii",d:"Apasă pe etape (Lansarea, Parcursul, Ziua X, Recap) și vezi cum se schimbă telefonul. Poți confirma, da like și contribui direct din el."},
    {sel:"#dece",t:"De ce existăm",d:"Azi totul e împrăștiat: RSVP pe un site, pozele pe WhatsApp, banii în plic. Noi le punem la un loc, pe tot parcursul."},
    {sel:"#parcurs",t:"Parcursul pe luni",d:"Inima platformei. Apasă pe momentele de pe fir: vezi cum cresc reacțiile, confirmările și fondul, lună după lună."},
    {sel:"#evenimente",t:"Orice tip de eveniment",d:"Apasă pe un tip (botez, gală, comemorare) și pagina urcă la telefon, cu povestea schimbată pentru acel eveniment."},
    {sel:"#ziuax",t:"Ziua X",d:"Ecranul live din sală și QR-ul: invitații urcă pozele direct, toate ajung în album."},
    {sel:"#functii",t:"Toate uneltele",d:"De la feed și contribuții până la mese, meniu și furnizori, fără zece aplicații."},
    {sel:"#contributii",t:"Contribuții la un scop",d:"Alege o sumă și apasă „Contribuie”: bara crește aici și în telefonul de sus, iar numele apare în listă."},
    {sel:"#planneri",t:"Pentru event planneri",d:"Un panou pentru toate evenimentele agenției, cu brandul ei pe paginile clienților."},
    {sel:"#preturi",t:"Prețuri pe eveniment",d:"Plată unică, fără abonament. Orice „Alege” te duce în fluxul de creare, cu previzualizare live."}
  ];
  var ti=0,tOn=false,card=$("#tourCard");
  function showStep(){
    $$(".spot").forEach(function(e){e.classList.remove("spot")});
    var s=tour[ti],el=$(s.sel);
    if(el){el.scrollIntoView({behavior:"smooth",block:"start"});el.classList.add("spot")}
    $("#tStep").textContent=(ti+1)+" / "+tour.length;$("#tTitle").textContent=s.t;$("#tText").textContent=s.d;
    $("#tProg").style.width=((ti+1)/tour.length*100)+"%";
    $("#tPrev").style.visibility=ti?"visible":"hidden";$("#tNext").textContent=ti===tour.length-1?"Gata ✓":"Următorul →";
  }
  function startTour(){closeOv();tOn=true;ti=0;card.classList.add("show");$("#tourFab").style.display="none";setPlaying(false);showStep()}
  function endTour(){if(!tOn)return;tOn=false;card.classList.remove("show");$("#tourFab").style.display="";$$(".spot").forEach(function(e){e.classList.remove("spot")})}
  $("#tourFab").addEventListener("click",startTour);
  $("#tClose").addEventListener("click",endTour);
  $("#tNext").addEventListener("click",function(){if(ti<tour.length-1){ti++;showStep()}else endTour()});
  $("#tPrev").addEventListener("click",function(){if(ti>0){ti--;showStep()}});

  var onKey=function(e){
    if(e.key==="Escape"){if($(".ov.show"))closeOv();else endTour();return}
    if(e.target.tagName==="INPUT")return;
    if(tOn){if(e.key==="ArrowRight")$("#tNext").click();if(e.key==="ArrowLeft")$("#tPrev").click();return}
    if($(".ov.show"))return;
    if(e.key==="ArrowRight")go(cur+1,true);
    if(e.key==="ArrowLeft")go(cur-1,true);
  };
  document.addEventListener("keydown",onKey);

  go(0);

  return function(){
    timers.forEach(window.clearTimeout);intervals.forEach(window.clearInterval);clearTimeout(timer);clearInterval(gridT);
    if(io)io.disconnect();
    window.removeEventListener("scroll",onScroll);document.removeEventListener("keydown",onKey);
    document.body.style.overflow="";
  };
}
