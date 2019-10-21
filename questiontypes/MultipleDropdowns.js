"use strict";

module.exports = class MultipleDropdowns {
    constructor(_$, _question) {
        this.question_id = _$(_question).find('.assessment_question_id').html().trim()

        // weirdly, even though canvas does not display all options for all
        // instances of these kinds of questions, they are still
        // latent in the html
        let found_options = []
        _$(_question).find('.answers .answer_group').each(function() {
            found_options.push(_$(this).find('.answer_match_left').map(function() {
                return _$(this).text()
            }).get().sort())
        })
        this.options = found_options
        
        this.answer = _$(_question).find('.answer.selected_answer .answer_text').map(function() {
            return _$(this).text().trim()
        }).get()

        // todo: split question into parts, with select elements injected by client
        // because injecting html at this end is stupid
        let found_question_text = _$(_question).find('.question_text.user_content').html().trim()
        for (let i = 0; i < this.answer.length; i++) {
            // let created_options = ""
            // for (let j = 0; j < this.options[i].length; j++) {
            //     created_options += '<option>' + this.options[i][j] + '</option>'
            // }
            // found_question_text = found_question_text.replace(this.answer[i], '<select>' + created_options + '</select>')
            found_question_text = found_question_text.replace('<span>' + this.answer[i] + '</span>', '_________')
        }
        this.question_text = found_question_text

        this.score = this.getScore(_$, _question)
        this.correct = (this.score == 1.0) ? true : false
    }

    /**
     * merge
     * 
     * attempts to merge results from two different questions
     * doesn't merge options
     * @param {*} _other : what to merge with
     */
    merge(_other, _my_timestamp, _other_timestamp) {
        if (this.question_id == _other.question_id) {

            // todo
            // sometimes dropdowns are present in the question text
            // sometimes they are absent
            // they tend to show up in review videos
            // and are absent from reviews
            // so this is problematic and needs a fix

            if (_other.score > this.score) {
                return _other
            } else {
                return this
            }
        }
    }

    validate(_prompt, _answer) {
        return this.answer.find(answer => _prompt == answer.prompt).answer == answer
    }

    getScore(_$, _question) {
        let score = _$(_question).find('.user_points').text().trim().split('\n')[0] 
        score = score / _$(_question).find('.user_points').text().trim().split('\n')[1].trim().replace(' pts', '').replace(' 分', '').replace('/ ', '')

        return score
    }

}