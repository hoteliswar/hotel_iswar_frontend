const openRoomModal = document.getElementById('openAddModal');

document.addEventListener('click', function (e) {
    if (e.target.id === 'openAddModal') {
        showBookingModal();
    }
});

// Show booking modal
function showBookingModal() {

    const modal = document.getElementById('bookingModal');
    // const modalBody = modal.querySelector('.modal-body');
    setTimeout(() => modal.classList.add('show'), 10);

    // modalBody.innerHTML = modalContent;

    modal.style.display = 'block';
}


document.querySelector('.close').onclick = function () {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

// add images

let uploadedImages = [];

document.getElementById('roomImage').addEventListener('change', function(event) {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedImages.push(e.target.result);
            updateImagePreview();
        }
        
        reader.readAsDataURL(file);
    }
});

function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = ''; // Clear existing previews
    
    uploadedImages.forEach((imageSrc, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = function() {
            uploadedImages.splice(index, 1);
            updateImagePreview();
        };
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        preview.appendChild(imgContainer);
    });
}

