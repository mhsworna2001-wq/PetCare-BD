/* ===== PETCARE BANGLADESH — app.js ===== */

// ============================================================
// LANGUAGE SYSTEM
// ============================================================
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);

  // Update all elements with data-en / data-bn
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
    if (txt !== null) el.innerHTML = txt;
  });

  // Placeholder updates
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    el.placeholder = lang === 'bn' ? el.getAttribute('data-bn-placeholder') : el.getAttribute('data-en-placeholder');
  });

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent.trim() === (lang === 'bn' ? 'বাং' : 'EN')));
  const btnEN = document.getElementById('btnEN');
  const btnBN = document.getElementById('btnBN');
  if (btnEN) btnEN.classList.toggle('active', lang === 'en');
  if (btnBN) btnBN.classList.toggle('active', lang === 'bn');
}

// ============================================================
// AUTH
// ============================================================
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if (!email || !pass) { showToast('Please fill in both fields! / দুটি ঘর পূরণ করুন!', 'error'); return; }
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  showSection('home');
  showToast('Welcome to PetCare Bangladesh! 🐾', 'success');
}

function doLogout() {
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value = '';
}

// Allow Enter key on login
document.addEventListener('DOMContentLoaded', () => {
  const loginPass = document.getElementById('loginPass');
  if (loginPass) loginPass.addEventListener('keypress', e => { if (e.key === 'Enter') doLogin(); });
  const loginEmail = document.getElementById('loginEmail');
  if (loginEmail) loginEmail.addEventListener('keypress', e => { if (e.key === 'Enter') document.getElementById('loginPass').focus(); });
  initApp();
});

// ============================================================
// NAVIGATION
// ============================================================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active-section');
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.getAttribute('onclick') && l.getAttribute('onclick').includes(`'${id}'`)) l.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Close mobile nav
  document.getElementById('navLinks').classList.remove('open');
  // Trigger health bars animation on dashboard
  if (id === 'dashboard') animateHealthBars();
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function filterMarket(type) {
  document.getElementById('filterType').value = type;
  showSection('marketplace');
  applyFilters();
}

// ============================================================
// DATA
// ============================================================
const petsData = [
  { id:1, name:'Bruno', emoji:'🐶', type:'dog', breed:'German Shepherd', price:15000, location:'Dhaka', age:'2 years', gender:'Male', badge:'Vaccinated' },
  { id:2, name:'Mia', emoji:'🐱', type:'cat', breed:'Persian', price:8000, location:'Chittagong', age:'1 year', gender:'Female', badge:'Purebred' },
  { id:3, name:'Tweety', emoji:'🦜', type:'bird', breed:'Love Bird', price:3500, location:'Sylhet', age:'6 months', gender:'Male', badge:'Tamed' },
  { id:4, name:'Nemo', emoji:'🐟', type:'fish', breed:'Clownfish', price:1200, location:'Dhaka', age:'3 months', gender:'N/A', badge:'Rare' },
  { id:5, name:'Snowball', emoji:'🐰', type:'rabbit', breed:'Dutch', price:4500, location:'Rajshahi', age:'8 months', gender:'Female', badge:'Friendly' },
  { id:6, name:'Leo', emoji:'🐶', type:'dog', breed:'Golden Retriever', price:25000, location:'Dhaka', age:'3 years', gender:'Male', badge:'Show Quality' },
  { id:7, name:'Luna', emoji:'🐱', type:'cat', breed:'Siamese', price:12000, location:'Khulna', age:'2 years', gender:'Female', badge:'Vaccinated' },
  { id:8, name:'Koi', emoji:'🐟', type:'fish', breed:'Japanese Koi', price:5000, location:'Chittagong', age:'1 year', gender:'N/A', badge:'Premium' },
  { id:9, name:'Rex', emoji:'🐶', type:'dog', breed:'Labrador', price:18000, location:'Sylhet', age:'1.5 years', gender:'Male', badge:'Trained' },
  { id:10, name:'Coco', emoji:'🦜', type:'bird', breed:'Parrot', price:7000, location:'Dhaka', age:'2 years', gender:'Female', badge:'Talking' },
  { id:11, name:'Fluffy', emoji:'🐰', type:'rabbit', breed:'Angora', price:6000, location:'Rajshahi', age:'5 months', gender:'Female', badge:'Show Quality' },
  { id:12, name:'Max', emoji:'🐶', type:'dog', breed:'Husky', price:30000, location:'Dhaka', age:'2 years', gender:'Male', badge:'Purebred' },
];

