"use strict";

module.exports = class MultipleAnswers {
    constructor(_$, _question) {
        this.question_id = _$(_question).find('.assessment_question_id').html().trim()
        this.question_text = _$(_question).find('.question_text.user_content').html().trim()
        
        this.options = _$(_question).find('.answer .select_answer .answer_text').map(function() {
            return _$(this).text()
        }).get()
        this.answer = _$(_question).find('.answer.selected_answer .answer_text').map(function() {
            return _$(this).text()
        }).get()
        
        this.score = this.getScore(_$, _question)
        this.correct = (this.score == 1.0) ? true : false
    }

    /**
     * merge
     * 
     * attempts to merge results from two different questions
     * @param {*} _other : what to compare to
     */
    merge(_other, _my_timestamp, _other_timestamp) {
        if (this.question_id == _other.question_id) {
            if (_other.score > this.score) {
                return _other
            } else {
                return this
            }
        }
    }

    validate(_answer) {
        return _anwser.sort() == this.answer.sort()
    }

    getScore(_$, _question) {
        let score = _$(_question).find('.user_points').text().trim().split('\n')[0] 
        score = score / _$(_question).find('.user_points').text().trim().split('\n')[1].trim().replace(' pts', '').replace(' 分', '').replace('/ ', '')

        return score
    }

}