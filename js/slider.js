window.addEventListener('load', () => {
    const sliderElement = document.querySelector('.slider');
    const pages = document.querySelectorAll('.slider section');
    const buttonSelector = 'nav-menu__button';

    const WHEEL_MIN = 100;
    
    const KEY_UP = 'ArrowUp';
    const KEY_LEFT = 'ArrowLeft';
    const KEY_DOWN = 'ArrowDown';
    const KEY_RIGHT = 'ArrowRight';

    let currentSlide = 1;
    let isChanging = false;
    
    const init = () => {
        // control scrolling
        const whatWheel = 'onwheel' in document.createElement('div') ?
            'wheel' :
            document.onmousewheel !== undefined ?
                'mousewheel' :
                'DOMMouseScroll';

        // change current slide by menu buttons
        document.querySelectorAll(`[class^="${buttonSelector}"]`)
            .forEach(el => {
                el.addEventListener('click', () => {
                    gotoSlide(el.getAttribute('href'));
                });
            });
        
        // watching for scroll, calculate direction and change slide
        window.addEventListener(whatWheel, (e) => {
            // protect from inertia and small changes
            if (Math.abs(e.deltaY) < WHEEL_MIN) {
                return;
            }

            const direction = e.wheelDelta || e.deltaY;
            
            if (direction > 0) {
                changeSlide(-1);
            } else {
                changeSlide(1);
            }
        });
        
        // allow keyboard input
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case KEY_LEFT:
                case KEY_UP:
                    changeSlide(-1);
                    break;

                case KEY_RIGHT:
                case KEY_DOWN:
                    changeSlide(1);
                    break;

                default:

                    break;
            }
        });
        
        // page change animation is done
        detectChangeEnd() && sliderElement.addEventListener(detectChangeEnd(), () => {
            if (isChanging) {
                setTimeout(() => {
                    isChanging = false;

                    window.location.hash =
                        document.querySelector(`.${buttonSelector}_${currentSlide}`)
                            .getAttribute('href');
                }, 150);
            }
        });
        
        // stuff for touch devices
        let touchStartPos = 0;
        let touchStopPos = 0;

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
            
            if (touchStartPos + WHEEL_MIN < touchStopPos) {
                changeSlide(-1);
            } else if (touchStartPos > touchStopPos + WHEEL_MIN) {
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
        
        changeCss(sliderElement, {
            transform: 'translate3d(0, ' + -(currentSlide - 1) * 100 + '%, 0)'
        });
    
        // change nav buttons class
        const currentActive = document.querySelector(`[class^="${buttonSelector}"].active`);
        currentActive && currentActive.classList.remove('active');

        const nextActive = document.querySelector(`a.${buttonSelector}_${currentSlide}`);
        nextActive && nextActive.classList.add('active');
    
        ga('send', 'section_view', nextActive.href);
    };
    
    // go to specific slide if it exists
    const gotoSlide = (where) => {
        const regExp = new RegExp(`${buttonSelector}_(\\d*)`)
        const target = document.querySelector(`a[href="${where}"]`)
            .className.match(regExp)[1];
        
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