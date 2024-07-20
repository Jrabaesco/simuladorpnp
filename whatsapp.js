document.getElementById('whatsapp-button').addEventListener('click', function() {
    var dialog = document.getElementById('whatsapp-dialog');
    dialog.style.display = dialog.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('close-dialog').addEventListener('click', function() {
    var dialog = document.getElementById('whatsapp-dialog');
    dialog.style.display = 'none';
});

document.getElementById('openChatButton').addEventListener('click', function() {
    var phoneNumber = '51948593198';
    var whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=Hola! deseo información con relación al balotario dinámico';
    window.open(whatsappUrl, '_blank');
});
