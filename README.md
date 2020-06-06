# 4320-requizer
Regenerates cumulative quizzes from canvas results page
Made for use in COMP 4320-001 (Fall 2019), Auburn University
https://jerrywoohu.com/projects/4320-requizzer

Note: I misspelled 'requizzer' and some documentation and names may be wrong

### Project Goals
I wanted to create a better way to study for exams in COMP 4320 - Computer Networks. Since there isn't official practice quizzes, I made this tool to create practice quizzes based on my previous quiz results.

## Installation
### Downloading the Project
Download and install Node.js
Download this project

### Saving your quiz data
In short,

* Open each module page 
* Right-click > "Save As...". 
* Format: "Webpage, HTML Only". 
* Save each video and attempt into ```/quizzes/quiz_name.htm``` .
IMPORTANT: For each module you want to use, you MUST save the attempt recorded on the Module page. DO NOT save just Attempt View pages. 
* Quiz names prefixed with "_" (an underscore) will be added anonymously, stripping the contributor data from those question ids. 
* Also save a copy of the list of modules from the "Modules" tab in Canvas. Name this "modules_page.htm". This will allow the module order in the requizzer to be displayed as it was on Canvas.

* run ```npm install``` to install dependencies from inside the project directory.
* then ```node injest``` this creates the quiz question database and organizes it

### Running the dev server
* ```cd requizer-client``` then ```npm install```
* followed by ```ng serve``` this starts a web server and launches your web browser so you can start hating yourself. If you get an error here, you may need to install Angular globally: ```npm install -g @angular/cli```

* ```ng build``` builds for production

If you add more quizzes to the ```/quizzes``` folder in the future, you need to run ```node injest``` again.

## Updating
* Make a copy of the contents of ```/quizzes```. 
* Redownload the source code. Move quizzes back into ```/quizzes```. 
* run ```node injest``` to regenerate the database

## Known Issues
* When encountering duplicate questions, the interpreter takes the highest score. It should compare and take the newer one if both questions were answered correctly. There will also be issues if the question text or body changed. There is actually a really large decision tree behind this. The reason why this isn't implemented yet is because the decision tree was deemed too complex and it was my bedtime.

* Does not work if Canvas language isn't set to English. Some of the question parsing requires me to match certain strings in the HTML file. If you use Canvas in another language, I'd advise setting your language to English before saving the quiz files.

* Canvas is inconsistent in presenting Multiple Dropdown questions...they may be wonky when they show up in my app. Sometimes the dropdown is present as HTML elements in the question text. Sometimes it's filled in already.

* Not every possible option is present in Matching questions. If there were originally more options in the answer bank than prompts, then the interpreter can only recover those that you used. The reason is that the entire bank isn't present in the HTML file. A fix would require you to save the quiz page while you're taking it, and not after submitting. This is too much for only a few questions, and deemed not worth it.

* Answers are stored in plain text in my database. That means formatting is lost, so "2<sup>16</sup>" will lose it's superscript and become "216"
