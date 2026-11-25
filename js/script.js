// Saffron & Sage restaurant website interactions
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Menu category filters
const filterButtons = document.querySelectorAll('.filter');
const foodCards = document.querySelectorAll('.food-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    foodCards.forEach(card => {
      card.hidden = selected !== 'all' && card.dataset.category !== selected;
    });
  });
});

// Simple shopping cart (stored in browser localStorage)
let cart = JSON.parse(localStorage.getItem('saffronCart') || '[]');
const cartBar = document.getElementById('cartBar');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartDialog = document.getElementById('cartDialog');

function saveCart() {
  localStorage.setItem('saffronCart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  cartTotal.textContent = `₹${total}`;
  document.getElementById('dialogTotal').textContent = `₹${total}`;
  cartBar.classList.toggle('visible', count > 0);

  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="form-note">Your order is empty. Add something delicious from the menu.</p>';
  }
  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-line';
    const name = document.createElement('span');
    name.textContent = `${item.name} × ${item.quantity}`;
    const price = document.createElement('span');
    price.textContent = `₹${item.price * item.quantity}`;
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      cart.splice(index, 1);
      saveCart();
    });
    row.append(name, price, remove);
    cartItems.appendChild(row);
  });
}

document.querySelectorAll('.add-btn').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });
    saveCart();
    const original = button.textContent;
    button.textContent = 'Added ✓';
    setTimeout(() => button.textContent = original, 900);
  });
});

document.getElementById('viewCart').addEventListener('click', () => cartDialog.showModal());
document.getElementById('closeCart').addEventListener('click', () => cartDialog.close());
document.getElementById('clearCart').addEventListener('click', () => {
  cart = [];
  saveCart();
});

// Reservation form: front-end demo only; no server/email is connected.
const bookingDate = document.getElementById('bookingDate');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
bookingDate.min = localToday;

document.getElementById('bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const firstName = formData.get('name').trim().split(' ')[0];
  document.getElementById('bookingStatus').textContent =
    `Thank you, ${firstName}! Your demo reservation request has been recorded on this page.`;
  event.currentTarget.reset();
  bookingDate.min = localToday;
});

document.getElementById('year').textContent = new Date().getFullYear();
renderCart();
