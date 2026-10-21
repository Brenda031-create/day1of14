class details{
    constructor(age, fullName, email, password, confirmPassword){
        this.age = age;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}
const users = [];

const user1 = new details(25, "John Doe", "john.doe@example.com", "password123", "password123");
const user2 = new details(17, "Jane Smith", "jane.smith@example.com", "password123", "password123");
const user3 = new details(30, "Alice Johnson", "alice.johnson@example.com", "password123", "password123");
const user4 = new details(16, "Bob brown", "bobbrown@gmail.com", "password456", "password456");

users.push(user1, user2, user3, user4);
console.log("All Users", users);
const acceptedUsers = [];

function inputValidation(){
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const checkedAge = user.age;
        const checkedfullname = user.fullName;
        const checkedEmail = user.email;
        const checkedPassword = user.password;
        const checkedConfirmPassword = user.confirmPassword;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (checkedAge < 18 && checkedAge > 0 && checkedAge !== null && checkedAge !== undefined && checkedAge.isNun == true) {
            console.log(`${user.fullName} is not old enough to use the service.`);
            inputValidation();}
        
        
            else if (!checkedfullname || checkedfullname.trim() === "") {
                console.log(`Full name is required for user ${i + 1}.`);
                inputValidation();
            }
        
            else if (!emailPattern.test(checkedEmail)) {
                console.log(`Invalid email for user ${i + 1}.`);
                inputValidation();
            }
        
            else if (!checkedPassword || checkedPassword.length < 6) {
                console.log(`Password is required for user ${i + 1}.`);
                inputValidation();
                }
            
        
            else if (!checkedConfirmPassword || checkedConfirmPassword !== checkedPassword) {
                console.log(`Confirm password is required for user ${i + 1}.`);
                inputValidation();
            }
        }
        acceptedUsers.push(user);
        console.log(`User ${i + 1} is valid.`);
    }
    console.log("Accepted users:", acceptedUsers);

inputValidation();