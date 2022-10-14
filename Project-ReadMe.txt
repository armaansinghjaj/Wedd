THIS IS THE OFFICIAL BACKEND DIRECTORY/REPOSITORY FOR THE CAPSTONE PROJECT.

***Clone/fork this repository from the github to contribute to this project.***

Folder or Files info:
a. public folder: It will have the front-end files which needs to be uploaded on the server in order to be used for example, CSS, JavaScript, Images etc.
b. views folder: It will have the front-end files the user sees for example, ejs files.
c. .gitignore: This will have names of the files that should not be added to the github repository.
d. .git: This will have the information about versions.

Things to note before starting working on the project:
a. Use VSCode and in-built terminal for better results and keep the consistency of the project.
b. Download and install git CLI on your machine.
c. Use 'npm i' to import node_modules folder into project after FRESH clone on machine.

COMMANDS:
1. Server run command:
    npx nodemon App.js
2. Initialize git local repo:
    git init
3. Add staged files to git:
    git add .                   #after changes
4. Perform a commit:
    git commit -m "message"     #after changes
5. Check the status of the files:
    git status
6. Check versions and commits:
    git log
7. Check current branch:
    git branch
8. Change the branch:
    git branch xyzbranch
9. Adding current git repo to remote repo:
    git remote add origin https://github.com/armaansinghjaj/Wedd.git
10. Changing branch to main branch
    git branch -M <branchname>
11. Pushing to remote branch with changes
    git push -u origin <branchname>     #after changes
12. Pulling Changes from remote repo
    git pull origin <branchname>