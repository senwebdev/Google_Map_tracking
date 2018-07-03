
/*--------------------------------------------------------------------------
 * ---------------- start date conversion function to utc ------------------------
 --------------------------------------------------------------------------*/
function startDateToUTC(date) {
    var from_date1 = date + " " + "00:00:00";
    var d1 = new Date(from_date1.replace(/-/g, "/"));
    var start_time111 = new Date(d1.getTime() + (d1.getTimezoneOffset() * 60000));
    var from_date = fromToDate(start_time111);
    return from_date;
}

/*--------------------------------------------------------------------------
 * ---------------- end date conversion function to utc ------------------------
 --------------------------------------------------------------------------*/
function endDateToUTC(date) {
    var from_date1 = date + " " + "23:59:59";
    var d1 = new Date(from_date1.replace(/-/g, "/"));
    var start_time111 = new Date(d1.getTime() + (d1.getTimezoneOffset() * 60000));
    var from_date = fromToDate(start_time111);
    return from_date;
}

function fromToDate(mainDate) {
    var Date2UTC = new Date(mainDate);
    var yr = Date2UTC.getFullYear();
    var yrLength = yr.toString().length;
    if (yrLength == 1) {
        var yr = "0" + Date2UTC.getFullYear();
    } else {
        yr = Date2UTC.getFullYear();
    }
    var dteUTC = Date2UTC.getMonth() + 1;
    var mthLength = dteUTC.toString().length;
    if (mthLength == 1) {
        var mth = "0" + dteUTC;
    } else {
        mth = dteUTC;
    }
    var dt = Date2UTC.getDate();
    var dtLength = dt.toString().length;
    if (dtLength == 1) {
        var dt = "0" + Date2UTC.getDate();
    } else {
        dt = Date2UTC.getDate();
    }
    var hr = Date2UTC.getHours();
    var hrLength = hr.toString().length;
    if (hrLength == 1) {
        var hr = "0" + Date2UTC.getHours();
    } else {
        hr = Date2UTC.getHours();
    }
    var mn = Date2UTC.getMinutes();
    var mnLength = mn.toString().length;
    if (mnLength == 1) {
        var mn = "0" + Date2UTC.getMinutes();
    } else {
        mn = Date2UTC.getMinutes();
    }
    var sc = Date2UTC.getSeconds();
    var scLength = sc.toString().length;
    if (scLength == 1) {
        var sc = "0" + Date2UTC.getSeconds();
    } else {
        sc = Date2UTC.getSeconds();
    }
    var from_to_date = yr + "-" + mth + "-" + dt + " " + hr + ":" + mn + ":" + sc;
    return from_to_date;
}