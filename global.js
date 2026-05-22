const API_BASE_URL = "http://localhost:3000";
const CURRENT_USER_ID = "00000003";
let orderCache = [];

const dropdownActions = [
  {
    label: 'Logout',
    action: () => {
      window.location.href = '/login.html';
    }
  }
];

function createHeaderDropdown() {
  const profile = document.querySelector('.header-actions .profile');
  if (!profile) return;

  const headerActions = profile.closest('.header-actions');
  if (!headerActions) return;

  let menu = headerActions.querySelector('.header-dropdown-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.className = 'header-dropdown-menu';

    dropdownActions.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'header-dropdown-item';
      button.textContent = item.label;
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        item.action();
      });
      menu.appendChild(button);
    });

    headerActions.appendChild(menu);
  }

  profile.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
  });

  menu.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createHeaderDropdown();

  const navButtons = document.querySelectorAll('.dashboard-sidebar .link');
  if (!navButtons.length) return;

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const titleElement = button.querySelector('.nav-title');
      const pageKey = titleElement ? titleElement.textContent.trim() : null;
      const targetPage = pageKey ? dashboardRoutes[pageKey] : null;
      if (!targetPage) return;

      const currentPath = window.location.pathname.split('/').pop();
      if (currentPath === targetPage) {
        window.location.reload();
      } else {
        window.location.href = targetPage;
      }
    });
  });
});

function formatPrice(number){
	if (typeof number === 'string') {
		number = parseFloat(number);
	}
	return number.toFixed(2)
}

function categoryAddPlace(category) {
	return category.map((item, index, arr) => {
		return {
			name: item,
			place: arr.length - 2 - index
		};
	});
}



async function loadProducts() {
	try {
		const response = await fetch(`${API_BASE_URL}/products`);

		const data = await response.json();

		return data;

	} catch (err) {
		console.error("Error fetching products:", err);
	}
}

async function popularProducts() {
	try {
		const response = await fetch(`${API_BASE_URL}/products/popular`);
		const data = await response.json();
		return data;
	} catch (err) {
		console.error("Error fetching popular products:", err);
	}
}

async function discountedProducts() {
	try {
		const response = await fetch(`${API_BASE_URL}/products/discount`);
		const data = await response.json();
		return data;
	} catch (err) {
		console.error("Error fetching discounted products:", err);
	}
}

async function getCategories() {
	try {
		const response = await fetch(`${API_BASE_URL}/products/categories`);
		const data = await response.json();
		let categoryNames = data.map((cat) => cat.product_type);
		return categoryAddPlace(categoryNames);
	} catch (err) {
		console.error("Error fetching categories:", err);
	}
}

async function getCart() {
	try {
		const response = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}`);
		const data = await response.json();
		return data;
	} catch (err) {
		console.error("Error fetching cart:", err);
		return [];
	}
}

async function addToCart(productId, quantity) {
	try {
		const response = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}/${productId}/${quantity}`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		});
		return await response.json();
	} catch (err) {
		console.error("Error adding item to cart:", err);
	}
}

async function removeFromCart(productId) {
	try {
		const response = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}/${productId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});
		return await response.json();
	} catch (err) {
		console.error("Error removing item from cart:", err);
	}
}

async function updateCart(productId, quantity) {
	try {
		const response = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}/${productId}/${quantity}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' }
		});
		return await response.json();
	} catch (err) {
		console.error("Error updating item in cart:", err);
  }
}

async function quickBuy(productId, quantity) {
	try {
		const quickCart = await fetch(`${API_BASE_URL}/cart/${CURRENT_USER_ID}/${productId}/${quantity}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' }
		});

		const quickOrder = await fetch(`${API_BASE_URL}/orders/${CURRENT_USER_ID}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		return await quickOrder.json();
	} catch (err) {
		console.error('Error creating order:', err);
	}
}

async function getOrders() {
	try {
		const response = await fetch(`${API_BASE_URL}/orders/${CURRENT_USER_ID}`);
		return await response.json();
	} catch (err) {
		console.error("Error fetching orders:", err);
	}
}

async function addOrder() {
	try {
		const response = await fetch(`${API_BASE_URL}/orders/${CURRENT_USER_ID}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		return await response.json();
	} catch (err) {
		console.error('Error creating order:', err);
	}
}
