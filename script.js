const PRODUCTS = [
 {id:1,name:"Mogra Bloom Jhumkas",category:"Earrings",price:499,old:599},
 {id:2,name:"Sona Lotus Studs",category:"Earrings",price:299},
 {id:3,name:"Gulab Statement Drops",category:"Earrings",price:549,old:649},
 {id:4,name:"Nakshi Pearl Choker",category:"Necklaces",price:899,old:999},
 {id:5,name:"Madhubani Long Necklace",category:"Necklaces",price:1199},
 {id:6,name:"Kumud Gold Collar",category:"Necklaces",price:749,old:899},
 {id:7,name:"Rani Silk Thread Bangles",category:"Bangles",price:399},
 {id:8,name:"Meher Stack Bangles",category:"Bangles",price:499,old:599},
 {id:9,name:"Rajwada Bridal Set",category:"Bridal",price:1899,old:2299},
 {id:10,name:"Gauri Temple Bridal Set",category:"Bridal",price:2199},
 {id:11,name:"Maya Floral Drops",category:"Earrings",price:349},
 {id:12,name:"Arohi Antique Necklace",category:"Necklaces",price:999,old:1199}
];

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with your WhatsApp number, e.g. 919876543210
let cart = JSON.parse(localStorage.getItem("nn-cart") || "[]");
const $ = s => document.querySelector(s);

function money(n){return "₹"+n.toLocaleString("en-IN")}
function save(){localStorage.setItem("nn-cart",JSON.stringify(cart));renderCart()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

function productCard(p){
  const discount = p.old ? Math.round((1-p.price/p.old)*100) : 0;
  return `<article class="product-card">
    <div class="product-image">${discount?`<span class="badge">${discount}% off</span>`:""}<button class="heart" aria-label="Wishlist">♡</button></div>
    <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div><span class="price">${money(p.price)}</span>${p.old?`<span class="old-price">${money(p.old)}</span>`:""}</div>
    <button class="add" data-add="${p.id}">Add to bag</button></div>
  </article>`
}
function renderProducts(filter="All"){
  const list=filter==="All"?PRODUCTS:PRODUCTS.filter(p=>p.category===filter);
  $("#productGrid").innerHTML=list.map(productCard).join("");
}
function renderCart(){
  const count=cart.reduce((a,x)=>a+x.qty,0); $("#cartCount").textContent=count;
  if(!cart.length){$("#cartItems").innerHTML='<div class="empty">Your bag is waiting for something beautiful.</div>';$("#cartTotal").textContent="₹0";return}
  $("#cartItems").innerHTML=cart.map(x=>`<div class="cart-row"><div class="mini-img">✦</div><div><h4>${x.name}</h4><div>${money(x.price)}</div><div class="qty"><button data-minus="${x.id}">−</button><span>${x.qty}</span><button data-plus="${x.id}">+</button></div></div><button class="remove" data-remove="${x.id}">Remove</button></div>`).join("");
  $("#cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
function add(id){const p=PRODUCTS.find(x=>x.id===id);const existing=cart.find(x=>x.id===id);if(existing)existing.qty++;else cart.push({...p,qty:1});save();toast("Added to your bag");openCart()}
function openCart(){$("#cartDrawer").classList.add("open");$("#backdrop").classList.add("open")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#backdrop").classList.remove("open")}

document.addEventListener("click",e=>{
 const addBtn=e.target.closest("[data-add]"); if(addBtn){add(+addBtn.dataset.add);return}
 const plus=e.target.closest("[data-plus]"); if(plus){const x=cart.find(i=>i.id==plus.dataset.plus);x.qty++;save();return}
 const minus=e.target.closest("[data-minus]"); if(minus){const x=cart.find(i=>i.id==minus.dataset.minus);x.qty--;if(x.qty<=0)cart=cart.filter(i=>i.id!=minus.dataset.minus);save();return}
 const rem=e.target.closest("[data-remove]"); if(rem){cart=cart.filter(i=>i.id!=rem.dataset.remove);save();return}
 const cat=e.target.closest("[data-category]"); if(cat){setFilter(cat.dataset.category);document.querySelector("#shop").scrollIntoView();return}
});
function setFilter(f){document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));renderProducts(f)}

document.querySelectorAll(".filter-chip").forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#backdrop").onclick=closeCart;
$("#menuBtn").onclick=()=>$("#mobileNav").classList.toggle("open");
document.querySelectorAll(".mobile-nav a").forEach(a=>a.onclick=()=>$("#mobileNav").classList.remove("open"));

$("#searchBtn").onclick=()=>{$("#searchOverlay").classList.add("open");$("#searchInput").focus()}
$("#closeSearch").onclick=()=>$("#searchOverlay").classList.remove("open");
$("#searchInput").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase().trim();const results=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q));
 $("#searchResults").innerHTML=q?results.map(p=>`<div class="search-result"><span>${p.name}</span><b>${money(p.price)}</b></div>`).join(""):"";
});

$("#checkoutBtn").onclick=()=>{if(!cart.length){toast("Your bag is empty");return}$("#checkoutModal").classList.add("open");closeCart()}
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("open");
$("#checkoutForm").onsubmit=e=>{
 e.preventDefault(); const fd=new FormData(e.target);
 let msg=`Hello Nandita Nakshi! I want to place an order.%0A%0A`;
 cart.forEach(x=>msg+=`${x.name} × ${x.qty} — ${money(x.price*x.qty)}%0A`);
 msg+=`%0ATotal: ${money(cart.reduce((a,x)=>a+x.price*x.qty,0))}%0A%0AName: ${fd.get("name")}%0APhone: ${fd.get("phone")}%0AAddress: ${fd.get("address")}%0ANote: ${fd.get("note")||"-"}`;
 if(WHATSAPP_NUMBER.includes("X")){alert("Replace WHATSAPP_NUMBER in script.js with your business WhatsApp number first.");return}
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
 cart=[];save();$("#checkoutModal").classList.remove("open");toast("Order message prepared");
};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();toast("You're on the list ✦");e.target.reset()}
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
