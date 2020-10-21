const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const devTeam = [];


const renderTeam = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "role",
                message: "What is your role?",
                choices: () => {
                    return ["Manager", "Engineer", "Intern"];
                }
            },
            {
                type: "input",
                name: "name",
                message: "What is your name?"
            },
            {
                type: "input",
                name: "id",
                message: "What is your ID?"
            },
            {
                type: "input",
                name: "email",
                message: "What is your email?"
            },
            {
                when: data => data.role === "Manager",
                type: "input",
                name: "officeNumber",
                message: "What is your office number?"
            },
            {
                when: data => data.role === "Engineer",
                type: "input",
                name: "github",
                message: "What is your github username?"
            },
            {
                when: data => data.role === "Intern",
                type: "input",
                name: "school",
                message: "Where do you attend to school?"
            }
        ]).then(data => {
            if (data.role === "Manager") {
                devTeam.push(new Manager(data.role, data.name, data.id, data.email, data.officeNumber));
            }
            else if (data.role === "Engineer") {
                devTeam.push(new Engineer(data.role, data.name, data.id, data.email, data.github));
            }
            else if (data.role === "Intern") {
                devTeam.push(new Intern(data.role, data.name, data.id, data.email, data.school));
            }
            console.log(devTeam);
            newMember();
        }).catch(err => {
            console.log(err);
        });
};

const newMember = () => {
    return inquirer
        .prompt([
            {
                type: "list",
                name: "newMember",
                message: "Do you want to add another employee?",
                choices: ["yes", "no"]
            }
        ]).then(data => {
            if (data.newMember === "yes") {
                renderTeam();
            }
            else {
                writeToFile();
            }
        });
};

const writeToFile = () => {
    if (!fs.existsSync("./output")) {
        fs.mkdirSync("./output");
    }
    fs.writeFile(outputPath, render(devTeam), err => {
        if (err) throw err;
        console.log("Completed!");
    });
};

renderTeam();