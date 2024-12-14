const db = require('../config/db');
const nodemailer = require('nodemailer');

const notificationController = {
    createNotification: async (req, res) => {
        try {
            const { title, content, role } = req.body;

            // Lưu thông báo vào cơ sở dữ liệu bao gồm vai trò
            const [notificationRows] = await db.execute(
                'INSERT INTO notifications (title, content, role) VALUES (?, ?, ?)',
                [title, content, role]
            );

            const notificationId = notificationRows.insertId;

            // Gửi thông báo đến tất cả người dùng có vai trò là "resident"
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: '465',
                auth: {
                    user: 'thanhphongit217@gmail.com',
                    pass: 'ktubfwktjlnkulgl',
                },
            });

            // Tìm tất cả người dùng có vai trò là "resident"
            const [userRows] = await db.execute('SELECT * FROM users WHERE role = ?', [role]);

            for (const user of userRows) {
                const mailOptions = {
                    from: 'coms@gmail.com',
                    to: user.email,
                    subject: title,
                    text: content,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }

            res.status(201).json({ message: 'Notification created and sent to residents successfully', status: true });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    searchNotificationByName: async (req, res) => {
        const name = req.query.name;

        try {
            const query = 'SELECT * FROM notifications WHERE title LIKE ?';
            const searchTerm = `%${name}%`;

            const [notificationList] = await db.execute(query, [searchTerm]);
            res.status(200).json({ data: notificationList });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getNotificationsByRole: async (req, res) => {
        try {
            const { role } = req.params;

            // Truy vấn thông báo dựa trên vai trò
            const [notificationRows] = await db.execute('SELECT * FROM notifications WHERE role = ?', [role]);

            // Trả về danh sách thông báo
            res.status(200).json(notificationRows);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },

    getAllNotifications: async (req, res) => {
        try {
            // Truy vấn tất cả thông báo từ cơ sở dữ liệu
            const [notificationRows] = await db.execute('SELECT * FROM notifications');

            // Trả về danh sách thông báo
            res.status(200).json(notificationRows);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
};

module.exports = notificationController;
