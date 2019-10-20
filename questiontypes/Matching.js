"use strict";

module.exports = class Matching {
    constructor(_$, _question) {
        this.question_id = _$(_question).find('.assessment_question_id').html().trim()
        this.question_text = _$(_question).find('.question_text.user_content').html().trim()
        
        this.prompts = _$(_question).find('.answer .answer_match .answer_match_left').map(function() {
            return _$(this).text()
        }).get()
        
        this.options = Array.from(new Set(_$(_question).find('.answer .answer_match .answer_match_right option').map(function() {
            return _$(this).text()
        }).get()))

        this.answer = _$(_question).find('.answer .answer_match').map(function() {
            return {
                prompt: _$(this).find('.answer_match_left').text().trim(),
                answer: _$(this).find('.answer_match_right option').text().trim()
            }
        }).get()
        
        this.score = this.getScore(_$, _question)
        this.correct = (this.score == 1.0) ? true : false
    }

    /**
     * merge
     * 
     * attempts to merge results from two different questions
     * merges options if there are new ones
     * @param {*} _other : what to merge with
     */
    merge(_other, _my_timestamp, _other_timestamp) {
        if (this.question_id == _other.question_id) {

            let new_options
            if (this.options != _other.options) {
                new_options = Array.from(new Set(_other.options.concat(this.options)))
            }

            if (_other.score > this.score) {
                _other.options = new_options
                return _other
            } else {
                this.options = new_options
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