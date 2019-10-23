"use strict";

const fs = require('fs')
const path = require('path')
const directoryPath = path.join(__dirname, 'quizzes')

const cheerio = require('cheerio')

const MultipleChoiceQuestion = require('./questiontypes/MultipleChoice')
const ShortAnswerQuestion = require('./questiontypes/ShortAnswer')
const MultipleAnswersQuestion = require('./questiontypes/MultipleAnswers')
const NumericalAnswerQuestion = require('./questiontypes/NumericalAnswer')
const MatchingQuestion = require('./questiontypes/Matching')
const TrueFalseQuestion = require('./questiontypes/TrueFalse')
const FillInMultipleBlanksQuestion = require('./questiontypes/FillInMultpleBlanks')
const MultipleDropdownsQuesiton = require('./questiontypes/MultipleDropdowns')

var catalog = [];
var merged = []
var modules_database = []
var modules_sorted_order = []

const write_locations = ['generated/', 'requizer-client/src/assets/'] // i know this is misspelled

/**
 * The main 'body' of the script
 *
 * This scans the quiz directory, calls a function to extract
 * all the questions, then merges them into one database.
 * Finally it writes it all to a few json files
 */
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to locate quizzes: ' + err);
    } 
    files.forEach((file_name) => {
        
        let quiz = cheerio.load(fs.readFileSync('./quizzes/'+ file_name))
        if (file_name == 'modules_page.htm') {
        	modules_sorted_order = createModulesSortedOrder(quiz)
        } else {
        	let quiz_results = catalogQuestions(quiz)
			catalog = catalog.concat(quiz_results)
        }

	});

	// this removes dupes
	// and takes highest score of each question
	// todo: replace corrected questions
	// 		by checking submission date
	for (let i = 0; i < catalog.length; i++) {
		let found = merged.findIndex(x => x.id === catalog[i].id)
		
		if (found > -1) {
			merged[found].handler = merged[found].handler.merge(catalog[i].handler, merged[found].timestamp.submitted, catalog[i].timestamp.submitted)
		} else {
			merged.push(catalog[i])
		}
	}

	merged.sort((a, b) => {return a.id - b.id}) // may not be necessary, but could be useful for binary search in the future

	console.log('Total questions: ' + catalog.length)
	console.log('Unique questions: ' + merged.length)

	// updates modules database
	// can probably be merged with the above loop, but kept separate for clarity
	// this is done on the original unmerged catalog so each module can have the correct question_ids recorded
	for (let i = 0; i < catalog.length; i++) {
		let found_module = modules_database.findIndex(x => x.identification.id == catalog[i].timestamp.quiz.id)
		if (found_module > -1) {
			// merge quiz data
			if (modules_database[found_module].identification.incomplete && !catalog[i].timestamp.quiz.incomplete) {
				modules_database[found_module].identification = catalog[i].timestamp.quiz
			}
			modules_database[found_module].question_ids.push(catalog[i].id)
			modules_database[found_module].question_ids = Array.from(new Set(modules_database[found_module].question_ids))

		} else {
			modules_database.push({
				identification: catalog[i].timestamp.quiz,
				question_ids: [catalog[i].id]
			})
		}
	}

	// updates sort order database
	/*
		{
			name: string,
			submodules: Array<{
				name: string,
				id: string
			}>
		}
	*/
	for (let i = 0; i < modules_sorted_order.length; i++) {
		for (let j = 0; j < modules_sorted_order[i].submodules.length; j++) {

			// if the quiz exists in modules_database, add the data to the sorted_order submodule array
			// otherwise get rid of it
			let found
			if (found = modules_database.find(x => x.identification.id == modules_sorted_order[i].submodules[j].id)) {
				modules_sorted_order[i].submodules[j] = {
					identification: found.identification,
					question_ids: found.question_ids
				}
			} else {
				modules_sorted_order[i].submodules.splice(j, 1);
			}
		}
	}


	for (let i = 0 ; i < write_locations.length; i++) {
		// write the merged list of questions
		fs.writeFileSync(write_locations[i] + 'questions.json', JSON.stringify(merged));

		// write the database of modules
		fs.writeFileSync(write_locations[i] + 'modules.json', JSON.stringify(modules_database));

		// write the sort order for the front end
		fs.writeFileSync(write_locations[i] + 'sortorder.json', JSON.stringify(modules_sorted_order))
	}
	
	for (let i = 0; i < modules_database.length; i++) {
		// console.log(modules_database[i].identification.name + ': ' + modules_database[i].question_ids.length)
	}

	// for debugging
	// uncomment the line you want to see
    for (let i = 0; i < catalog.length; i++) {
		// entire object
		// console.log(catalog[i])

		// submission dates
		// console.log((i + 1) + ': ' + catalog[i].timestamp.submitted)

		// question handlers
		// console.log(catalog[i].handler)

		// question handlers filter
		// if (catalog[i].type == 'multiple_dropdowns_question') console.log(catalog[i].handler)

		// unfinished question types
		// (catalog[i].handler) ? null : console.log(catalog[i].timestamp.quiz.name + (catalog[i].original_number) + ': ' + catalog[i].type)
	
		// timestamp details
		// console.log(catalog[i])
	}
});


/**
 * The timestamp aims to record what quiz this question is from,
 * as well as who and submitted it and when.
 * 
 * @param {*} _$ : Cheerio/jQuery Document
 */
