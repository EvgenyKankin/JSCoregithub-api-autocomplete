let searchInput = document.querySelector(".search-input");
let autocompliteContainer = document.querySelector(".autocomplite-container");
let deleteButton = document.querySelector(".delete-repo");
let repoList = document.querySelector(".repo-list");
let arr = null;

searchInput.addEventListener('keyup', searchRepo);

document.addEventListener('click', function (e) {
    if (e.target && !e.target.matches('.autocomplite-container') && !e.target.matches('.search-input')) {
        autocompliteContainer.style.display = 'none';}
})

searchInput.addEventListener('focus', function () {autocompliteContainer.style.display = 'block';});

autocompliteContainer.addEventListener('click', function(e) {
    if (e.target && e.target.matches('.autocomplite-items')) {
        addElement(e);}
});

repoList.addEventListener('click', function(e) {
    if (e.target && e.target.matches('.delete-repo')) {
        deleteElement(e);}
});

function searchRepo() {
    let lastChar = [...searchInput.value].at(-1);
    if (!/^[^a-zA-Z0-9]+$/.test(lastChar)) {return getRepo()}
}

async function getRepo() {
    if (searchInput.value !== ""){
    let response = await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`); 
        if (response.ok) {
            result = await response.json().then(res => {createAutocomplite(res)});}    
        else {
            return console.log("Ошибка запроса к API");
            }       
}}



function createAutocomplite(res) {
    autocompliteContainer.replaceChildren();
    arr=res;
    for (let i = 0; i<5; i++) {
        let item = res.items[i];
        const newDiv = document.createElement('div');
        newDiv.textContent = `${item.name}`;
        newDiv.classList.add('autocomplite-items');
        let keyArr = res.items;
        let key = Object.keys(keyArr)[i];
        newDiv.id = key;
        autocompliteContainer.append(newDiv);
    }
};

function addElement(e) {
    let id = e.target.id;
    let item = arr.items[id];
    let name = item.name;
    let owner = item.full_name;
    let stars = item.stargazers_count;
    let newLi = document.createElement('li');
    newLi.classList.add('repo-card');
    let newDiv = document.createElement('div');
    newDiv.classList.add('repo-card__container');
    newDiv.textContent = "Name: "+ name+ "\n"  +"Owner:  "+ owner+"\n" + "Stars: " + stars;
    let newBut = document.createElement('button');
    newBut.classList.add('delete-repo');
    newLi.append(newDiv,newBut);    
    repoList.append(newLi);
    searchInput.value = '';
    autocompliteContainer.style.display = 'none';
}

function deleteElement(e) {
    e.target.parentElement.remove();
}
