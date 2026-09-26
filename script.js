document.addEventListener('DOMContentLoaded', () => {

    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));

    let cart = [];
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const proModal = document.getElementById('proModal');

    const toggleCart = (state) => {
        if (state) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
        } else {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    };

    document.getElementById('cartNavBtn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart(true);
    });
    
    document.getElementById('closeCartBtn').addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const img = e.target.dataset.img;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty++;
            } else {
                cart.push({ name, price, img, qty: 1 });
            }
            
            updateCartUI();

            const originalText = e.target.innerText;
            const originalBg = window.getComputedStyle(e.target).backgroundColor;
            
            e.target.innerText = "Added ✓";
            e.target.style.backgroundColor = "var(--color-green)";
            
            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.style.backgroundColor = originalBg;
            }, 1200);
        });
    });

    const updateCartUI = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.qty;
                count += item.qty;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                        <div class="qty-controls">
                            <button class="qty-btn" data-name="${item.name}" data-action="decrease">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" data-name="${item.name}" data-action="increase">+</button>
                        </div>
                    </div>
                    <div class="item-total">$${(item.price * item.qty).toFixed(2)}</div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        cartCount.textContent = count;
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    };

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const name = e.target.dataset.name;
            const action = e.target.dataset.action;
            const item = cart.find(i => i.name === name);
            
            if (item) {
                if (action === 'increase') item.qty++;
                if (action === 'decrease') item.qty--;
                if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
                updateCartUI();
            }
        }
    });

    const toggleModal = (state, title = '', desc = '') => {
        if (state) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDesc').textContent = desc;
            proModal.classList.add('show-modal');
        } else {
            proModal.classList.remove('show-modal');
        }
    };

    document.getElementById('closeModalBtn').addEventListener('click', () => toggleModal(false));

    document.getElementById('proForm').addEventListener('submit', (e) => {
        e.preventDefault();
        toggleModal(true, "Subscription Confirmed!", "Thank you! Your custom box request has been received.");
        e.target.reset();
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Please add items to the cart first!");
            return;
        }
        toggleCart(false);
        toggleModal(true, "Order Confirmed!", "Your smoothies are being prepared and will be dispatched shortly. Enjoy!");
        cart = [];
        updateCartUI();
    });
});