const conn = require('../database');
var fs = require('fs');
var { uploader } = require('../helpers/uploader');

module.exports = {
    getListTrx: (req,res) => {
        var sql = `SELECT * FROM trx`;
        conn.query(sql, (err, results) => {
            if(err){
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message 
                });
            }
            res.send(results);
        })   
    },

    getTrx: (req,res) => {
        var sql = `SELECT * FROM trx WHERE username = '${req.body.username}'`;
        conn.query(sql, (err, results) => {
            if(err){
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message 
                });
            }
            res.send(results);
        })   
    },

    addTrx: (req,res) => {
        try {

            const path = '/img/receipts'; //file save path
            const upload = uploader(path, 'TRX').fields([{ name: 'receipt'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    // res.send({ status: 'error', message: 'Upload image failed, file format is not compatible.', error: err.message }); //res.send masuknya ke then axios
                    // res.end();
                    return res.status(500).json({ 
                        message: "There's an error on the server. Please contact the administrator.", 
                        error: err.message 
                    });
                }
    
                const { receipt } = req.files;
                const imagePath = receipt ? path + '/' + receipt[0].filename : null;
    
                const data = JSON.parse(req.body.data);
                data.receipt = imagePath;
                
                var sql = 'INSERT INTO trx SET ?';
                conn.query(sql, data, (err, results) => {
                    if(err) {
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ 
                            message: "There's an error on the server. Please contact the administrator.", 
                            error: err.message 
                        });
                    }
                   
                    sql = 'SELECT * FROM trx ORDER BY id DESC LIMIT 1';
                    conn.query(sql, (err, results) => {
                        if(err) {
                            return res.status(500).json({ 
                                message: "There's an error on the server. Please contact the administrator.", 
                                error: err.message 
                            });
                        }
                        res.send(results);
                    })   
                })    
            })
        } catch(err) {
            return res.status(500).json({ 
                message: "There's an error on the server. Please contact the administrator.", 
                error: err.message 
            });
        }
    },

    statusUpdate: (req,res) => {
        var sql = `UPDATE trx SET status = 'Confirmed' WHERE id = '${req.params.id}'`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message 
                });
            }

            //Insert data into table: participant
            var data = req.body; //idProduct, qty
            var sql = `INSERT INTO participant SET ?`;


            sql = `SELECT id FROM trx WHERE id = '${req.params.id}';`;
            conn.query(sql, (err2,results2) => {
                if(err2) {
                    return res.status(500).json({ 
                        message: "There's an error on the server. Please contact the administrator.", 
                        error: err2.message 
                    });
                }
                res.send(results2);
            })
        })
    },

    totalConfirmed: (req,res) => {
        var sql = `SELECT COUNT(id) AS confirmed FROM trx WHERE status = 'Confirmed';`;
        conn.query(sql, (err, results) => {
            if(err){
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message 
                });
            }
            res.send(results);
        })   
    },

    unconfirmedTrxCounter: (req,res) => {
        var sql = `SELECT COUNT(id) AS unconfirmed FROM trx WHERE status = 'Unconfirmed';`;
        conn.query(sql, (err, results) => {
            if(err){
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message 
                });
            }
            res.send(results);
        })   
    },
}