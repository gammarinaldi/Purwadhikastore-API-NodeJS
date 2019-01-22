const conn = require('../database');

module.exports = {
    getListProducts: (req,res) => {
        var sql = 'SELECT * FROM products;';
        conn.query(sql, (err, results) => {
            if(err) throw err;
            res.send(results);
        })   
    },

    addProduct: (req,res) => {
        try {
            var sql = 'INSERT INTO products SET ?';
            conn.query(sql, data, (err, results) => {
                if(err) {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                }
                
                sql = 'SELECT * from products;';
                conn.query(sql, (err, results) => {
                    if(err) {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                    
                    res.send(results);
                })   
            })  
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },

    editProduct: (req,res) => {
        var ProductId = req.params.id;
        var sql = `SELECT * FROM products WHERE id = ${ProductId};`;
        conn.query(sql, (err, results) => {
            if(err) throw err;
    
            if(results.length > 0) {
                try {
                    sql = `UPDATE products SET ? WHERE id = ${brandId};`
                    conn.query(sql,data, (err1,results1) => {
                        if(err1) {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                        }
                        sql = `SELECT * FROM products;`;
                        conn.query(sql, (err2,results2) => {
                            if(err2) {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                            }
                            res.send(results2);
                        })
                    })
                }
                catch(err){
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                }
            }
        })
    },

    deleteProduct: (req,res) => {
        var ProductId = req.params.id;
        var sql = `SELECT * FROM products WHERE id = ${ProductId};`;
        conn.query(sql, (err, results) => {
            if(err) {
                return res.status(500).json({ 
                    message: "There's an error on the server. Please contact the administrator.", 
                    error: err.message });
            }
            
            if(results.length > 0) {
                sql = `DELETE FROM products WHERE id = ${ProductId};`
                conn.query(sql, (err1,results1) => {
                    if(err1) {
                        return res.status(500).json({ 
                            message: "There's an error on the server. Please contact the administrator.", 
                            error: err1.message });
                    }
    
                    sql = `SELECT * FROM products;`;
                    conn.query(sql, (err2,results2) => {
                        if(err2) {
                            return res.status(500).json({ 
                                message: "There's an error on the server. Please contact the administrator.", 
                                error: err2.message });
                        }
    
                        res.send(results2);
                    })
                })
            }
        })   
    
    }
}