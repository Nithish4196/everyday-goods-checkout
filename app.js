const PRODUCTS = [
  {
    id: 'tshirt',
    name: 'Cotton T-Shirt',
    price: 799,
    mrp: 1299,
    discount: '38% off',
    rating: '4.3 ★',
    ratingCount: '(1,284)',
    image: 'assets/tshirt.png'
  },
  {
    id: 'tote',
    name: 'Canvas Tote Bag',
    price: 499,
    mrp: 899,
    discount: '44% off',
    rating: '4.5 ★',
    ratingCount: '(892)',
    image: 'assets/tote.png'
  }
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
});

function formatPrice(amount) {
  return currencyFormatter.format(amount);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function generateOrderReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'ORD-' + code;
}

function getDeliveryDateString(days = 4) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getFullDeliveryDateString(days = 4) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const state = {
  cart: [
    {
      id: 'tshirt',
      name: 'Cotton T-Shirt',
      price: 799,
      mrp: 1299,
      image: 'assets/tshirt.png',
      quantity: 1
    },
    {
      id: 'tote',
      name: 'Canvas Tote Bag',
      price: 499,
      mrp: 899,
      image: 'assets/tote.png',
      quantity: 1
    }
  ],
  name: '',
  address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103',
  errors: {
    cart: '',
    name: ''
  },
  placed: false,
  order: null
};

function handleAddToCart(productId) {
  const existingItem = state.cart.find(item => item.id === productId);
  if (existingItem) {
    if (existingItem.quantity < 10) {
      existingItem.quantity += 1;
    }
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      state.cart.push({ ...product, quantity: 1 });
    }
  }
  state.errors.cart = '';
  render();
}

function handleQuantityChange(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) {
    return;
  }
  const nextQuantity = item.quantity + delta;
  if (nextQuantity >= 1 && nextQuantity <= 10) {
    item.quantity = nextQuantity;
    state.errors.cart = '';
    render();
  }
}

function handleRemoveItem(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  render();
}

function handleNameInput(event) {
  state.name = event.target.value;
  if (state.errors.name) {
    state.errors.name = '';
    const nameErrorEl = document.getElementById('name-error');
    if (nameErrorEl) {
      nameErrorEl.textContent = '';
    }
  }
}

