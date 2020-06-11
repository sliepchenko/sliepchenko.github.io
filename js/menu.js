window.addEventListener('load', () => {
    const header = document.querySelector('header');
    const toggle = document.querySelector('.mobile-nav-toggle');
    const icon = toggle.querySelector('i');
    
    header.addEventListener('click', () => {
        header.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
    
    toggle.addEventListener('click', () => {
        header.classList.toggle('active');
        
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
});