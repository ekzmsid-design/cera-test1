const addPersonBtn = document.getElementById('add-person-btn');
const addPersonForm = document.getElementById('add-person-form');
const cancelBtn = document.getElementById('cancel-btn');
const personList = document.getElementById('person-list');
const nameInput = document.getElementById('name');
const groupInput = document.getElementById('group');
const companyInput = document.getElementById('company');
const birthdayInput = document.getElementById('birthday');
const memoInput = document.getElementById('memo');
const photoInput = document.getElementById('photo');

const listView = document.getElementById('list-view');
const personDetailView = document.getElementById('person-detail-view');
const personDetails = document.getElementById('person-details');
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const backToListBtn = document.getElementById('back-to-list-btn');
const commentInput = document.getElementById('comment-input');

let people = [];
let currentPersonId = null;

// --- Firestore Listener ---
db.collection("people").orderBy("name").onSnapshot((snapshot) => {
    people = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPeople();
});

function renderPeople() {
    personList.innerHTML = '';
    people.forEach(person => {
        const li = document.createElement('li');
        li.dataset.id = person.id;
        const photoHtml = person.photo ? `<img src="${person.photo}" alt="${person.name}" class="thumbnail">` : '';
        li.innerHTML = `
            ${photoHtml}
            <div>
                <strong>${person.name}</strong><br>
                그룹: ${person.group || ''}<br>
                직장: ${person.company || ''}<br>
            </div>
            <button class="delete-btn" data-id="${person.id}">삭제</button>
        `;
        personList.appendChild(li);
    });
}

// --- Event Listeners ---
addPersonBtn.addEventListener('click', () => {
    addPersonForm.classList.remove('hidden');
    addPersonBtn.classList.add('hidden');
});

cancelBtn.addEventListener('click', () => {
    addPersonForm.classList.add('hidden');
    addPersonBtn.classList.remove('hidden');
});

addPersonForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const photoFile = photoInput.files[0];
    let photoUrl = '';

    if (photoFile) {
        const filename = `photos/${Date.now()}-${photoFile.name}`;
        const photoRef = storage.ref().child(filename);
        await photoRef.put(photoFile);
        photoUrl = await photoRef.getDownloadURL();
    }

    const newPerson = {
        name: nameInput.value,
        group: groupInput.value,
        company: companyInput.value,
        birthday: birthdayInput.value,
        memo: memoInput.value,
        photo: photoUrl,
        comments: []
    };

    await db.collection("people").add(newPerson);

    nameInput.value = '';
    groupInput.value = '';
    companyInput.value = '';
    birthdayInput.value = '';
    memoInput.value = '';
    photoInput.value = '';
    addPersonForm.classList.add('hidden');
    addPersonBtn.classList.remove('hidden');
});

personList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const personId = e.target.dataset.id;
        const person = people.find(p => p.id === personId);
        if (person && person.photo) {
            try {
                await storage.refFromURL(person.photo).delete();
            } catch (error) {
                console.error("Error deleting photo:", error);
            }
        }
        await db.collection("people").doc(personId).delete();
    } else {
        const personId = e.target.closest('li')?.dataset.id;
        if (personId) {
            currentPersonId = personId;
            renderPersonDetail();
            listView.classList.add('hidden');
            personDetailView.classList.remove('hidden');
        }
    }
});

backToListBtn.addEventListener('click', () => {
    personDetailView.classList.add('hidden');
    listView.classList.remove('hidden');
    currentPersonId = null;
});

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newComment = commentInput.value;
    if (newComment && currentPersonId) {
        db.collection("people").doc(currentPersonId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment)
        }).then(() => {
            commentInput.value = '';
        });
    }
});


function renderPersonDetail() {
    const person = people.find(p => p.id === currentPersonId);
    if (!person) return;

    const photoHtml = person.photo ? `<img src="${person.photo}" alt="${person.name}" class="detail-photo">` : '';
    personDetails.innerHTML = `
        ${photoHtml}
        <strong>${person.name}</strong><br>
        그룹: ${person.group || ''}<br>
        직장: ${person.company || ''}<br>
        생일: ${person.birthday || ''}<br>
        메모: ${person.memo || ''}
    `;
    renderComments();
}

function renderComments() {
    const person = people.find(p => p.id === currentPersonId);
    if (!person) return;

    commentsList.innerHTML = '';
    person.comments.forEach(comment => {
        const li = document.createElement('div');
        li.classList.add('comment');
        li.textContent = comment;
        commentsList.appendChild(li);
    });
}

