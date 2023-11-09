
const BASE_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-ACC-ET-WEB-PT-A/events';

const mainEl = document.querySelector('main');
const formEl = document.querySelector('form');
const partyName = document.querySelector('#partyName');
const partyInfo = document.querySelector('#partyInfo');
const partyDateTime = document.querySelector('#partyDateTime');
const partyLocation = document.querySelector('#partyLocation');
const someDate = new Date();

// Check if someDate is a Date object
if (someDate instanceof Date) {
    const isoString = someDate.toISOString();
    console.log(isoString);
} else {
    console.error('Not a Date object');
}

async function getParties() {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (err) {
        console.error(err);
    }
}

function render(parties) {
    const template = parties.map(party => {
        return (
        `<section>
            <h2>${party.name}</h2>
            <p>${party.description}</p>
            <p>${party.date}</p>
            <p>${party.location}</p>
            <button data-id="${party.id}">Delete Party</button>
        </section>`
        )
    }).join('');
    mainEl.innerHTML = template;
}

async function partyApp() {
    const parties = await getParties();
    render(parties);
}

formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(BASE_URL, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: partyName.value,
                description: partyInfo.value,
                date: partyDateTime.value,
                location: partyLocation.value,
            })
        });

        partyName.value = '';
        partyInfo.value = '';
        partyDateTime.value = '';
        partyLocation.value = '';

        partyApp();
    } catch (err) {
        console.error(err);
        console.error('Error response:', err.response);
    }
});

mainEl.addEventListener('click', async (event) => {
    if(event.target.matches('button')) {
        const id = event.target.dataset.id;
        //console.log(id);
        await fetch(`${BASE_URL}/${id}`, {
            method: `DELETE`,
        });
        partyApp();
    }
});

partyApp();