const CART_KEY = 'b2b_cart_v1';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.product === item.product);
  if (idx > -1) { cart[idx].quantity += item.quantity; }
  else cart.push(item);
  saveCart(cart);
}
function updateQty(productId, qty) {
  const cart = getCart().map(i => i.product === productId ? { ...i, quantity: qty } : i);
  saveCart(cart);
}
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.product !== productId);
  saveCart(cart);
}
function clearCart() { localStorage.removeItem(CART_KEY); }

export { getCart, saveCart, addToCart, updateQty, removeFromCart, clearCart };
