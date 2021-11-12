import moment from 'moment';

export class Utils {
    static random() {
        let start = 0, end = 100
        if (arguments.length > 0) {
            if (arguments.length === 1) {
                end = arguments[0]
            } else {
                start = arguments[0]
                end = arguments[1]
            }
        }

        return Math.round(Math.random() * (end - start)) + start
    }

    static formatNumber(number: number) {
        if (!number) {
            return '0'
        }

        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    static isNumeric(str: string | number) {
        return !isNaN(Number(str)) && !isNaN(parseFloat(String(str)))
    }

    private static normalizeTo2Sym(deg: number): string {
        return ('0' + deg).slice(-2)
    }

    dateFormat(date: string) {
        const fullDate: Date = new Date(date);
        const allMonths: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let day: number | string = fullDate.getDate();
        day = day < 10 ? '0' + day : day;
        const month: string = allMonths[fullDate.getMonth()];
        const year: number = fullDate.getFullYear();
        let hours: number | string = fullDate.getHours();
        debugger;
        const postAfter: string = (hours < 12) ? "AM" : "PM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours < 10 ? '0' + hours : hours;
        const minutes: number | string = ('0' + fullDate.getMinutes()).slice(-2);
        return `${day}-${month}-${year} ${hours}:${minutes} ${postAfter}`;
    }

    dateFormatUTCToLocal(date: string) {
        return moment.utc(date).local().format('DD-MMM-YYYY hh:mm A');
    }

    dateFormatLocalToUTC(date: string){
        return moment(date).utc().format('YYYY-MM-DDTHH:mm:ss');
    }

    changeDateFormatForInput(date: string){
        return moment(date).format('YYYY-MM-DDTHH:mm:ss');
    }
}

export default new Utils()



