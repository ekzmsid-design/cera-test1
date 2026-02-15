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
    console.log("Firestore onSnapshot triggered.");
    people = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderPeople();
    console.log("People data loaded:", people);
}, (error) => {
    console.error("Error listening to Firestore:", error);
    alert("인물 목록을 불러오는 중 오류가 발생했습니다: " + error.message);
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
    console.log("Add person form submitted.");
    const photoFile = photoInput.files[0];
    let photoUrl = '';

    if (photoFile) {
        console.log("Photo file selected, uploading to Storage...");
        const filename = `photos/${Date.now()}-${photoFile.name}`;
        const photoRef = storage.ref().child(filename);
        try {
            await photoRef.put(photoFile);
            photoUrl = await photoRef.getDownloadURL();
            console.log("Photo uploaded, URL:", photoUrl);
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("사진 업로드 중 오류가 발생했습니다: " + error.message);
            return; // Stop execution if photo upload fails
        }
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

    console.log("Adding new person to Firestore:", newPerson);
    try {
        await db.collection("people").add(newPerson);
        console.log("Person added to Firestore successfully.");
    } catch (error) {
        console.error("Error adding person to Firestore:", error);
        alert("인물 정보 저장 중 오류가 발생했습니다: " + error.message);
        return; // Stop execution if adding person fails
    }

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
            console.log("Deleting photo from Storage:", person.photo);
            try {
                await storage.refFromURL(person.photo).delete();
                console.log("Photo deleted successfully.");
            } catch (error) {
                console.error("Error deleting photo:", error);
                // Don't stop deletion of the person even if photo fails
            }
        }
        console.log("Deleting person from Firestore:", personId);
        try {
            await db.collection("people").doc(personId).delete();
            console.log("Person deleted from Firestore successfully.");
        } catch (error) {
            console.error("Error deleting person from Firestore:", error);
            alert("인물 정보 삭제 중 오류가 발생했습니다: " + error.message);
        }
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
        console.log("Adding comment to person:", currentPersonId, "Comment:", newComment);
        db.collection("people").doc(currentPersonId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(newComment)
        }).then(() => {
            commentInput.value = '';
            console.log("Comment added successfully.");
        }).catch((error) => {
            console.error("Error adding comment:", error);
            alert("댓글 추가 중 오류가 발생했습니다: " + error.message);
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

