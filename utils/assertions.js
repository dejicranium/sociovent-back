const validator = require('mlar')('validators');

module.exports = {
    digitsOnly(entity, error = null, param = null) {
        if (!validator.isDigits(entity)) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} contains non-digits`);
        }
    },

    notDecimal(entity, error = null, param = null) {
        entity = entity.toString();
        if (entity.indexOf('.') > -1) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} cannot be in decimal`);
        }

        return true
    },

    greaterThanZero(entity, error = null, param = null) {
        if (parseFloat(entity) <= 0) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} should be greater than 0`);
        }
    },
    digitsOrDecimalOnly(entity, error = null, param = null) {
        if (!validator.isDigitsOrDecimal(entity)) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} contains non-digits`);
        }
    },

    bvnFormatOnly(bvn, error = null, param = null) {
        param = 'BVN';
        module.exports.digitsOnly(bvn, error, param);
        if (!validator.isOfLength(bvn, 11)) {
            throw new Error('BVN should be 11 digits');
        }
    },

    nubanFormatOnly(entity, error = null, param = null) {
        if (!validator.isNuban(entity)) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} is not in NUBAN format`);
        }
    },

    dateFormatOnly(entity, error = null, param = null) {
        if (!validator.isDate(entity)) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} should be in a date format`);
        }
    },

    emailFormatOnly(entity, error = null, param = null) {
        if (entity && !validator.isEmail(entity)) {
            if (error) throw new Error(error);
            const errorField = param ? param.toString() : entity;
            throw new Error(`${errorField} is not a valid email format`);
        }
    },

    mustBeMutuallyExclusive(entities, error = null, params = null) {
        if (!validator.areMutuallyExclusive(entities)) {
            if (error) throw new Error(error);
            const errorFields = params.length ? params.map(param => param).join(', ') : entities.map(entity => entity).join(', ');
            throw new Error(`${errorFields} cannot be the same value`);
        }
    },

    lengthGreaterThan(entity, l, entity_name) {
        if (entity && entity.length < l + 1) {
            throw new Error(`${entity_name} should be greater than ${l}`);
        }
    },

    mustBeValidPassword(password) {
        // lazily check;

        let oneUpperCaseCharacter = false;
        let oneLowerCaseCharacter = false;
        let oneSpecialCharacter = false;

        for (let i = 0; i < password.toString().length; i++) {
            let character = password.charAt(i);

            if (/[A-Z]/.test(character)) {
                oneUpperCaseCharacter = true;
            } else if (/[a-z]/.test(character)) {
                oneLowerCaseCharacter = true;
            } else if (/[0123456789!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(character)) {
                oneSpecialCharacter = true;
            }

            if (oneUpperCaseCharacter && oneLowerCaseCharacter && oneSpecialCharacter) {
                // can end loop
                return;
            }
        }

        if (!oneUpperCaseCharacter) throw new Error("Password must have at least one uppercase character");
        if (!oneLowerCaseCharacter) throw new Error("Password must have at least one lowercase character");
        if (!oneSpecialCharacter) throw new Error("Password must have at least one special character or digit");

    },

    mustBeAllOrNone(array, arraylabels) {
        // no element of the array can be null if at least one is not null;

        // loop 
        // if an element is not null in the array, gracefully exist;

        let element = array.find(element => element !== null && element !== undefined);

        if (element) {
            array.forEach(i => {
                if (i == undefined || i == null) {
                    let labels = arraylabels.join(', ');

                    throw new Error(`${labels} must be defined together`);
                }
            })
        }

    }

}