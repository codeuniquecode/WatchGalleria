document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.sidebar-link');
    const currentPath = window.location.pathname;

    // Set active link based on exact URL match
    links.forEach(link => {
        // Use strict equality (===) to ensure an exact match
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Add a click event listener to each link for dynamic changes
    links.forEach(link => {
        link.addEventListener('click', function() {
            // Remove 'active' class from all links
            links.forEach(item => item.classList.remove('active'));

            // Add 'active' class to the clicked link
            this.classList.add('active');
        });
    });
});
