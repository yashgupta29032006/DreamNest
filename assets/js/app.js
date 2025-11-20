const properties = [
  {
    id: 'p1',
    title: 'Modern Family House',
    type: 'House',
    city: 'Gurugram',
    price: 250000,
    beds: 4,
    baths: 3,
    area: 3200,
    images: [
      'https://static01.nyt.com/images/2022/02/13/realestate/08LOCATION-SEATTLE-slide-TU5E/08LOCATION-SEATTLE-slide-TU5E-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
      'https://oharainteriors.com/wp-content/uploads/2021/05/1_Modern-Family-Home_Heart-of-the-City.jpg',
      'https://onekindesign.com/wp-content/uploads/2024/03/Mountain-Modern-Family-House-Park-City-Utah-Big-D-Signature-02-1-Kindesign.jpg'
    ],
    description: 'A spacious modern family house located near good schools and parks.'
  },
  {
    id: 'p2',
    title: 'City Center Apartment',
    type: 'Apartment',
    city: 'New Delhi',
    price: 95000,
    beds: 2,
    baths: 2,
    area: 980,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'
    ],
    description: 'Comfortable apartment in the heart of the city with great views.'
  },
  {
    id: 'p3',
    title: 'Luxury Condo with Pool',
    type: 'Condo',
    city: 'Noida',
    price: 180000,
    beds: 3,
    baths: 3,
    area: 1600,
    images: [
      'https://images.squarespace-cdn.com/content/v1/57916842bebafb827652722c/c845ff1c-0df9-47cd-8323-663a74b2a44b/GFO+Investments+Launches+%2714+ROC%27+Short-Term-Rental+Luxury+Condo+In+Downtown+Miami+52.jpg',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80'
    ],
    description: 'High-end condo with community pool and gym.'
  },
  {
    id: 'p4',
    title: 'Cozy Studio',
    type: 'Apartment',
    city: 'Mumbai',
    price: 45000,
    beds: 1,
    baths: 1,
    area: 420,
    images: ['https://www.shutterstock.com/image-photo/interior-small-apartment-living-room-600nw-2154108011.jpg',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80'],
    description: 'A cozy studio ideal for singles or couples.'
  }
];

function formatPrice(v) {
  return '₹' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }
}
document.querySelectorAll('[id^="theme-toggle"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
});
if (localStorage.getItem('theme') === 'dark') applyTheme('dark');

(function initHomeSlider() {
  const slides = document.querySelectorAll('#home-slider .slide');
  if (!slides.length) return;
  let idx = 0;
  const next = () => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  };
  const prev = () => {
    slides[idx].classList.remove('active');
    idx = (idx - 1 + slides.length) % slides.length;
    slides[idx].classList.add('active');
  };
  document.getElementById('next-slide')?.addEventListener('click', next);
  document.getElementById('prev-slide')?.addEventListener('click', prev);
  setInterval(next, 6000);
})();

function renderFeatured() {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  const featured = properties.slice(0, 3);
  container.innerHTML = featured.map(p => `
    <div class="listing-card animate-fade-in">
      <div class="thumb" style="background-image:url('${p.images[0]}')"></div>
      <div class="info">
        <h3>${p.title}</h3>
        <div class="listing-meta">
          <div>${p.city} • ${p.type}</div>
          <div>${formatPrice(p.price)}</div>
        </div>
        <div style="margin-top:8px">
            <a class="btn primary" href="property.html?id=${p.id}">View</a>
          <button class="btn" onclick="contactAgent('${p.id}')">Contact</button>
        </div>
      </div>
    </div>
  `).join('');
}

function contactAgent(id) {
  const p = properties.find(x => x.id === id);
  alert(`Contacting agent for ${p.title} — open the Contact page to send a message.`);
  window.location.href = 'contact.html';
}

function renderListings(list) {
  const container = document.getElementById('listings-grid');
  if (!container) return;
  container.innerHTML = list.map(p => `
    <div class="listing-card animate-fade-in">
      <div class="thumb" style="background-image:url('${p.images[0]}')"></div>
      <div class="info">
        <h3>${p.title}</h3>
        <div class="listing-meta">
          <div>${p.beds} bd • ${p.baths} ba • ${p.area} sqft</div>
          <div>${formatPrice(p.price)}</div>
        </div>
        <p style="color:var(--muted);margin-top:8px">${p.city} • ${p.type}</p>
        <div style="margin-top:8px">
          <a class="btn primary" href="property.html?id=${p.id}">See details</a>
        </div>
      </div>
    </div>
  `).join('');
}