const productsData = [
  { id:1, emoji:'🥩', name:'Royal Canin Dog Food 3kg', type:'food', rating:4.8, price:1200, pet:'dog' },
  { id:2, emoji:'🐟', name:'Ocean Premium Cat Food', type:'food', rating:4.6, price:850, pet:'cat' },
  { id:3, emoji:'🌾', name:'Vitapol Bird Seeds Mix', type:'food', rating:4.7, price:350, pet:'bird' },
  { id:4, emoji:'🧸', name:'Kong Chew Toy XL', type:'toy', rating:4.9, price:650, pet:'dog' },
  { id:5, emoji:'🎣', name:'Interactive Laser Cat Toy', type:'toy', rating:4.5, price:480, pet:'cat' },
  { id:6, emoji:'🏠', name:'Cozy Pet House (Medium)', type:'toy', rating:4.7, price:1800, pet:'dog' },
  { id:7, emoji:'🪁', name:'Bird Swing & Mirror Set', type:'toy', rating:4.4, price:280, pet:'bird' },
  { id:8, emoji:'🐠', name:'Tetra AquaFin Fish Food', type:'food', rating:4.6, price:220, pet:'fish' },
  { id:9, emoji:'🦴', name:'Pedigree Treats 500g', type:'food', rating:4.8, price:520, pet:'dog' },
  { id:10, emoji:'🛁', name:'Gentle Pet Shampoo 500ml', type:'toy', rating:4.5, price:380, pet:'all' },
];

const vetsData = [
  { id:1, emoji:'👨‍⚕️', name:'Dr. Rahman Hossain', spec:'Small Animals & Surgery', location:'Dhaka', hospital:'Dhaka Vet Clinic, Dhanmondi', rating:4.9, patients:1240, phone:'01711-234567', online:true, district:'dhaka', available:true },
  { id:2, emoji:'👩‍⚕️', name:'Dr. Fatema Khanam', spec:'Cat & Bird Specialist', location:'Dhaka', hospital:'PetCare Hospital, Gulshan', rating:4.8, patients:980, phone:'01812-345678', online:true, district:'dhaka', available:true },
  { id:3, emoji:'👨‍⚕️', name:'Dr. Aminul Islam', spec:'Dog & General Practice', location:'Chittagong', hospital:'ChittagongAnimal Hospital', rating:4.7, patients:860, phone:'01913-456789', online:true, district:'chittagong', available:false },
  { id:4, emoji:'👩‍⚕️', name:'Dr. Nasrin Akter', spec:'Exotic Animals & Reptiles', location:'Sylhet', hospital:'Sylhet Pet Clinic', rating:4.8, patients:520, phone:'01711-567890', online:true, district:'sylhet', available:true },
  { id:5, emoji:'👨‍⚕️', name:'Dr. Kabir Uddin', spec:'Veterinary Surgeon', location:'Rajshahi', hospital:'Rajshahi Vet Center', rating:4.6, patients:740, phone:'01612-678901', online:false, district:'rajshahi', available:true },
  { id:6, emoji:'👩‍⚕️', name:'Dr. Shahnaz Parvin', spec:'Internal Medicine', location:'Khulna', hospital:'Khulna Animal Care', rating:4.7, patients:650, phone:'01911-789012', online:true, district:'khulna', available:true },
  { id:7, emoji:'👨‍⚕️', name:'Dr. Mahbub Rahman', spec:'Orthopedic Surgeon', location:'Dhaka', hospital:'Animal Specialty Hospital, Mirpur', rating:4.9, patients:1100, phone:'01711-890123', online:true, district:'dhaka', available:true },
  { id:8, emoji:'👩‍⚕️', name:'Dr. Taslima Begum', spec:'Fish & Aquatic Animals', location:'Chittagong', hospital:'Aqua Vet Clinic', rating:4.5, patients:380, phone:'01812-901234', online:true, district:'chittagong', available:false },
  { id:9, emoji:'👨‍⚕️', name:'Dr. Noman Ali', spec:'Emergency & Critical Care', location:'Dhaka', hospital:'24hr Emergency Vet, Uttara', rating:4.9, patients:1500, phone:'01911-012345', online:true, district:'dhaka', available:true },
  { id:10, emoji:'👩‍⚕️', name:'Dr. Rokeya Sultana', spec:'Dermatology & Nutrition', location:'Sylhet', hospital:'Sylhet Animal Wellness', rating:4.6, patients:460, phone:'01612-123456', online:true, district:'sylhet', available:true },
  { id:11, emoji:'👨‍⚕️', name:'Dr. Zahir Hossain', spec:'Dentistry & Oral Care', location:'Rajshahi', hospital:'Rainbow Vet Hospital', rating:4.7, patients:590, phone:'01711-234568', online:false, district:'rajshahi', available:true },
  { id:12, emoji:'👩‍⚕️', name:'Dr. Moriam Khatun', spec:'Obstetrics & Neonatology', location:'Khulna', hospital:'Khulna Vet Specialty', rating:4.8, patients:710, phone:'01812-345679', online:true, district:'khulna', available:true },
  { id:13, emoji:'👨‍⚕️', name:'Dr. Tariq Aziz', spec:'Avian & Exotic Specialist', location:'Dhaka', hospital:'Bird & Exotic Clinic, Banani', rating:4.8, patients:830, phone:'01913-456790', online:true, district:'dhaka', available:true },
  { id:14, emoji:'👩‍⚕️', name:'Dr. Sumaiya Islam', spec:'Cardiology & Neurology', location:'Chittagong', hospital:'Advanced Vet Hospital', rating:4.9, patients:920, phone:'01711-567891', online:true, district:'chittagong', available:true },
  { id:15, emoji:'👨‍⚕️', name:'Dr. Rezaul Karim', spec:'Oncology & Pathology', location:'Dhaka', hospital:'Dhaka Vet Research Center', rating:4.7, patients:670, phone:'01612-678902', online:true, district:'dhaka', available:false },
  // International vets (online only)
  { id:16, emoji:'👨‍⚕️', name:'Dr. John Smith (UK)', spec:'International Teleconsult', location:'London, UK', hospital:'Global Vet Online', rating:4.9, patients:3200, phone:'+44-7911-123456', online:true, district:'online', available:true },
  { id:17, emoji:'👩‍⚕️', name:'Dr. Priya Sharma (India)', spec:'Exotic Animals Online', location:'Mumbai, India', hospital:'IndoPet Online Clinic', rating:4.8, patients:2800, phone:'+91-98765-43210', online:true, district:'online', available:true },
];

