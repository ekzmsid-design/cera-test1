const addPersonBtn = document.getElementById('add-person-btn');
const addPersonForm = document.getElementById('add-person-form');
const cancelBtn = document.getElementById('cancel-btn');
const personList = document.getElementById('person-list');
const nameInput = document.getElementById('name');
const titleInput = document.getElementById('title');
const orgInput = document.getElementById('organization');

let people = [];

function renderPeople() {
    personList.innerHTML = '';
    people.forEach((person, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${person.name}</strong><br>
            ${person.title} at ${person.organization}
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
        title: titleInput.value,
        organization: orgInput.value
    };
    people.push(newPerson);
    nameInput.value = '';
    titleInput.value = '';
    orgInput.value = '';
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
