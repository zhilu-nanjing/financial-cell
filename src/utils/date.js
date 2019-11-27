import dayjs from 'dayjs'
import {datePattern, str2Re} from "../utils/reg_pattern";
import {formatNumberRender} from "../core/format";
import {isHave, isNumber} from "../core/helper";


export function formatDate(diff) {
    if(!isHave(diff) || !isNumber(diff)) {
        return {
            "state": false,
            // "date": date,
            "date_formula": "",
            "minute": false
        }
    }

    let str = calcDecimals(diff, (i) => {
        return i * 24 * 60;
    });
    str = formatNumberRender(str, 5);
    let beginDate = dayjs('1900-01-01');
    let beginDate2 = dayjs('1900-01-01');
    let enter = false;

    if (isHave(str) && str * 1 > 0) {
        let second = calcDecimals(str, (i) => {
            return i * 60;
        });
        enter = true;
        second = formatNumberRender(second, 5);
        beginDate2 = dayjs('1900-01-01  00:00:00').set('minute', str).set('second', second);
    }

    let date = "";
    if (enter) {
        date = beginDate.add(diff, 'day').subtract(2, 'day').format('YYYY-MM-DD');

        let formula = beginDate2.add(diff, 'day').subtract(2, 'day').format('YYYY-MM-DD  h:mm:ss');
        return {
            "state": date !== 'Invalid Date',
            "date": date,
            "date_formula": formula,
            "minute": true
        }
    } else {
        date = beginDate.add(diff, 'day').subtract(2, 'day').format('YYYY-MM-DD');
        return {
            "state": date !== 'Invalid Date',
            "date": date,
            "date_formula": "",
            "minute": false
        }
    }
}

export function changeFormat(date, format = 'YYYY年MM月DD日') {
  return dayjs(date).format(format);
}

export function calcDecimals(diff, cb = () => {
}) {
    let arr = diff.toString().split('.');
    if (arr.length > 2) {
        return diff;
    }
    let fix = arr[1] + "";
    let newData = fix;
    for (let i = 0; i < fix.length; i++) {
        newData = newData * 0.1;
    }

    return cb(newData);
}

// export function cellDate() {
//
// }

// 已写test
export function dateDiff(date) {
    let valid = false;

    for (let i = 0; valid === false && i < datePattern.length; i++) {
        valid = str2Re(datePattern[i]).test(date);
    }

    if (valid === false) {
        return {
            "isValid": false,
        };
    } else {
        date = date.replace(/[年|月]/g, "-");
        date = date.replace(/[日]/g, "");

        return {
            "diff": dayjs(date).diff(dayjs('1900-01-01'), 'day') + 2,
            "isValid": true,
        }
    }
}
