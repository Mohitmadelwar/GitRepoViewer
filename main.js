
const userForm = document.getElementById('userForm');
const usernameInput = document.getElementById('username');
const loader = document.getElementById('loader');
const repoList = document.getElementById('repoList');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const userProfile = document.getElementById('userProfile');

let currentPage = 1;

userForm.addEventListener('submit', function (event) {
    event.preventDefault();
    getRepositories();
});
userForm.style.marginTop = '20px';
userForm.style.display = 'flex';
userForm.style.alignItems = 'center';
userForm.style.justifyContent = 'center';
prevPageButton.addEventListener('click', function () {
    currentPage--;
    getRepositories();
});

nextPageButton.addEventListener('click', function () {
    currentPage++;
    getRepositories();
});

function getRepositories() {
    const loader = document.getElementById('loader');

    loader.style.display = 'block';
    repoList.innerHTML = '';
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;

    fetch(`https://api.github.com/users/${usernameInput.value}`)
        .then(response => response.json())
        .then(user => {
            userProfile.innerHTML = `
            <div style="text-align: center;">
                <img src="${user.avatar_url}" alt="${user.name}'s profile photo" width="300" height="300" style="margin-top: 20px;">
                <h2>${user.name}</h2>
                </div>`;

            fetch(`https://api.github.com/users/${usernameInput.value}/repos?page=${currentPage}&per_page=10`)
                .then(response => response.json())
                .then(repos => {
                    loader.style.display = 'none';

                    repos.forEach((repo, index) => {
                        if (index % 2 === 0) {
                            row = document.createElement('div');
                            row.classList.add('row');
                            repoList.appendChild(row);
                        }

                        const card = document.createElement('div');
                        card.classList.add('card', 'col-md-5', 'mt-5');
                        card.style.marginBottom = '5px';
                        card.style.marginRight = '50px';
                        card.style.marginLeft = '60px';
                        card.style.border = '2px solid black';

                        if (index % 2 !== 0) {
                            card.style.marginRight = '0';
                        }

                        const cardBody = document.createElement('div');
                        cardBody.classList.add('card-body');

                        const repoName = document.createElement('h5');
                        repoName.classList.add('card-title');
                        repoName.textContent = repo.name;
                        repoName.style.color = 'blue';

                        const repoDescription = document.createElement('p');
                        repoDescription.classList.add('card-text');
                        repoDescription.textContent = repo.description;

                        cardBody.appendChild(repoName);
                        cardBody.appendChild(repoDescription);
                        card.appendChild(cardBody);

                        row.appendChild(card);
                    });

                    prevPageButton.disabled = (currentPage === 1);
                    nextPageButton.disabled = (repos.length < 10);
                    currentPageSpan.textContent = `Page ${currentPage}`;
                });
        });
}
const totalRepos = 100;
const reposPerPage = 10;
const totalPages = Math.ceil(totalRepos / reposPerPage);

const pagination = document.querySelector('.pagination');
pagination.style.marginTop = '20px';

for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');

    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.href = '#';
    pageLink.textContent = i;

    pageItem.appendChild(pageLink);
    pagination.insertBefore(pageItem, nextPageButton.parentNode);
}