const lostFoundData = [
  { id:1, type:'lost', emoji:'🐶', name:'Tommy', desc:'Brown Labrador, 3 years old, very friendly', location:'Dhanmondi, Dhaka', date:'May 5, 2026', contact:'01711-111111' },
  { id:2, type:'found', emoji:'🐱', name:'Unknown Cat', desc:'White & orange cat, well-groomed, found near park', location:'Gulshan, Dhaka', date:'May 6, 2026', contact:'01812-222222' },
  { id:3, type:'lost', emoji:'🦜', name:'Mitu', desc:'Green parrot, can say "Hello" and "Mitu"', location:'Chittagong City', date:'May 4, 2026', contact:'01913-333333' },
  { id:4, type:'found', emoji:'🐶', name:'Unknown Dog', desc:'Golden Retriever, no collar, very friendly, found near school', location:'Mirpur, Dhaka', date:'May 7, 2026', contact:'01711-444444' },
  { id:5, type:'lost', emoji:'🐰', name:'Bunny', desc:'White rabbit with black ears, escaped from cage', location:'Sylhet City', date:'May 3, 2026', contact:'01612-555555' },
  { id:6, type:'found', emoji:'🐱', name:'Persian Cat', desc:'Gray Persian cat, pink collar, found near apartment', location:'Uttara, Dhaka', date:'May 7, 2026', contact:'01812-666666' },
];

const communityPosts = [
  { id:1, author:'Rafi Hossain', avatar:'😊', pet:'🐶', petName:'Bruno', text:'My Bruno just turned 2! Threw him a little birthday party and he loved it! 🎂 Any tips for keeping a German Shepherd healthy at home in Bangladesh heat?', likes:142, comments:28, time:'2h ago' },
  { id:2, author:'Sumaiya Akter', avatar:'🌸', pet:'🐱', petName:'Luna', text:'Luna is pregnant! Expecting kittens in 3 weeks 😍 Anyone know good vet in Sylhet for delivery checkup? She is a Persian cat, 2 years old.', likes:98, comments:45, time:'5h ago' },
  { id:3, author:'Tanvir Rahman', avatar:'🎯', pet:'🦜', petName:'Mithu', text:'Mithu can now say 5 words clearly including "খাওয়া দাও" (give me food) 😂 Lovebirds are truly amazing companions! Training tip: consistency + treats = magic 🪄', likes:213, comments:67, time:'1d ago' },
  { id:4, author:'Nadia Islam', avatar:'💫', pet:'🐟', petName:'Goldie', text:'My goldfish Goldie survived her first tank cleaning! Tips from experienced fish owners? I am a beginner and worried about water quality.', likes:56, comments:23, time:'3h ago' },
];