function createTimestamp(_$) {
	let env = findEnv(_$);

	// some quizzes might get saved from the 'attempt history page'
	// others will be saved from the modules page
	// I try to parse data regardless,
	// but more data can be gleaned from the module page

	if (env) {
		let date_submitted = ""
		_$('.quiz-submission').find('div').each(function() {
			let inside = _$(this).text()
			if (inside.includes('Submitted')) date_submitted = inside.replace('Submitted ', '').trim();
		})
		if (env.QUIZ) { // probably the module page
			return {
				name: env.current_user.display_name,
				user_id: env.current_user.id,
				avatar: env.current_user.avatar_image_url,
				quiz: {
					id: env.QUIZ.id,
					name: env.QUIZ.title.trim(),
					desc: env.QUIZ.description,
					incomplete: false
				},
				submitted: convertDate(date_submitted)
			}
		} else { // probably the specific attempt page
			// guess quiz details
			let guess_id = _$('#update_history_form').attr('action').split('/')[4]
			// todo: extract id from string
			let guess_name = _$('title').html().split('Quiz History: ')[1].trim()
			// todo: remove excess string

			return {
				name: env.current_user.display_name,
				user_id: env.current_user.id,
				avatar: env.current_user.avatar_image_url,
				quiz: {
					id: guess_id,
					name: guess_name,
					// desc: null, // not available
					incomplete: true
				},
				submitted: convertDate(date_submitted)
			}
		}
	} else {
		return false
	}

}

function convertDate(_date_string) {
	let months = {
		'JAN': 0,
		'FEB': 1,
		'MAR': 2,
		'APR': 3,
		'MAY': 4,
		'JUN': 5,
		'JUL': 6,
		'AUG': 7,
		'SEP': 8,
		'OCT': 9,
		'NOV': 10,
		'DEC': 11
	}
	
	// Oct 14 at 10:04pm
	// Oct 7 at 6:09pm
	let parts = _date_string.split(' at ')

	// month, day
	let taken_date = parts[0].split(' ')
	let month = months[taken_date[0].toUpperCase()]

	// time
	let sequence
	if (parts[1].includes('pm')) {
		sequence = parts[1].replace('pm').trim().split(':')
		sequence[0] = parseInt(sequence[0]) + 12
		
		if (sequence[1]) sequence[1] = parseInt(sequence[1])
	} else {
		sequence = parts[1].replace('pm').trim().split(':')
		sequence[0] = parseInt(sequence[0])
		if (sequence[1]) sequence[1] = parseInt(sequence[1])
	}
	
	let return_date
	if (sequence[1]){
		return_date = new Date(2019, month, taken_date[1], sequence[0], sequence[1])	
	} else {
		return_date = new Date(2019, month, taken_date[1], sequence[0], 0)	
	}
	return return_date.getTime()
}

function findEnv(_$) {
	let possible_scripts = _$('script')

	for (let i = 0; i < possible_scripts.length; i++) {
		let possible_text = possible_scripts[i].children[0]
		if (possible_text) {
			if (possible_text.data.includes('ENV')) {
				let _start = possible_text.data.indexOf('ENV')
				let return_val = possible_text.data.substring(_start + 6).trim().slice(0, -1)
				return JSON.parse(return_val)
			}
		}
	}

	return false
}

function catalogQuestions(_$) {
	let questions = _$('#questions .question_holder')
	let results = []
	let timestamp = createTimestamp(_$)

	for (let i = 0; i < questions.length; i++) {
		results.push({
			id: _$(questions[i]).find('.assessment_question_id').html().trim(),
			type: determineQuestionType(_$, questions[i]),
			points: determinePoints(_$, questions[i]),
			handler: handleQuestion(_$, questions[i]),
			original_number: _$(questions[i]).find('.name.question_name').html().trim(),
			timestamp: timestamp,
		})
	}

	return results
}

function determineQuestionType(_$, _question) {
	return _$(_question).find('.question_type').html().trim()
}

function determinePoints(_$, _question) {
	return[_$(_question).find('.user_points').text().trim().split('\n')[0],
		_$(_question).find('.user_points').text().trim().split('\n')[1].trim().replace(' pts', '').replace('/ ', '')]
}

function handleQuestion(_$, _question) {
	let type = determineQuestionType(_$, _question)

	switch (type) {
		case 'multiple_choice_question':
			return new MultipleChoiceQuestion(_$, _question)
			break;
		case 'short_answer_question':
			return new ShortAnswerQuestion(_$, _question)
			break;
		case 'multiple_answers_question':
			return new MultipleAnswersQuestion(_$, _question)
			break;
		case 'numerical_question':
			return new NumericalAnswerQuestion(_$, _question)
			break;
		case 'matching_question':
			return new MatchingQuestion(_$, _question)
			break;
		case 'true_false_question':
			return new TrueFalseQuestion(_$, _question)
			break;
		case 'fill_in_multiple_blanks_question':
			return new FillInMultipleBlanksQuestion(_$, _question)
			break;
		case 'multiple_dropdowns_question':
			return new MultipleDropdownsQuesiton(_$, _question)
			break;
	}
}

function createModulesSortedOrder(_$) {

	let found_modules = []
	_$('.item-group-condensed.context_module').each(function() {
		if(_$(this).attr('id') != 'context_module_blank') {
			let submodules = []
			_$(this).find('ul.ig-list.items.context_module_items li.context_module_item.quiz').each(function() {

				// finds quiz id
				let quiz_id = ""
				let class_names = _$(this).attr('class').split(' ')
				for (let i = 0; i < class_names.length; i++) {
					if (class_names[i].includes('Quiz_')) {
						// found the quiz id
						quiz_id = class_names[i].replace('Quiz_','').trim()
					}
				}	

				submodules.push({
					name: _$(this).find('a.for-nvda').text().trim(),
					id: quiz_id
				})
			})
			found_modules.push({
				name: _$(this).attr('aria-label').trim(),
				submodules: submodules
			})
		}
	});

	return found_modules

}
