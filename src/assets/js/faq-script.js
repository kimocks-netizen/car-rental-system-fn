function toggleAnswer(element) {
    const currentItem = element.parentNode;
    const allItems = document.querySelectorAll('.faq-item');

    // Close all other open items
    allItems.forEach(item => {
        if (item !== currentItem) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.display = "none";
        }
    });

    // Toggle the current item
    const answer = currentItem.querySelector('.faq-answer');
    if (currentItem.classList.contains('active')) {
        currentItem.classList.remove('active');
        answer.style.display = "none";
    } else {
        currentItem.classList.add('active');
        answer.style.display = "block";
    }
}