const careCardsData = [
  {
    emoji: '🐶', title_en: 'Dog Care', title_bn: 'কুকুরের যত্ন',
    tips_en: ['Bathe every 2–4 weeks', 'Daily exercise (30–60 min)', 'Vaccinate annually', 'Trim nails monthly', 'Dental check every 6 months', 'Worm treatment every 3 months'],
    tips_bn: ['প্রতি ২–৪ সপ্তাহে গোসল', 'দৈনিক ব্যায়াম (৩০–৬০ মিনিট)', 'বার্ষিক টিকা দিন', 'মাসে একবার নখ কাটুন', 'প্রতি ৬ মাসে দাঁতের পরীক্ষা', 'প্রতি ৩ মাসে কৃমির ওষুধ']
  },
  {
    emoji: '🐱', title_en: 'Cat Care', title_bn: 'বিড়ালের যত্ন',
    tips_en: ['Brush fur 2–3x weekly', 'Clean litter box daily', 'Vet checkup every 6 months', 'Spay/neuter at 6 months', 'Keep indoors in Bangladesh', 'Provide scratching post'],
    tips_bn: ['সপ্তাহে ২–৩ বার ব্রাশ করুন', 'লিটার বক্স প্রতিদিন পরিষ্কার করুন', 'প্রতি ৬ মাসে ভেট চেকআপ', '৬ মাসে নিউটার করুন', 'বাংলাদেশে ঘরে রাখুন', 'স্ক্র্যাচিং পোস্ট দিন']
  },
  {
    emoji: '🦜', title_en: 'Bird Care', title_bn: 'পাখির যত্ন',
    tips_en: ['Fresh water daily', 'Clean cage weekly', 'Provide UV light', 'Socialize every day', 'Trim wings carefully', 'Vet checkup yearly'],
    tips_bn: ['প্রতিদিন তাজা পানি', 'সপ্তাহে একবার খাঁচা পরিষ্কার', 'UV আলো দিন', 'প্রতিদিন সামাজিকতা', 'পাখা সাবধানে ছাঁটুন', 'বার্ষিক ভেট চেকআপ']
  },
  {
    emoji: '🐟', title_en: 'Fish Care', title_bn: 'মাছের যত্ন',
    tips_en: ['Change 25% water weekly', 'Check pH levels (6.5–7.5)', 'Don\'t overfeed', 'Clean filter monthly', 'Monitor temperature', 'Quarantine new fish 2 weeks'],
    tips_bn: ['সপ্তাহে ২৫% পানি পরিবর্তন', 'pH মাত্রা পরীক্ষা (৬.৫–৭.৫)', 'বেশি খাওয়াবেন না', 'মাসে একবার ফিল্টার পরিষ্কার', 'তাপমাত্রা নজর রাখুন', 'নতুন মাছ ২ সপ্তাহ আলাদা রাখুন']
  }
];

