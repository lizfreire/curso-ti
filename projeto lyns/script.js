// Variáveis globais
let cartItems = [];
let cartCount = 0;

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
});

// Função principal de inicialização
function initializeSite() {
    setupNavigation();
    setupCart();
    setupForms();
    setupAnimations();
    setupScrollEffects();
    setupProductInteractions();
}

// Configuração da navegação
function setupNavigation() {
    // Scroll suave para links de navegação
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Menu mobile (se necessário no futuro)
    createMobileMenu();
}

// Cria menu mobile para responsividade
function createMobileMenu() {
    const header = document.querySelector('.header .container');
    const nav = document.querySelector('.nav');
    
    // Verifica se precisa de menu mobile
    if (window.innerWidth <= 768) {
        // Cria botão hamburger
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        hamburgerBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
        `;
        
        header.insertBefore(hamburgerBtn, nav);
        
        // Adiciona estilo ao menu mobile
        nav.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #FF6B9D, #C66FBC);
            padding: 1rem;
            display: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        `;
        
        // Toggle menu
        hamburgerBtn.addEventListener('click', function() {
            const isVisible = nav.style.display === 'block';
            nav.style.display = isVisible ? 'none' : 'block';
        });
        
        // Mostra/esconde botão hamburger
        function toggleHamburger() {
            hamburgerBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
            nav.style.display = window.innerWidth > 768 ? 'flex' : nav.style.display;
        }
        
        toggleHamburger();
        window.addEventListener('resize', toggleHamburger);
    }
}

// Configuração do carrinho de compras
function setupCart() {
    // Adiciona produtos ao carrinho
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            addToCart(productName, productPrice);
            showNotification('Produto adicionado ao carrinho!');
        });
    });

    // Click no ícone do carrinho
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }
}

// Adicionar item ao carrinho
function addToCart(name, price) {
    const item = {
        id: Date.now(),
        name: name,
        price: price,
        quantity: 1
    };
    
    cartItems.push(item);
    cartCount++;
    updateCartDisplay();
}

// Atualizar display do carrinho
function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        // Animação
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Mostrar modal do carrinho
function showCartModal() {
    const modal = createCartModal();
    document.body.appendChild(modal);
    
    // Animação de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Criar modal do carrinho
function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    let cartHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #2C3E50;">Seu Carrinho</h3>
        <button class="close-modal" style="
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #7F8C8D;
        "><i class="fas fa-times"></i></button>
    `;
    
    if (cartItems.length === 0) {
        cartHTML += '<p style="text-align: center; color: #7F8C8D;">Seu carrinho está vazio</p>';
    } else {
        let total = 0;
        cartHTML += '<div class="cart-items">';
        
        cartItems.forEach(item => {
            const priceNum = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
            total += priceNum;
            cartHTML += `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #F8F9FA;
                ">
                    <div>
                        <h4 style="margin: 0; color: #2C3E50;">${item.name}</h4>
                        <p style="margin: 0.25rem 0; color: #7F8C8D;">${item.price}</p>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="
                        background: #FF6B9D;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 20px;
                        cursor: pointer;
                    ">Remover</button>
                </div>
            `;
        });
        
        cartHTML += '</div>';
        cartHTML += `
            <div style="
                margin-top: 1.5rem;
                padding-top: 1rem;
                border-top: 2px solid #FF6B9D;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h4 style="margin: 0; color: #2C3E50;">Total: R$ ${total.toFixed(2).replace('.', ',')}</h4>
                <button style="
                    background: linear-gradient(45deg, #FF6B9D, #C66FBC);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                ">Finalizar Compra</button>
            </div>
        `;
    }
    
    modalContent.innerHTML = cartHTML;
    modal.appendChild(modalContent);
    
    // Fechar modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.closest('.close-modal')) {
            modal.remove();
        }
    });
    
    return modal;
}

// Remover item do carrinho
function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    cartCount = Math.max(0, cartCount - 1);
    updateCartDisplay();
    
    // Recarrega o modal
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
        showCartModal();
    }
}

// Configuração dos formulários
function setupForms() {
    // Formulário de contato
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simula envio
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            showNotification('Obrigado por se inscrever! Você receberá nossas novidades.');
            this.reset();
        });
    }
}

// Configuração das animações
function setupAnimations() {
    // Animação de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.product-card, .section-header, .about-text, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Configuração de efeitos de scroll
function setupScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Esconde/mostra header no scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Adiciona sombra no header
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// Configuração das interações dos produtos
function setupProductInteractions() {
    // Hover effect nos produtos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Click nas imagens dos produtos (para zoom no futuro)
    const productImages = document.querySelectorAll('.product-image');
    productImages.forEach(image => {
        image.addEventListener('click', function() {
            // Placeholder para funcionalidade de zoom
            console.log('Zoom da imagem - funcionalidade futura');
        });
    });
}

// Sistema de notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        success: 'linear-gradient(45deg, #6BCF7F, #4CAF50)',
        error: 'linear-gradient(45deg, #FF6B9D, #FF4757)',
        info: 'linear-gradient(45deg, #7873F5, #5F27CD)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove automaticamente
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Funções utilitárias
function formatPrice(price) {
    return parseFloat(price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading para imagens (quando implementadas)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicialização do lazy loading
setupLazyLoading();

// Exporta funções para uso global
window.removeFromCart = removeFromCart;
window.showNotification = showNotification;
