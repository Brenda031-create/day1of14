async function fetchUsers() {
const response = await fetch("https://jsonplaceholder.typicode.com/users");
const users = await response.json();
if (!response.ok){
throw new Error(response.status + " " + response.statusText);
}
return users;
}

async function displayUsers() {
    const users = await fetchUsers();
    console.log(users);
}

fetchUsers();
displayUsers();