// ============================================================
// CART STATE
// ============================================================
let cart = [];
function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}
function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}
function addToCart(id, name, price, emoji) {
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id, name, price, emoji, qty: 1 }); }
  updateCartBadge();
  renderCart();
  showToast(`${name} added to cart! 🛒`, 'success');
}
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { updateCartBadge(); renderCart(); }
}
function renderCart() {
  const el = document.getElementById('cartItems');
  if (cart.length === 0) {
    el.innerHTML = `<div class="empty-cart" data-en="Your cart is empty! Start shopping 🐾" data-bn="আপনার কার্ট খালি! কেনাকাটা শুরু করুন 🐾">Your cart is empty! Start shopping 🐾</div>`;
  } else {
    el.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">৳${(item.price * item.qty).toLocaleString()}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join('');
  }
  const sub = getCartTotal();
  document.getElementById('cartSubtotal').textContent = `৳${sub.toLocaleString()}`;
  document.getElementById('cartTotal').textContent = `৳${(sub + 60).toLocaleString()}`;
}
function checkout() {
  if (cart.length === 0) { showToast('Your cart is empty!', 'error'); return; }
  showToast('Redirecting to SSLCommerz payment... 🔒', 'success');
  setTimeout(() => { cart = []; updateCartBadge(); renderCart(); showToast('Order placed successfully! 🎉', 'success'); }, 2000);
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderFeaturedPets() {
  const el = document.getElementById('featuredPets');
  el.innerHTML = petsData.slice(0, 4).map(p => petCard(p)).join('');
}
function renderFeaturedProducts() {
  const el = document.getElementById('featuredProducts');
  el.innerHTML = productsData.slice(0, 4).map(p => productCard(p)).join('');
}

function petCard(p) {
  return `
    <div class="pet-card">
      <div class="pet-card-emoji">${p.emoji}<div class="pet-badge">${p.badge}</div></div>
      <div class="pet-card-body">
        <div class="pet-card-name">${p.name}</div>
        <div class="pet-card-meta">${p.breed} • ${p.age} • ${p.gender}</div>
        <div class="pet-card-price">৳${p.price.toLocaleString()}</div>
        <div class="pet-card-location">📍 ${p.location}</div>
      </div>
    </div>`;
}

function productCard(p) {
  return `
    <div class="product-card">
      <div class="product-card-emoji">${p.emoji}</div>
      <div class="product-card-body">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-rating">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '☆' : ''} ${p.rating}</div>
        <div class="product-card-price">৳${p.price.toLocaleString()}</div>
        <button class="add-cart-btn" onclick="addToCart(${p.id + 100},'${p.name}',${p.price},'${p.emoji}')">🛒 Add to Cart</button>
      </div>
    </div>`;
}

// ============================================================
// MARKETPLACE
// ============================================================
let currentFilter = { type: '', price: '', location: '', sort: 'newest' };

function applyFilters() {
  currentFilter.type = document.getElementById('filterType').value;
  currentFilter.price = document.getElementById('filterPrice').value;
  currentFilter.location = document.getElementById('filterLocation').value;
  currentFilter.sort = document.getElementById('filterSort').value;
  renderMarketplace();
}

function renderMarketplace() {
  let data = [...petsData];
  if (currentFilter.type) data = data.filter(p => p.type === currentFilter.type);
  if (currentFilter.location) data = data.filter(p => p.location === currentFilter.location);
  if (currentFilter.price === 'low') data = data.filter(p => p.price < 5000);
  if (currentFilter.price === 'mid') data = data.filter(p => p.price >= 5000 && p.price <= 20000);
  if (currentFilter.price === 'high') data = data.filter(p => p.price > 20000);
  if (currentFilter.sort === 'price-low') data.sort((a, b) => a.price - b.price);
  if (currentFilter.sort === 'price-high') data.sort((a, b) => b.price - a.price);

  const el = document.getElementById('marketplaceGrid');
  el.innerHTML = data.length ? data.map(p => petCard(p)).join('') : '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:40px">No pets found matching your filters. 🐾</p>';
}

// ============================================================
// SHOP
// ============================================================
function renderShop() {
  const foods = productsData.filter(p => p.type === 'food');
  const toys = productsData.filter(p => p.type === 'toy');
  document.getElementById('foodGrid').innerHTML = foods.map(p => productCard(p)).join('');
  document.getElementById('toysGrid').innerHTML = toys.map(p => productCard(p)).join('');
}

// ============================================================
// VET SERVICES
// ============================================================
let currentVetFilter = 'all';
let currentVetSearch = '';

function filterVetType(type) {
  currentVetFilter = type;
  document.querySelectorAll('.vchip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  renderVets();
}
function filterVets() {
  currentVetSearch = document.getElementById('vetSearch').value.toLowerCase();
  renderVets();
}
function renderVets() {
  let data = [...vetsData];
  if (currentVetFilter !== 'all') data = data.filter(v => v.district === currentVetFilter);
  if (currentVetSearch) data = data.filter(v =>
    v.name.toLowerCase().includes(currentVetSearch) ||
    v.spec.toLowerCase().includes(currentVetSearch) ||
    v.location.toLowerCase().includes(currentVetSearch)
  );
  const el = document.getElementById('vetGrid');
  el.innerHTML = data.map(v => vetCard(v)).join('');
}

function vetCard(v) {
  const stars = '★'.repeat(Math.floor(v.rating)) + (v.rating % 1 ? '☆' : '');
  return `
    <div class="vet-card">
      <div class="vet-available"><span class="avail-dot ${v.available ? '' : 'offline'}"></span></div>
      <div class="vet-card-top">
        <div class="vet-avatar">
          ${v.emoji}
          <div class="vet-anim-overlay">🌟</div>
        </div>
        <div>
          <div class="vet-name">${v.name}</div>
          <div class="vet-spec">${v.spec}</div>
          <div class="vet-location">📍 ${v.location}</div>
          <div class="vet-location" style="font-size:0.78rem;margin-top:2px">🏥 ${v.hospital}</div>
        </div>
      </div>
      <div class="vet-meta">
        <div class="vet-badge"><span class="vet-rating-stars">${stars}</span> ${v.rating}</div>
        <div class="vet-badge">👥 ${v.patients.toLocaleString()} patients</div>
        <div class="vet-badge">${v.online ? '🌐 Online' : '🏥 Clinic Only'}</div>
      </div>
      <div class="vet-meta">
        <div class="vet-badge">📞 ${v.phone}</div>
        <div class="vet-badge">${v.available ? '✅ Available' : '⏰ Busy'}</div>
      </div>
      <div class="vet-actions">
        <button class="vet-btn primary" onclick="openAppointment(${v.id})" data-en="Book Appointment" data-bn="অ্যাপয়েন্টমেন্ট">Book</button>
        ${v.online ? `<button class="vet-btn video" onclick="startVideoCall('${v.name}')">📹 Video Call</button>` : ''}
        <button class="vet-btn contact" onclick="callVet('${v.phone}')">📞 Call</button>
      </div>
    </div>`;
}

function openAppointment(vetId) {
  const vet = vetsData.find(v => v.id === vetId);
  if (!vet) return;
  document.getElementById('appointmentVetInfo').innerHTML = `
    <div style="font-size:2rem">${vet.emoji}</div>
    <div><strong>${vet.name}</strong><br><small style="color:var(--primary)">${vet.spec}</small><br><small style="color:var(--text-muted)">${vet.hospital}</small></div>`;
  openModal('appointmentModal');
}

function startVideoCall(name) {
  showToast(`Starting video call with ${name}... 📹`, 'success');
}
function callVet(phone) {
  showToast(`Calling ${phone}... 📞`, 'success');
}
function bookAppointment() {
  showToast('Appointment booked successfully! You will receive an SMS confirmation. ✅', 'success');
  closeModal();
}

// ============================================================
// DASHBOARD
// ============================================================
function updateProgress() {
  const checks = document.querySelectorAll('#checklist input[type=checkbox]');
  const done = [...checks].filter(c => c.checked).length;
  const pct = (done / checks.length) * 100;
  document.getElementById('dailyProgress').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${done} / ${checks.length} done`;
}

function animateHealthBars() {
  document.querySelectorAll('.hbar-fill').forEach(bar => {
    const w = bar.getAttribute('data-width') || bar.style.getPropertyValue('--w');
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = w; }, 100);
  });
}

// ============================================================
// CARE GUIDE
// ============================================================
function renderCareCards() {
  const el = document.getElementById('careCards');
  el.innerHTML = careCardsData.map(c => {
    const tips = currentLang === 'bn' ? c.tips_bn : c.tips_en;
    const title = currentLang === 'bn' ? c.title_bn : c.title_en;
    return `
      <div class="care-card">
        <span class="care-card-icon">${c.emoji}</span>
        <h3>${title}</h3>
        <ul class="care-tips">
          ${tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>`;
  }).join('');
}

// ============================================================
// COMMUNITY
// ============================================================
let likedPosts = new Set();
function renderCommunity() {
  const el = document.getElementById('postsColumn');
  el.innerHTML = communityPosts.map(p => `
    <div class="post-card">
      <div class="post-author">
        <div class="post-avatar">${p.avatar}</div>
        <div class="post-author-info">
          <strong>${p.author}</strong>
          <small>${p.time} • 🐾 ${p.petName}</small>
        </div>
      </div>
      <div class="post-pet-emoji">${p.pet}</div>
      <div class="post-text">${p.text}</div>
      <div class="post-actions">
        <button class="post-btn ${likedPosts.has(p.id) ? 'liked' : ''}" id="like-${p.id}" onclick="toggleLike(${p.id})">
          ❤️ ${p.likes + (likedPosts.has(p.id) ? 1 : 0)}
        </button>
        <button class="post-btn" onclick="showToast('Comments coming soon! 💬','success')">💬 ${p.comments}</button>
        <button class="post-btn" onclick="showToast('Post shared! 📤','success')">📤 Share</button>
      </div>
    </div>`).join('');

  const owners = ['Rafi H.','Sumaiya A.','Tanvir R.','Nadia I.'];
  const ownerEmojis = ['😊','🌸','🎯','💫'];
  const followed = new Set();
  document.getElementById('topOwners').innerHTML = owners.map((o, i) => `
    <div class="owner-row">
      <div class="owner-avatar">${ownerEmojis[i]}</div>
      <div class="owner-name">${o}</div>
      <button class="follow-btn" id="follow-${i}" onclick="toggleFollow(this)">${followed.has(i) ? 'Following' : 'Follow'}</button>
    </div>`).join('');
}
function toggleLike(id) {
  if (likedPosts.has(id)) likedPosts.delete(id); else likedPosts.add(id);
  renderCommunity();
}
function toggleFollow(btn) {
  btn.classList.toggle('following');
  btn.textContent = btn.classList.contains('following') ? 'Following ✓' : 'Follow';
}

// ============================================================
// LOST & FOUND
// ============================================================
let currentLFTab = 'lost';
function showLFTab(tab) {
  currentLFTab = tab;
  document.querySelectorAll('.lf-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.lf-tab').forEach(t => {
    if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${tab}'`)) t.classList.add('active');
  });
  renderLF();
}
function renderLF() {
  const data = lostFoundData.filter(d => d.type === currentLFTab);
  const el = document.getElementById('lfGrid');
  el.innerHTML = data.map(d => `
    <div class="lf-card">
      <div class="lf-type ${d.type}">${d.type === 'lost' ? '😢 Lost' : '😊 Found'}</div>
      <div class="lf-pet-emoji">${d.emoji}</div>
      <div class="lf-name">${d.name}</div>
      <div class="pet-card-meta">${d.desc}</div>
      <div class="lf-location">📍 ${d.location}</div>
      <div class="lf-location">📅 ${d.date}</div>
      <button class="contact-btn" onclick="showToast('Contacting owner: ${d.contact} 📞','success')" style="margin-top:12px">📞 Contact Owner</button>
    </div>`).join('');
}

