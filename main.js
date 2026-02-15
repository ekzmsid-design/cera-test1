const addPersonBtn = document.getElementById('add-person-btn');
const addPersonForm = document.getElementById('add-person-form');
const cancelBtn = document.getElementById('cancel-btn');
const personList = document.getElementById('person-list');
const nameInput = document.getElementById('name');
const groupInput = document.getElementById('group');
const companyInput = document.getElementById('company');
const birthdayInput = document.getElementById('birthday');
const memoInput = document.getElementById('memo');

let people = [];

function renderPeople() {
    personList.innerHTML = '';
    people.forEach((person, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${person.name}</strong><br>
            그룹: ${person.group || ''}<br>
            직장: ${person.company || ''}<br>
            생일: ${person.birthday || ''}<br>
            메모: ${person.memo || ''}
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
        group: groupInput.value,
        company: companyInput.value,
        birthday: birthdayInput.value,
        memo: memoInput.value
    };
    people.push(newPerson);
    nameInput.value = '';
    groupInput.value = '';
    companyInput.value = '';
    birthdayInput.value = '';
    memoInput.value = '';
    addPersonForm.classList.add('hidden');
    addPersonBtn.classList.remove('hidden');
    renderPeople();
});

personList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        people.splice(index, 1);
        renderPeople();
    }
});
