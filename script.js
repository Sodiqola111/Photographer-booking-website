document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // Header + mobile navigation
  const header = $(".site-header"), menu = $(".menu-toggle"), nav = $(".nav");
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open);
    menu.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", scrollY > 50);
    $("#backTop").classList.toggle("show", scrollY > 600);
  });
  $("#backTop").addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));

  // Portfolio filtering + lightbox
  const items = $$(".gallery-item"), lightbox = $("#lightbox"), lbImg = $("#lightboxImage"), lbCap = $("#lightboxCaption");
  let visible = items, current = 0;
  $$(".filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active")); btn.classList.add("active");
    const filter = btn.dataset.filter;
    items.forEach(item => item.classList.toggle("hidden", filter !== "all" && item.dataset.category !== filter));
    visible = items.filter(i => !i.classList.contains("hidden"));
  }));
  const openLightbox = item => {
    visible = items.filter(i => !i.classList.contains("hidden"));
    current = visible.indexOf(item);
    showLightbox();
  };
  const showLightbox = () => {
    const img = visible[current].querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = visible[current].querySelector(".gallery-caption").textContent;
    lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  };
  items.forEach(i => i.addEventListener("click", () => openLightbox(i)));
  const closeLightbox = () => { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden","true"); document.body.style.overflow=""; };
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => { current=(current-1+visible.length)%visible.length; showLightbox(); });
  $("#lightboxNext").addEventListener("click", () => { current=(current+1)%visible.length; showLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if(e.key==="Escape") closeLightbox();
    if(e.key==="ArrowLeft") $("#lightboxPrev").click();
    if(e.key==="ArrowRight") $("#lightboxNext").click();
  });

  // Booking shortcuts
  $$(".text-link[data-service]").forEach(a => a.addEventListener("click", () => $("#service").value=a.dataset.service));
  $$(".package[data-package], .btn[data-package]").forEach(a => a.addEventListener("click", () => $("#package").value=a.dataset.package));

  // Demo availability calendar
  const calendar = $("#calendar"), monthLabel = $("#monthLabel"), dateInput = $("#date");
  let cursor = new Date(); cursor.setDate(1);
  const pad = n => String(n).padStart(2,"0");
  const unavailable = day => day % 7 === 0 || day % 11 === 0; // demo-only data
  function renderCalendar(){
    calendar.innerHTML="";
    monthLabel.textContent = cursor.toLocaleString("en-US",{month:"long",year:"numeric"});
    const first = new Date(cursor.getFullYear(),cursor.getMonth(),1).getDay();
    const days = new Date(cursor.getFullYear(),cursor.getMonth()+1,0).getDate();
    for(let i=0;i<first;i++){ const e=document.createElement("button"); e.className="empty"; e.disabled=true; calendar.appendChild(e); }
    for(let d=1;d<=days;d++){
      const b=document.createElement("button"); b.textContent=d;
      const value=`${cursor.getFullYear()}-${pad(cursor.getMonth()+1)}-${pad(d)}`;
      const today = new Date(); today.setHours(0,0,0,0);
      const cell = new Date(cursor.getFullYear(),cursor.getMonth(),d);
      if(cell<today || unavailable(d)){b.disabled=true;b.classList.add("unavailable")}
      b.addEventListener("click",()=>{dateInput.value=value; $$(".calendar button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");updateSummary()});
      calendar.appendChild(b);
    }
  }
  $("#prevMonth").addEventListener("click",()=>{cursor.setMonth(cursor.getMonth()-1);renderCalendar()});
  $("#nextMonth").addEventListener("click",()=>{cursor.setMonth(cursor.getMonth()+1);renderCalendar()});
  renderCalendar();

  // Dynamic booking summary
  const fields = ["name","service","package","date","time","location","message"];
  function updateSummary(){
    const vals = Object.fromEntries(fields.map(id=>[id,$("#"+id).value.trim()]));
    $("#summary").innerHTML = `<h3>Booking Summary</h3>
      <p><strong>Client:</strong> ${vals.name||"—"}</p>
      <p><strong>Service:</strong> ${vals.service||"—"} &nbsp; <strong>Package:</strong> ${vals.package||"—"}</p>
      <p><strong>Date:</strong> ${vals.date||"—"} &nbsp; <strong>Time:</strong> ${vals.time||"—"}</p>
      <p><strong>Location:</strong> ${vals.location||"—"}</p>
      <p><strong>Additional requirements:</strong> ${vals.message||"—"}</p>`;
  }
  fields.forEach(id=>$("#"+id).addEventListener("input",updateSummary));
  fields.forEach(id=>$("#"+id).addEventListener("change",updateSummary));

  function error(input,msg){ const small=input.parentElement.querySelector("small"); if(small) small.textContent=msg; input.setAttribute("aria-invalid","true"); }
  function clearErrors(){ $$(".booking-form small").forEach(s=>s.textContent=""); $$(".booking-form [aria-invalid]").forEach(i=>i.removeAttribute("aria-invalid")); }
  $("#bookingForm").addEventListener("submit", e=>{
    e.preventDefault(); clearErrors();
    let ok=true;
    const name=$("#name"), email=$("#email"), phone=$("#phone"), service=$("#service"), pkg=$("#package"), date=$("#date"), time=$("#time"), location=$("#location");
    if(!name.value.trim()){error(name,"Please enter your name.");ok=false}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){error(email,"Enter a valid email address.");ok=false}
    if(!/^[0-9+()\-.\s]{7,}$/.test(phone.value)){error(phone,"Enter a valid phone number.");ok=false}
    [service,pkg,date,time,location].forEach(i=>{if(!i.value){error(i,"This field is required.");ok=false}});
    const chosen = date.value ? new Date(date.value+"T00:00:00") : null;
    if(chosen && chosen < new Date(new Date().toDateString())){error(date,"Choose a future date.");ok=false}
    if(!$("#agreement").checked){$(".agreement-error").textContent="Please confirm the booking-request terms.";ok=false}
    const msg=$("#formMessage");
    if(ok){msg.className="form-message success";msg.textContent="Thank you. Your booking request has been received. We will contact you to confirm availability and payment details.";$("#bookingForm").reset();updateSummary();}
    else {msg.className="form-message error";msg.textContent="Please correct the highlighted fields and try again."}
  });

  // Testimonial carousel
  const testimonials=$$(".testimonial"); let ti=0;
  const showT=()=>testimonials.forEach((t,i)=>t.classList.toggle("active",i===ti));
  $("#prevTestimonial").addEventListener("click",()=>{ti=(ti-1+testimonials.length)%testimonials.length;showT()});
  $("#nextTestimonial").addEventListener("click",()=>{ti=(ti+1)%testimonials.length;showT()});

  // Contact demo form
  $("#contactForm").addEventListener("submit", e=>{e.preventDefault();const m=$("#contactMessage");m.className="form-message success";m.textContent="Your message is ready to be connected to an email/backend service.";e.target.reset()});
  $("#year").textContent=new Date().getFullYear();
});