function doSearch() {
  const q = (document.getElementById('search-input')?.value || document.getElementById('home-search')?.value || '').toLowerCase().trim();
  const type = document.getElementById('filter-type')?.value || document.getElementById('home-type')?.value || '';
  const beds = parseInt(document.getElementById('filter-bed')?.value || '') || 0;
  const sort = document.getElementById('filter-sort')?.value || 'relevance';

  let results = properties.filter(p => {
    const matchesQ = !q || (p.title + ' ' + p.city + ' ' + p.type).toLowerCase().includes(q);
    const matchesType = !type || p.type === type;
    const matchesBed = !beds || p.beds >= beds;
    return matchesQ && matchesType && matchesBed;
  });

  if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);

  renderListings(results);
  if (document.getElementById('featured-grid')) renderFeatured();
  return results;
}

document.getElementById('search-btn')?.addEventListener('click', (e) => {
  e?.preventDefault();
  doSearch();
});
document.getElementById('quick-search')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('home-search').value.trim();
  const type = document.getElementById('home-type').value;
  const url = new URL(window.location.origin + '/listings.html');
  if (q) url.searchParams.set('q', q);
  if (type) url.searchParams.set('type', type);
  window.location.href = url.toString();
});

function initListingsFromUrl() {
  if (!document.getElementById('listings-grid')) return;
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  if (q) document.getElementById('search-input').value = q;
  if (type) document.getElementById('filter-type').value = type;
  renderListings(properties);
  if (q || type) doSearch();
}

function renderPropertyDetail() {
  const container = document.getElementById('property-container');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = properties.find(x => x.id === id) || properties[0];
  if (!p) { container.innerHTML = '<p>Property not found</p>'; return; }

  container.innerHTML = `
    <h1>${p.title}</h1>
    <div class="property-meta" style="color:var(--muted)">${p.city} • ${p.type} • ${p.beds} bd • ${p.baths} ba</div>
    <div class="gallery">
      <div class="gallery-main" id="gallery-main" style="background-image:url('${p.images[0]}')"></div>
      <div class="gallery-thumbs" id="gallery-thumbs">
        ${p.images.map((src, i) => `<div role="button" data-src="${src}" class="thumb-small ${i === 0 ? 'active' : ''}" style="background-image:url('${src}')"></div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:20px;margin-top:12px;align-items:flex-start;flex-wrap:wrap">
      <div style="flex:1">
        <h3>About this property</h3>
        <p>${p.description}</p>
        <h4>Details</h4>
        <ul>
          <li>Area: ${p.area} sqft</li>
          <li>Beds: ${p.beds}</li>
          <li>Baths: ${p.baths}</li>
          <li>Price: ${formatPrice(p.price)}</li>
        </ul>
      </div>
      <aside style="width:320px;background:var(--card);padding:16px;border-radius:12px">
        <h4>Interested?</h4>
        <p>Contact our agent to schedule a visit.</p>
        <button class="btn primary" onclick="window.location.href='contact.html'">Contact Agent</button>
      </aside>
    </div>
  `;

  document.querySelectorAll('.thumb-small').forEach(el => {
    el.addEventListener('click', (ev) => {
      document.querySelectorAll('.thumb-small').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('gallery-main').style.backgroundImage = `url('${el.dataset.src}')`;
    });
  });
}

(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const feedback = document.getElementById('contact-feedback');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if (name.length < 3) { feedback.textContent = 'Please enter a valid name.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { feedback.textContent = 'Please enter a valid email.'; return; }
    if (message.length < 10) { feedback.textContent = 'Message must be at least 10 characters.'; return; }
    feedback.textContent = 'Sending message...';
    setTimeout(() => {
      feedback.textContent = 'Thank you! Your message has been sent. We will contact you soon.';
      form.reset();
    }, 800);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  initListingsFromUrl();
  renderPropertyDetail();


  const homeSearch = document.getElementById('home-search');
  if (homeSearch && window.location.pathname.endsWith('listings.html')) {
    const p = new URLSearchParams(window.location.search);
    homeSearch.value = p.get('q') || '';
  }

  // Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
});
