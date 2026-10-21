class User {
    constructor( fname, lname, age, email, enrolled ) {
        this.fname = fname;
        this.lname = lname;
        this.age = age;
        this.email = email;
        this.enrolled = enrolled;
    }
}
const users = [];

const user1 = new User("John", "Doe", 30, "john.doe@example.com", true );
users.push(user1);

const user2 = new User("Jane", "Smith", 25, "jane.smith@example.com", false);
users.push(user2);

const user3 = new User("Alice", "Johnson", 10, "alice.johnson@example.com", true);
users.push(user3);

console.log(users);

const adults = users.filter(user => user.age >= 18);
console.log( "The adults are: ", adults );

const enrolledUsers = users.filter(user => user.enrolled);
console.log( "The enrolled users are: ", enrolledUsers );

const userWithEmail = users.filter(user => user.email === "john.doe@example.com");
console.log( "The user with the email john.doe@example.com is: ", userWithEmail );

//const userWithName = users.filter(user => user.fname === "Alice");
//console.log( "The user with the first name Alice is: ", userWithName );

//const userwithnomatchingname = users.filter(user => user.fname === "Bob");
//console.log( "The user with the first name Bob is: ", userwithnomatchingname );

function searchUsersByName(name) {
    if (!name || !users.some(user => user.fname === name)) {
        return "user does not exist";
    }
    return users.filter(user => user.fname === name);
}

const searchResult1 = searchUsersByName("Alice");
console.log("Search result for Alice:", searchResult1);

const searchResult2 = searchUsersByName("Bob");
console.log("Search result for Bob:", searchResult2);