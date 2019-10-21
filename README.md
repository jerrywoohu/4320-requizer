# 4320-requizer
Regenerates cumulative quizzes from canvas results page
Made for use in COMP 4320-001 (Fall 2019), Auburn University

## Project Goals

## Installation
### Downloading the Project
Download Node.js
Download this project

### Downloading Your Quizzes
In short,
Open each module page
Right-click > "Save As..."
Format: "Webpage, HTML Only"
Save each video and attempt into /quizzes/quiz_name.htm names does not really matter
IMPORTANT: For each module you want to use, you MUST save the attempt recorded on the Module page. DO NOT save just Attempt View pages. 

run ```node injest``` from inside the project directory
this creates the quiz question database and organizes it

copy files from /generated to the /requizer-client/assets folder

### Running the dev server
then ```cd requizer-client``` followed by ```ng serve```
this starts a web server and launches your web browser so you can start hating yourself
```ng build``` builds for production

If you add more quizzes to the /quizzes folder in the future, you need to run ```node injest``` again and copy the output to the correct folder.

## Updating
Make a copy of the contents of /quizzes
Redownload the source code
Move quizzes back into /quizzes
run ```node injest```

## Known Issues
When encountering duplicate questions, the interpreter takes the highest score. It should compare and take the newer one if both questions were answered correctly. The reason why this isn't implemented yet is because the decision tree was deemed too complex and it was my bedtime.

Does not work if Canvas language isn't set to English. Some of the question parsing requires me to match certain strings in the HTML file. If you use Canvas in another language, I'd advise setting your language to English before saving the quiz files.

Canvas is inconsistent in presenting Multiple Dropdown questions...they may be wonky when they show up in my app

Not every possible option is present in Matching questions. If there were originally more options in the answer bank than prompts, then the interpreter can only recover those that you used. Ther reason is that the entire bank isn't present in the HTML file. A fix would require you to save the quiz page while you're taking it, and not after submitting. This is too much for only a few questions, and deemed not worth it.

