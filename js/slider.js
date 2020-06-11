window.addEventListener('load', () => {
    const sliderElement = '.slider';
    const pages = document.querySelectorAll('.slider section');
    
    const KEY_UP = {38: 1, 33: 1};
    const KEY_DOWN = {40: 1, 34: 1};
    
    let currentSlide = 1;
    let isChanging = false;
    
    const init = () => {
        // control scrolling
        const whatWheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
    
        document.querySelectorAll('a[class^="nav-menu_button_"]').forEach(el => {
            el.addEventListener('click', () => {
                gotoSlide(el.getAttribute('href'));
            });
        });
        
        // watching for scroll, calculate direction and change slide
        window.addEventListener(whatWheel, (e) => {
            const direction = e.wheelDelta || e.deltaY;
            
            if (direction > 0) {
                changeSlide(-1);
            } else {
                changeSlide(1);
            }
        });
        
        // allow keyboard input
        window.addEventListener('keydown', (e) => {
            if (KEY_UP[e.keyCode]) {
                changeSlide(-1);
            } else if (KEY_DOWN[e.keyCode]) {
                changeSlide(1);
            }
        });
        
        // page change animation is done
        detectChangeEnd() && document.querySelector(sliderElement).addEventListener(detectChangeEnd(), () => {
            if (isChanging) {
                setTimeout(() => {
                    isChanging = false;
                    window.location.hash = document.querySelector('.nav-menu_button_' + currentSlide).getAttribute('href');
                }, 150);
            }
        });
        
        // stuff for touch devices
        let touchStartPos = 0;
        let touchStopPos = 0;
        let touchMinLength = 90;
        
        document.querySelector('.slider').addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                let touch = e.touches[0] || e.changedTouches[0];
                touchStartPos = touch.pageY;
            }
        });
    
        document.querySelector('.slider').addEventListener('touchend', (e) => {
            e.preventDefault();
            
            if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                let touch = e.touches[0] || e.changedTouches[0];
                touchStopPos = touch.pageY;
            }
            
            if (touchStartPos + touchMinLength < touchStopPos) {
                changeSlide(-1);
            } else if (touchStartPos > touchStopPos + touchMinLength) {
                changeSlide(1);
            }
        });
    };
    
    // prevent double scrolling
    const detectChangeEnd = () => {
        const e = document.createElement('foobar');
        const transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };
        
        for (let transition in transitions) {
            if (e.style[transition] !== undefined) {
                return transitions[transition];
            }
        }
        
        return true;
    };
    
    // handle css change
    const changeCss = (obj, styles) => {
        for (let _style in styles) {
            if (obj.style[_style] !== undefined) {
                obj.style[_style] = styles[_style];
            }
        }
    };
    
    // handle page/section change
    const changeSlide = (direction) => {
        // already doing it or last/first page, staph plz
        if (isChanging || (direction === 1 && currentSlide === pages.length) || (direction === -1 && currentSlide === 1)) {
            return;
        }
        
        // change page
        currentSlide += direction;
        isChanging = true;
        
        changeCss(document.querySelector(sliderElement), {
            transform: 'translate3d(0, ' + -(currentSlide - 1) * 100 + '%, 0)'
        });
    
        // change nav buttons class
        const currentActive = document.querySelector('a[class^="nav-menu_button_"].active');
        currentActive && currentActive.classList.remove('active');
        
        const nextActive = document.querySelector('a.nav-menu_button_' + currentSlide);
        nextActive && nextActive.classList.add('active');
    };
    
    // go to spesific slide if it exists
    const gotoSlide = (where) => {
        const target = document.querySelector(`a[href="${where}"]`).className.match(/nav-menu_button_(\d*)/)[1];
        
        if (target !== currentSlide && document.querySelector(where)) {
            changeSlide(target - currentSlide);
        }
    };
    
    // if page is loaded with hash, go to slide
    if (location.hash) {
        setTimeout(() => {
            window.scrollTo(0, 0);
            gotoSlide(location.hash);
        }, 1);
    }
    
    // we have lift off
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('onload', init(), false);
    }
    
    // expose gotoSlide function
    return {
        gotoSlide
    }
});