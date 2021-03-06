const db = require('../../database');

class CompletedBids {
  static retreiveAll (page, callback) {
    let itemsPerPage = 20;
    let offset = itemsPerPage;
    let dataSet = ((page - 1) * itemsPerPage);
    let sql_string = "select quote_tracker.agency, quote_tracker.description, quote_tracker.employee, quote_billing.* "
     + "from quote_billing "
     + "inner join quote_tracker on quote_tracker.invoice = quote_billing.invoice "
     + "where date_billed is not null and bill_balance = ($3)"
     + "order by quote_billing.invoice ASC "
     + "limit ($1) "
     + "offset ($2) ";

    db.query(sql_string, [itemsPerPage, dataSet, "0"],  function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    });
  }

  static getCount (callback) {
    db.query('SELECT COUNT(*) FROM quote_billing WHERE date_billed is not null and bill_balance = ($1)', ["0"], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    });
  }

  static getProfit (callback) {
    db.query('SELECT sum(profit) FROM quote_billing WHERE date_billed is not null and bill_balance = ($1)', ["0"], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    });
  }

  static getAvgMargin (callback) {
    db.query('SELECT avg(profit_margin) FROM quote_billing WHERE date_billed is not null and bill_balance = ($1)', ["0"], function (err,res) {
      if(err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = CompletedBids;