function handleAddressInput(event) {
  state.address = event.target.value;
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  const productCards = document.querySelectorAll('.fk-product-card');
  const noResultsEl = document.getElementById('search-no-results');
  let matchCount = 0;

  productCards.forEach(card => {
    const titleEl = card.querySelector('.product-name');
    const title = titleEl ? titleEl.textContent.toLowerCase() : '';
    if (title.includes(query)) {
      card.style.display = '';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (noResultsEl) {
    noResultsEl.hidden = matchCount > 0;
  }
}

function handleSubmit(event) {
  if (event) {
    event.preventDefault();
  }

  if (state.placed) {
    return;
  }

  const trimmedName = state.name.trim();
  const isCartEmpty = state.cart.length === 0;
  const isNameEmpty = trimmedName === '';

  if (isCartEmpty || isNameEmpty) {
    state.errors.cart = isCartEmpty ? 'Your cart is empty. Add an item to continue.' : '';
    state.errors.name = isNameEmpty ? 'Enter your full name to place the order.' : '';
    render();

    if (isCartEmpty) {
      const cartErrorEl = document.getElementById('cart-error');
      if (cartErrorEl) {
        cartErrorEl.focus();
      }
    } else if (isNameEmpty) {
      const nameInputEl = document.getElementById('name-input');
      if (nameInputEl) {
        nameInputEl.focus();
      }
    }
    return;
  }

  state.placed = true;

  const placeOrderBtn = document.getElementById('place-order');
  if (placeOrderBtn) {
    placeOrderBtn.disabled = true;
  }

  const orderTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  state.order = {
    reference: generateOrderReference(),
    name: trimmedName,
    address: state.address,
    total: orderTotal,
    items: [...state.cart]
  };

  render();
}

function render() {
  const cartPanelContent = document.getElementById('cart-panel-content');
  const confirmationContainer = document.getElementById('confirmation-container');

  if (state.placed && state.order) {
    if (cartPanelContent) {
      cartPanelContent.style.display = 'none';
    }
    if (confirmationContainer) {
      confirmationContainer.innerHTML = `
        <section id="confirmation" class="confirmation-box" data-testid="confirmation" role="region" aria-label="Order confirmation">
          <h2 class="confirmation-heading">Order confirmed</h2>
          <div class="confirmation-lines">
            <div class="confirmation-line">
              <span class="confirmation-label">Order reference</span>
              <strong id="order-reference" data-testid="order-reference">${state.order.reference}</strong>
            </div>
            <div class="confirmation-line">
              <span class="confirmation-label">Name</span>
              <span id="confirmed-name">${escapeHtml(state.order.name)}</span>
            </div>
            <div class="confirmation-line">
              <span class="confirmation-label">Delivery address</span>
              <span>${escapeHtml(state.order.address || state.address)}</span>
            </div>
            <div class="confirmation-line">
              <span class="confirmation-label">Estimated Delivery</span>
              <strong class="fk-delivery-date-text">${getFullDeliveryDateString(4)}</strong>
            </div>
            <div class="confirmation-line">
              <span class="confirmation-label">Total</span>
              <strong>${formatPrice(state.order.total)}</strong>
            </div>
          </div>
          <div class="confirmation-summary">
            <h3 class="summary-subheading">Items ordered</h3>
            <ul class="confirmation-items">
              ${state.order.items.map(item => `
                <li class="confirmation-item">
                  <span>${item.name} × ${item.quantity}</span>
                  <strong>${formatPrice(item.price * item.quantity)}</strong>
                </li>
              `).join('')}
            </ul>
          </div>
        </section>
      `;
    }
    return;
  }

  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
  }

  // Update dates across DOM
  const shortDate = getDeliveryDateString(4);
  const fullDate = getFullDeliveryDateString(4);
  const tshirtDateEl = document.getElementById('delivery-date-tshirt');
  if (tshirtDateEl) tshirtDateEl.textContent = shortDate;
  const toteDateEl = document.getElementById('delivery-date-tote');
  if (toteDateEl) toteDateEl.textContent = shortDate;
  const summaryDateEl = document.getElementById('summary-delivery-date');
  if (summaryDateEl) summaryDateEl.textContent = shortDate;
  const guaranteedDateEl = document.getElementById('guaranteed-delivery-date');
  if (guaranteedDateEl) guaranteedDateEl.textContent = fullDate;

  // Update card remove buttons
  const tshirtInCart = state.cart.some(item => item.id === 'tshirt');
  const tshirtRemoveBtn = document.querySelector('[data-remove-product="tshirt"]');
  if (tshirtRemoveBtn) {
    tshirtRemoveBtn.disabled = !tshirtInCart;
  }

  const toteInCart = state.cart.some(item => item.id === 'tote');
  const toteRemoveBtn = document.querySelector('[data-remove-product="tote"]');
  if (toteRemoveBtn) {
    toteRemoveBtn.disabled = !toteInCart;
  }

  const cartItemsEl = document.getElementById('cart-items');
  const cartEmptyMessage = document.getElementById('cart-empty-message');
  const priceDetailsCard = document.getElementById('price-details-card');
  const priceCountLabel = document.getElementById('price-count-label');
  const priceCountAmount = document.getElementById('price-count-amount');
  const orderTotalEl = document.getElementById('order-total');
  const cartSavingsRow = document.getElementById('cart-savings-row');
  const cartSavingsAmount = document.getElementById('cart-savings-amount');
  const cartErrorEl = document.getElementById('cart-error');
  const nameErrorEl = document.getElementById('name-error');
  const nameInputEl = document.getElementById('name-input');
  const addressInputEl = document.getElementById('address-input');

  const orderTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (orderTotalEl) {
    orderTotalEl.textContent = formatPrice(orderTotal);
  }

  if (priceCountLabel) {
    priceCountLabel.textContent = `Price (${totalCount} item${totalCount === 1 ? '' : 's'})`;
  }
  if (priceCountAmount) {
    priceCountAmount.textContent = formatPrice(orderTotal);
  }

  const totalMrp = state.cart.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
  const totalSavings = totalMrp - orderTotal;
  if (cartSavingsRow) {
    cartSavingsRow.hidden = totalSavings <= 0;
  }
  if (cartSavingsAmount) {
    cartSavingsAmount.textContent = formatPrice(totalSavings);
  }

  if (cartErrorEl) {
    cartErrorEl.textContent = state.errors.cart;
  }

  if (nameErrorEl) {
    nameErrorEl.textContent = state.errors.name;
  }

  if (nameInputEl && nameInputEl.value !== state.name) {
    nameInputEl.value = state.name;
  }

  if (addressInputEl && addressInputEl.value !== state.address) {
    addressInputEl.value = state.address;
  }

  if (state.cart.length === 0) {
    if (cartItemsEl) {
      cartItemsEl.innerHTML = '';
      cartItemsEl.hidden = true;
    }
    if (cartEmptyMessage) {
      cartEmptyMessage.hidden = false;
    }
    if (priceDetailsCard) {
      priceDetailsCard.hidden = true;
    }
  } else {
    if (cartEmptyMessage) {
      cartEmptyMessage.hidden = true;
    }
    if (priceDetailsCard) {
      priceDetailsCard.hidden = false;
    }
    if (cartItemsEl) {
      cartItemsEl.hidden = false;
      cartItemsEl.innerHTML = state.cart.map(item => {
        const lineTotal = item.price * item.quantity;
        return `
          <div class="cart-row fk-cart-row" data-testid="cart-row-${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-thumb fk-cart-thumb" />
            <div class="cart-row-main fk-cart-info">
              <span class="cart-item-name fk-item-title">${item.name}</span>
              <span class="cart-item-price fk-item-price">${formatPrice(item.price)}</span>
              <button
                type="button"
                class="btn-remove fk-btn-remove"
                data-testid="remove-${item.id}"
                aria-label="Remove ${item.name} from cart"
              >REMOVE</button>
            </div>
            <div class="cart-row-stepper fk-stepper">
              <button
                type="button"
                class="btn-stepper fk-step-btn"
                data-testid="qty-dec-${item.id}"
                aria-label="Decrease quantity for ${item.name}"
                ${item.quantity <= 1 ? 'disabled' : ''}
              >–</button>
              <span class="qty-value fk-qty-box" data-testid="qty-${item.id}">${item.quantity}</span>
              <button
                type="button"
                class="btn-stepper fk-step-btn"
                data-testid="qty-inc-${item.id}"
                aria-label="Increase quantity for ${item.name}"
                ${item.quantity >= 10 ? 'disabled' : ''}
              >+</button>
            </div>
            <div class="cart-row-right fk-row-total">
              <span class="line-total fk-item-total" data-testid="line-total-${item.id}">${formatPrice(lineTotal)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.querySelector('.fk-main-container');
  if (mainContainer) {
    mainContainer.addEventListener('click', event => {
      const target = event.target.closest('button');
      if (!target) {
        return;
      }

      const removeProductId = target.getAttribute('data-remove-product');
      if (removeProductId) {
        handleRemoveItem(removeProductId);
        return;
      }

      const testId = target.getAttribute('data-testid');
      if (testId) {
        if (testId.startsWith('product-add-')) {
          const productId = testId.replace('product-add-', '');
          handleAddToCart(productId);
        } else if (testId.startsWith('qty-inc-')) {
          const productId = testId.replace('qty-inc-', '');
          handleQuantityChange(productId, 1);
        } else if (testId.startsWith('qty-dec-')) {
          const productId = testId.replace('qty-dec-', '');
          handleQuantityChange(productId, -1);
        } else if (testId.startsWith('remove-')) {
          const productId = testId.replace('remove-', '');
          handleRemoveItem(productId);
        }
      } else if (target.id === 'btn-browse') {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  const searchInputEl = document.getElementById('product-search');
  if (searchInputEl) {
    searchInputEl.addEventListener('input', handleSearch);
  }

  const nameInputEl = document.getElementById('name-input');
  if (nameInputEl) {
    nameInputEl.addEventListener('input', handleNameInput);
  }

  const addressInputEl = document.getElementById('address-input');
  if (addressInputEl) {
    addressInputEl.addEventListener('input', handleAddressInput);
  }

  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  render();
});