// ============================================================
// AI ASSISTANT
// ============================================================
const aiResponses = {
  en: {
    feed: "For dogs, feed twice daily with high-quality dry kibble. For puppies, feed 3–4 times. Always provide fresh water. Avoid: chocolate, onions, grapes — toxic to dogs! 🐶",
    cat: "Cats not eating can indicate stress, dental pain, or illness. Check if there are any changes in environment. If it persists >24 hours, visit a vet immediately. 🐱",
    vet: "Top vets in Dhaka include Dr. Rahman Hossain (Dhanmondi), Dr. Fatema Khanam (Gulshan), and Dr. Noman Ali (24hr Emergency, Uttara). All available on PetCare BD! 🩺",
    vaccine: "Vaccine schedule for dogs: 6-8 weeks: Distemper+Parvo, 12 weeks: Rabies, Annual boosters. For cats: 9 weeks FVRCP, 12 weeks Rabies. 💉",
    default: "Great question! As your AI pet advisor, I recommend consulting with one of our verified vets for specific medical concerns. Browse our Vet Services section for experts near you! 🐾"
  },
  bn: {
    feed: "কুকুরের জন্য দিনে দুইবার উচ্চমানের শুকনো খাবার দিন। পিল্লার জন্য দিনে ৩–৪ বার। সর্বদা তাজা পানি দিন। এড়িয়ে চলুন: চকলেট, পেঁয়াজ, আঙুর — কুকুরের জন্য বিষাক্ত! 🐶",
    cat: "বিড়াল না খাওয়া মানসিক চাপ, দাঁতের ব্যথা বা অসুস্থতার লক্ষণ হতে পারে। পরিবেশে কোনো পরিবর্তন হয়েছে কিনা দেখুন। ২৪ ঘণ্টার বেশি চললে অবশ্যই ভেটের কাছে যান। 🐱",
    vet: "ঢাকায় সেরা ভেটদের মধ্যে আছেন ড. রহমান হোসেন (ধানমন্ডি), ড. ফাতেমা খানম (গুলশান), এবং ড. নোমান আলী (২৪ঘণ্টা জরুরি, উত্তরা)। সবাই PetCare BD-তে পাওয়া যায়! 🩺",
    vaccine: "কুকুরের টিকার সময়সূচি: ৬-৮ সপ্তাহ: Distemper+Parvo, ১২ সপ্তাহ: জলাতঙ্ক, বার্ষিক বুস্টার। বিড়ালের জন্য: ৯ সপ্তাহ FVRCP, ১২ সপ্তাহ জলাতঙ্ক। 💉",
    default: "চমৎকার প্রশ্ন! নির্দিষ্ট চিকিৎসা সংক্রান্ত বিষয়ের জন্য আমাদের যাচাইকৃত ভেটদের সাথে পরামর্শ করুন। আপনার কাছের বিশেষজ্ঞের জন্য ভেট সার্ভিসেস বিভাগ দেখুন! 🐾"
  }
};

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  addChatMessage(msg, 'user');
  input.value = '';
  setTimeout(() => {
    const resp = getAIResponse(msg);
    addChatMessage(resp, 'bot');
  }, 800);
}

