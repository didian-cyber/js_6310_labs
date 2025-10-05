'use strict'

function addBarbieMode() {
    function toggleBarbieMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            const currentBg = pageWrapper.style.backgroundColor;
            
            if (currentBg === 'rgb(255, 137, 198)' || currentBg === '#ff89c6ff') {
                removeBarbieStyles();
                localStorage.setItem('barbiecoreEnabled', 'false');
            } else {
                applyBarbieStyles();
                localStorage.setItem('barbiecoreEnabled', 'true');
            }
        } else {
            console.log('Элемент с id="page_wrapper" не найден');
        }
    }
    
    function applyBarbieStyles() {
        // 1. основной контейнер
        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            pageWrapper.style.backgroundColor = '#ff89c6ff';
            pageWrapper.style.color = '#a70062ff';
            pageWrapper.style.fontFamily = 'Vollkorn';
            pageWrapper.style.padding = '10px';
        }
        
        // 2. слайдер
        const mainSlider = document.querySelector('.main_slider_holder');
        if (mainSlider) {
            mainSlider.style.backgroundColor = '#ff80abff';
            mainSlider.style.borderRadius = '10px';
            mainSlider.style.padding = '15px';
        }
        
        // 3. новостной блок
        const newsBox = document.querySelector('.news_box');
        if (newsBox) {
            newsBox.style.backgroundColor = '#fff1f5ff';
            newsBox.style.border = '5px solid #ff80abff';
            newsBox.style.borderRadius = '10px';
            newsBox.style.padding = '15px';
        }
        
        // 4. основной контент
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.backgroundColor = '#ffc7d8ff';
            mainContent.style.border = '3px solid #f0769fff';
            mainContent.style.borderRadius = '10px';
            mainContent.style.padding = '10px';
            mainContent.style.margin = '10px';
        }
        
        // 5. внутренний контент
        const content = document.getElementById('content');
        if (content) {
            content.style.backgroundColor = '#63d0ff';
            content.style.border = '3px solid #16b9ff';
            content.style.borderRadius = '10px';
            content.style.padding = '5px';
        }
        
        // 6. футер
        const footer = document.querySelector('footer');
        if (footer) {
            footer.style.backgroundColor = '#ff4081';
            footer.style.color = 'white';
        }
        // 7. Используем parentElement и children
        if (mainContent) {
            const contentParent = mainContent.parentElement;
            if (contentParent && contentParent.children) {
                for (let child of contentParent.children) {
                    if (child.tagName === 'DIV') {
                        child.style.backgroundColor = '#f7b3caff';
                        child.style.border = '1px solid #ff80abff';
                    }
                }
            }
        }
        
        // 8. сложный селектор для навигации
        const navItems = document.querySelectorAll('li.lfr-nav-item');
        navItems.forEach(item => {
            item.style.backgroundColor = '#16b9ff';
        });
        
        // 9. сложный селектор для кнопок
        const buttons = document.querySelectorAll('button, .btn, a[href*="rss"], .bar_btns, .kai-btn-block');
        buttons.forEach(button => {
            button.style.backgroundColor = '#ff4081ff';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.padding = '3px';
            button.style.margin = '3px';
        });
        
        updateButtonText();
    }
    
    function removeBarbieStyles() {
        const elements = [
            document.getElementById('page_wrapper'),
            document.querySelector('.main_slider_holder'),
            document.querySelector('.news_box'),
            document.getElementById('main-content'),
            document.getElementById('content'),
            document.querySelector('footer')
        ];
        
        elements.forEach(element => {
            if (element) element.style.cssText = '';
        });
        const navItems = document.querySelectorAll('li.lfr-nav-item');
        const buttons = document.querySelectorAll('button, .btn, a[href*="rss"], .bar_btns, .kai-btn-block');

        const allElements = [...navItems, ...buttons];
        allElements.forEach(element => {
            element.style.cssText = '';
        });
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const contentParent = mainContent.parentElement;
            if (contentParent && contentParent.children) {
                for (let child of contentParent.children) {
                    if (child.tagName === 'DIV') {
                        child.style.cssText = '';
                    }
                }
            }
        }
        
        updateButtonText();
    }
    
    function updateButtonText() {
        const button = document.getElementById('barbie-toggle-btn');
        if (button) {
            const isEnabled = localStorage.getItem('barbiecoreEnabled') === 'true';
            button.textContent = isEnabled ? '💖 ON' : '💖 OFF';
            button.style.backgroundColor = isEnabled ? '#ff5c93ff' : '#ff4081ff';
        }
    }
    
    function createToggleButton() {
        if (document.getElementById('barbie-toggle-btn')) {
            return;
        }

        let buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10000;
            `;
            document.body.appendChild(buttonContainer);
        }

        const button = document.createElement('div');
        button.id = 'barbie-toggle-btn';
        
        const isEnabled = localStorage.getItem('barbiecoreEnabled') === 'true';
        button.textContent = isEnabled ? '💖 ON' : '💖 OFF';
        button.title = 'Переключить Barbiecore режим';
        
        Object.assign(button.style, {
            width: '80px',
            height: '30px',
            border: 'none',
            backgroundColor: isEnabled ? '#ff5c93ff' : '#ff4081ff',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(255,64,129,0.3)',
            textAlign: 'center',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', toggleBarbieMode);
        buttonContainer.appendChild(button);
        
        if (isEnabled) {
            setTimeout(applyBarbieStyles, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addBarbieMode();