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

let people = [];
let currentPersonIndex = null;

function renderPeople() {
    personList.innerHTML = '';
    people.forEach((person, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        const photoHtml = person.photo ? `<img src="${person.photo}" alt="${person.name}" class="thumbnail">` : '';
        li.innerHTML = `
            ${photoHtml}
            <div>
                <strong>${person.name}</strong><br>
                그룹: ${person.group || ''}<br>
                직장: ${person.company || ''}<br>
            </div>
            <button class="delete-btn" data-index="${index}">삭제</button>
        `;
        personList.appendChild(li);
    });
}

addPersonBtn.addEventListener('click', () => {
    addPersonForm.classList.remove('hidden');
    addPersonBtn.classList.add('hidden');
});

cancelBtn.addEventListener('click', () => {
    addPersonForm.classList.add('hidden');
    addPersonBtn.classList.remove('hidden');
});

addPersonForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newPerson = {
        name: nameInput.value,
        photo: '',
        group: groupInput.value,
        company: companyInput.value,
        birthday: birthdayInput.value,
        memo: memoInput.value,
        comments: []
    };

    const photoFile = photoInput.files[0];

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newPerson.photo = event.target.result;
            people.push(newPerson);
            resetAndRender();
        };
        reader.readAsDataURL(photoFile);
    } else {
        people.push(newPerson);
        resetAndRender();
    }

    function resetAndRender() {
        nameInput.value = '';
        photoInput.value = '';
        groupInput.value = '';
        companyInput.value = '';
        birthdayInput.value = '';
        memoInput.value = '';
        addPersonForm.classList.add('hidden');
        addPersonBtn.classList.remove('hidden');
        renderPeople();
        savePeople();
    }
});

const listView = document.getElementById('list-view');
const personDetailView = document.getElementById('person-detail-view');
const personDetails = document.getElementById('person-details');
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const backToListBtn = document.getElementById('back-to-list-btn');

backToListBtn.addEventListener('click', () => {
    personDetailView.classList.add('hidden');
    listView.classList.remove('hidden');
    currentPersonIndex = null;
});

personList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        people.splice(index, 1);
        renderPeople();
        savePeople();
    } else if (e.target.closest('li')) {
        currentPersonIndex = e.target.closest('li').dataset.index;
        renderPersonDetail();
        listView.classList.add('hidden');
        personDetailView.classList.remove('hidden');
    }
});

const commentInput = document.getElementById('comment-input');

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newComment = commentInput.value;
    if (newComment) {
        people[currentPersonIndex].comments.push(newComment);
        commentInput.value = '';
        renderComments();
        savePeople();
    }
});

function renderPersonDetail() {
    const person = people[currentPersonIndex];
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
    const person = people[currentPersonIndex];
    commentsList.innerHTML = '';
    person.comments.forEach(comment => {
        const li = document.createElement('div');
        li.classList.add('comment');
        li.textContent = comment;
        commentsList.appendChild(li);
    });
}

function savePeople() {
    localStorage.setItem('people', JSON.stringify(people));
}

function loadPeople() {
    const savedPeople = localStorage.getItem('people');
    if (savedPeople) {
        people = JSON.parse(savedPeople);
        renderPeople();
    }
}

loadPeople();

