"use strict";

module.exports = class NumericalAnswer {
    constructor(_$, _question) {

        this.delta = 0.1 // should vary

        this.question_id = _$(_question).find('.assessment_question_id').html().trim()
        this.question_text = _$(_question).find('.question_text.user_content').html().trim()
        
        this.answer = _$(_question).find('input.numerical_question_input').val()

        while (this.answer.includes(',')) {
            this.answer = this.answer.replace(',','')
        }
        
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
        return (Math.abs(_anwser - this.answer) < this.delta)
    }

    getScore(_$, _question) {
        let score = _$(_question).find('.user_points').text().trim().split('\n')[0] 
        score = score / _$(_question).find('.user_points').text().trim().split('\n')[1].trim().replace(' pts', '').replace(' 分', '').replace('/ ', '')

        return score
    }

}