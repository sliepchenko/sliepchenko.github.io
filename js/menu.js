window.addEventListener('load', () => {
    const header = document.querySelector('.header');
    const toggle = document.querySelector('.nav-menu__toggle');
    const buttons = document.querySelectorAll('.nav-menu__button');
    const icon = toggle.querySelector('i');
    
    toggle.addEventListener('click', () => {
        header.classList.toggle('active');

        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    Array.from(buttons).forEach(button => {
        button.addEventListener('click', () => {
            header.classList.remove('active');

            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
});