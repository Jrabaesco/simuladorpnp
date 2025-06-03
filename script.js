 // Efecto de desplazamiento suave para los enlaces del menú
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Cambiar el header al hacer scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                header.style.padding = '0.5rem 0';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.padding = '1rem 0';
            }
        });
        
        // Animación para las tarjetas de servicios al aparecer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.service-card').forEach(card => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
        
        // Efecto hover para enlaces del menú
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'scale(1.1)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'scale(1)';
            });
        });
        
        // Mostrar/ocultar tooltip de WhatsApp en móviles
        const whatsappBtn = document.querySelector('.whatsapp-float');
        if (window.innerWidth <= 768) {
            let tapCount = 0;
            whatsappBtn.addEventListener('click', (e) => {
                tapCount++;
                if (tapCount === 1) {
                    e.preventDefault();
                    const tooltip = document.createElement('div');
                    tooltip.className = 'whatsapp-tooltip-mobile';
                    tooltip.style.position = 'fixed';
                    tooltip.style.bottom = '100px';
                    tooltip.style.left = '20px';
                    tooltip.style.backgroundColor = 'var(--blanco)';
                    tooltip.style.color = 'var(--gris-oscuro)';
                    tooltip.style.padding = '0.5rem 1rem';
                    tooltip.style.borderRadius = '5px';
                    tooltip.style.fontSize = '0.9rem';
                    tooltip.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                    tooltip.style.zIndex = '1000';
                    tooltip.textContent = '¿Tienes alguna consulta? Escríbenos';
                    
                    document.body.appendChild(tooltip);
                    
                    setTimeout(() => {
                        tooltip.remove();
                        tapCount = 0;
                    }, 2000);
                } else if (tapCount === 2) {
                    window.location.href = whatsappBtn.href;
                }
            });
        }