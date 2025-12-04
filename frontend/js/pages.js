import { apiFetch } from './api.js';
import { addToCart, getCart, clearCart } from './cart.js';

function el(q) { return document.querySelector(q); }

async function loadHome() {
  document.getElementById('grocery-link').addEventListener('click', () => location.href = 'products.html?category=grocery');
  document.getElementById('cosmetics-link').addEventListener('click', () => location.href = 'products.html?category=cosmetics');
}

async function loadProducts() {
  const params = new URLSearchParams(location.search);
  const cat = params.get('category');
  const products = await apiFetch('/products' + (cat ? `?category=${cat}` : ''));
  const grid = el('#product-grid');
  grid.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div'); div.className = 'card';
    div.innerHTML = `
      <img src="${p.image || 'https://picsum.photos/300/200'}" alt="">
      <div class="product-name">${p.name}</div>
      <div>${p.description || ''}</div>
      <div class="price">₹ ${p.price}</div>
      <div style="margin-top:8px">
        <button class="btn addcart" data-id="${p._id}">Add to Cart</button>
        <a class="btn secondary" href="product-details.html?id=${p._id}">Details</a>
      </div>
    `;
    grid.appendChild(div);
  });
  grid.querySelectorAll('button.addcart').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart({ product: id, quantity: 1 });
      alert('Added to cart');
    });
  });
}

async function loadProductDetails() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = await apiFetch('/products/' + id);
  el('#pd-name').textContent = p.name;
  el('#pd-desc').textContent = p.description;
  el('#pd-price').textContent = '₹ ' + p.price;
  el('#pd-img').src = p.image || 'https://picsum.photos/400/300';
  el('#add-to-cart').addEventListener('click', () => {
    const qty = parseInt(el('#qty').value || '1', 10);
    addToCart({ product: p._id, quantity: qty });
    alert('Added to cart');
  });
}

async function loadCartPage() {
  const cart = getCart();
  const tbody = el('#cart-body');
  if (!cart.length) { tbody.innerHTML = '<tr><td colspan="4">Cart is empty</td></tr>'; return; }
  tbody.innerHTML = '';
  for (const item of cart) {
    const prod = await apiFetch('/products/' + item.product);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${prod.name}</td><td><input class="form-control qty-input" type="number" min="1" value="${item.quantity}" data-id="${prod._id}"></td><td>₹ ${prod.price}</td><td>₹ ${prod.price * item.quantity}</td>`;
    tbody.appendChild(tr);
  }
  tbody.querySelectorAll('.qty-input').forEach(inp=>{
    inp.addEventListener('change', (e)=>{
      const id = e.target.dataset.id;
      const q = parseInt(e.target.value,10);
      const cart = getCart();
      cart.forEach(it=>{ if(it.product===id) it.quantity=q; });
      localStorage.setItem('b2b_cart_v1', JSON.stringify(cart));
      location.reload();
    });
  });
}

async function loadCheckoutPage() {
  const cart = getCart();
  if (!cart.length) { document.getElementById('checkout-area').innerHTML = '<p>Cart empty</p>'; return; }
  document.getElementById('place-order').addEventListener('click', async () => {
    const name = document.getElementById('ship-name').value;
    const addr = document.getElementById('ship-addr').value;
    const items = cart.map(i => ({ product: i.product, quantity: i.quantity }));
    try {
      const res = await apiFetch('/orders', { method: 'POST', body: JSON.stringify({ items, shippingAddress: `${name} - ${addr}` }) });
      alert('Order placed! Order id: ' + res._id);
      clearCart();
      location.href = 'index.html';
    } catch (err) {
      alert('Failed to place order: ' + (err.data.message || err.status));
    }
  });
}

export { loadHome, loadProducts, loadProductDetails, loadCartPage, loadCheckoutPage };