function sendPreset(btn) {
  const msg = btn.getAttribute(currentLang === 'bn' ? 'data-bn' : 'data-en') || btn.textContent;
  addChatMessage(msg, 'user');
  setTimeout(() => {
    const resp = getAIResponse(msg);
    addChatMessage(resp, 'bot');
  }, 800);
}

function addChatMessage(text, role) {
  const el = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<span class="chat-avatar">${role === 'bot' ? '🤖' : '👤'}</span><div class="chat-bubble">${text}</div>`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function getAIResponse(msg) {
  const lang = currentLang;
  const r = aiResponses[lang];
  const lower = msg.toLowerCase();
  if (lower.includes('feed') || lower.includes('food') || lower.includes('খাও') || lower.includes('খাবার')) return r.feed;
  if (lower.includes('cat') || lower.includes('eating') || lower.includes('বিড়াল') || lower.includes('খাচ্ছে')) return r.cat;
  if (lower.includes('vet') || lower.includes('doctor') || lower.includes('ভেট') || lower.includes('ডাক্তার')) return r.vet;
  if (lower.includes('vaccine') || lower.includes('টিকা') || lower.includes('vaccination')) return r.vaccine;
  return r.default;
}

function runMatchmaker() {
  const space = document.getElementById('mmSpace').value;
  const activity = document.getElementById('mmActivity').value;
  const budget = document.getElementById('mmBudget').value;
  let result = '';
  const lang = currentLang;

  if (space === 'small' && activity === 'low' && budget === 'low') {
    result = lang === 'bn' ? '<h4>🐟 মাছ (Fish) — নিখুঁত মিল!</h4><p>ছোট জায়গায়, কম কার্যকলাপ এবং কম বাজেটের জন্য মাছ আদর্শ। একটি ছোট অ্যাকোয়ারিয়াম দিয়ে শুরু করুন!</p>' : '<h4>🐟 Fish — Perfect Match!</h4><p>Fish are ideal for small spaces, low activity, and tight budgets. Start with a small aquarium!</p>';
  } else if (space === 'large' && activity === 'high') {
    result = lang === 'bn' ? '<h4>🐶 বড় কুকুর (Large Dog) — নিখুঁত মিল!</h4><p>আপনার বড় বাড়ি এবং সক্রিয় জীবনধারার জন্য জার্মান শেফার্ড বা গোল্ডেন রিট্রিভার আদর্শ!</p>' : '<h4>🐶 Large Dog — Perfect Match!</h4><p>Your large space and active lifestyle is perfect for a German Shepherd or Golden Retriever!</p>';
  } else if (activity === 'low' && budget !== 'high') {
    result = lang === 'bn' ? '<h4>🐱 বিড়াল (Cat) — দারুণ মিল!</h4><p>বিড়াল স্বাধীন, কম যত্নশীল এবং অ্যাপার্টমেন্টের জন্য আদর্শ। পার্সিয়ান বা সিয়ামিজ বিড়াল বিবেচনা করুন!</p>' : '<h4>🐱 Cat — Great Match!</h4><p>Cats are independent, low-maintenance and perfect for apartments. Consider a Persian or Siamese!</p>';
  } else if (space === 'small' && budget === 'low') {
    result = lang === 'bn' ? '<h4>🦜 পাখি (Bird) — চমৎকার মিল!</h4><p>লাভ বার্ড বা বাজরিগার ছোট জায়গায় এবং কম বাজেটে আদর্শ সঙ্গী হবে!</p>' : '<h4>🦜 Bird — Wonderful Match!</h4><p>Love Birds or Budgerigars are perfect companions for small spaces and low budgets!</p>';
  } else {
    result = lang === 'bn' ? '<h4>🐶 মাঝারি কুকুর (Medium Dog) — ভালো মিল!</h4><p>ল্যাব্রাডর বা বিগল আপনার জন্য উপযুক্ত — বন্ধুত্বপূর্ণ, মাঝারি আকার এবং পরিবার-বান্ধব!</p>' : '<h4>🐶 Medium Dog — Good Match!</h4><p>A Labrador or Beagle suits you well — friendly, medium-sized, and family-friendly!</p>';
  }
  const el = document.getElementById('matchResult');
  el.innerHTML = result;
  el.classList.add('show');
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
  document.getElementById('modalOverlay').classList.add('open');
  document.querySelectorAll('.modal-box').forEach(m => m.classList.remove('open'));
  document.getElementById(id).classList.add('open');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.querySelectorAll('.modal-box').forEach(m => m.classList.remove('open'));
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

// ============================================================
// INIT
// ============================================================
function initApp() {
  renderFeaturedPets();
  renderFeaturedProducts();
  renderMarketplace();
  renderShop();
  renderVets();
  renderCareCards();
  renderCommunity();
  renderLF();
  renderCart();
  updateProgress();

  // Keyboard shortcut for chat
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
  }
}

// Re-render care cards when lang changes (since data is lang-specific)
const origSetLang = setLang;
window.setLang = function(lang) {
  origSetLang(lang);
  renderCareCards();
  // Update vet cards too
  if (document.getElementById('sec-vet').classList.contains('active-section')) renderVets();
};