const db = require('../config/db');

const visitorsController = {
    // Lấy tất cả thông tin về khách hàng
    getAllVisitors: async (req, res) => {
        try {
            const [visitors] = await db.execute('SELECT * FROM visitors ORDER BY created_at DESC');
            res.status(200).json(visitors);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Thêm một khách hàng mới
    addVisitor: async (req, res) => {
        try {
            const { name, email, phone, entryDate, reasonToVisit, address } = req.body;
            const query = 'INSERT INTO visitors (name, email, phone, entryDate, reasonToVisit, address) VALUES (?, ?, ?, ?, ?, ?)';
            await db.execute(query, [name, email, phone, entryDate, reasonToVisit, address]);
            res.status(201).json({ message: 'Visitor added successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Cập nhật thông tin của một khách hàng
    updateVisitor: async (req, res) => {
        try {
            const { visitorId } = req.params;
            const { name, email, phone, entryDate, reasonToVisit, address } = req.body;
            const query = 'UPDATE visitors SET name = ?, email = ?, phone = ?, entryDate = ?, reasonToVisit = ?, address = ? WHERE id = ?';
            await db.execute(query, [name, email, phone, entryDate, reasonToVisit, address, visitorId]);
            res.status(200).json({ message: 'Visitor updated successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Xóa thông tin của một khách hàng
    deleteVisitor: async (req, res) => {
        try {
            const { visitorId } = req.params;
            const query = 'DELETE FROM visitors WHERE id = ?';
            await db.execute(query, [visitorId]);
            res.status(200).json({ message: 'Visitor deleted successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Lấy thông tin của một khách hàng dựa trên id
    getVisitorById: async (req, res) => {
        try {
            const { visitorId } = req.params;
            const [visitor] = await db.execute('SELECT * FROM visitors WHERE id = ?', [visitorId]);

            if (visitor.length === 0) {
                res.status(404).json({ message: 'Visitor not found', status: false });
            } else {
                res.status(200).json(visitor[0]);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    // Tìm kiếm khách hàng dựa trên từ khóa
    searchVisitorsByKeyword: async (req, res) => {
        try {
            const { keyword } = req.query;

            let query;
            let params;

            if (keyword) {
                // Use OR to search across multiple columns (name, email, phone, entryDate, reasonToVisit, address)
                query = `
                SELECT * FROM visitors
                WHERE name LIKE ? OR
                      email LIKE ? OR
                      phone LIKE ? OR
                      entryDate LIKE ? OR
                      reasonToVisit LIKE ? OR
                      address LIKE ?
            `;
                params = Array(6).fill(`%${keyword}%`);
            } else {
                query = 'SELECT * FROM visitors';
                params = [];
            }

            const [visitors] = await db.execute(query, params);

            res.status(200).json(visitors);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }




};

module.exports = visitorsController;

