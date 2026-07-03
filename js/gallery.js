// Progress photo gallery + optional profile picture.
// Images are downscaled to JPEG data-URLs: small enough for localStorage and
// for one-Firestore-doc-per-photo cloud sync (docs cap at 1MB).

function compressImage(file, maxEdge, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image.')); };
    img.src = url;
  });
}

// ---- gallery ----
async function addGalleryPhoto(input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;
  try {
    const data = await compressImage(file, 900, 0.8);
    const photo = { id: Date.now().toString(36), date: todayISO(), data };
    const photos = getPhotos();
    photos.push(photo);
    savePhotosLocal(photos);
    if (typeof syncPhotoToCloud === 'function') syncPhotoToCloud(photo);
    renderGallery();
  } catch (e) {
    alert(e.message || 'Could not add that photo.');
  }
}

function renderGallery() {
  const el = document.getElementById('gallery-list');
  if (!el) return;
  const photos = getPhotos().filter(p => String(p.data).startsWith('data:image/')).slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  if (!photos.length) {
    el.innerHTML = '<div class="empty-note">No progress photos yet — add your first one above. Same pose, same spot, every week or two works best.</div>';
    return;
  }
  const byDate = {};
  photos.forEach(p => { (byDate[p.date] = byDate[p.date] || []).push(p); });
  el.innerHTML = Object.keys(byDate).sort((a, b) => b.localeCompare(a)).map(date => {
    const label = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return `<div class="gal-date">${label}</div>
      <div class="gal-grid">${byDate[date].map(p =>
        `<img class="gal-thumb" src="${p.data}" alt="Progress photo ${date}" loading="lazy" onclick="openPhotoViewer('${p.id}')"/>`
      ).join('')}</div>`;
  }).join('');
}

function openPhotoViewer(id) {
  const photo = getPhotos().find(p => p.id === id);
  if (!photo || !String(photo.data).startsWith('data:image/')) return;
  let el = document.getElementById('photo-viewer');
  if (!el) {
    el = document.createElement('div');
    el.className = 'lightbox';
    el.id = 'photo-viewer';
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <button class="lightbox-close" onclick="document.getElementById('photo-viewer').hidden = true" aria-label="Close">✕</button>
    <img src="${photo.data}" alt="Progress photo"/>
    <div class="lightbox-caption">${formatDateShort(photo.date)}</div>
    <button class="link-btn" style="color:#e87a50" onclick="deleteGalleryPhoto('${photo.id}')">Delete this photo</button>`;
  el.hidden = false;
}

function deleteGalleryPhoto(id) {
  savePhotosLocal(getPhotos().filter(p => p.id !== id));
  if (typeof deletePhotoFromCloud === 'function') deletePhotoFromCloud(id);
  const viewer = document.getElementById('photo-viewer');
  if (viewer) viewer.hidden = true;
  renderGallery();
}

// ---- optional profile picture ----
async function setProfilePhoto(input) {
  const file = input.files && input.files[0];
  input.value = '';
  if (!file) return;
  try {
    const data = await compressImage(file, 256, 0.82);
    const profile = getProfile() || {};
    profile.photo = data;
    saveProfile(profile);
    updateProfileLabels();
    if (typeof renderHeaderAccount === 'function') renderHeaderAccount();
  } catch (e) {
    alert(e.message || 'Could not use that image.');
  }
}

function removeProfilePhoto() {
  const profile = getProfile() || {};
  delete profile.photo;
  saveProfile(profile);
  updateProfileLabels();
  if (typeof renderHeaderAccount === 'function') renderHeaderAccount();
}
