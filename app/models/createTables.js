// createTables.js

const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(255),
                username VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                status VARCHAR(255) DEFAULT 'noactive',
                image VARCHAR(255) DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "users" created or already exists.');

        // Tạo bảng "rooms" nếu chưa tồn tại
        // await db.execute(`
        //     CREATE TABLE IF NOT EXISTS rooms (
        //         id INT AUTO_INCREMENT PRIMARY KEY,
        //         name VARCHAR(255) NOT NULL,
        //         type VARCHAR(255),
        //         area FLOAT,
        //         capacity INT,
        //         status VARCHAR(255) DEFAULT 'available',
        //         description TEXT,
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        //     )
        // `);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(255),
                area FLOAT,
                status VARCHAR(255) DEFAULT 'available',
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "rooms" created or already exists.');

        // Tạo bảng trung gian "room_residents" để theo dõi cư dân của từng phòng
        await db.execute(`
            CREATE TABLE IF NOT EXISTS room_residents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_id INT,
                user_id INT,
                FOREIGN KEY (room_id) REFERENCES rooms(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "room_residents" created or already exists.');

        // Thêm bảng "asset_categories"
        await db.execute(`
         CREATE TABLE IF NOT EXISTS asset_categories (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             description TEXT,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
         )
     `);

        console.log('Table "asset_categories" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "password_reset_tokens" created or already exists.');

        // Tạo bảng "assets " nếu chưa tồn tại
        await db.execute(`
          CREATE TABLE IF NOT EXISTS assets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            value DECIMAL(10, 2),
            location VARCHAR(255),
            status VARCHAR(255),
            quantity INT,
            category_id INT,
            image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE CASCADE
        )
          `);



        console.log('Table "assets" created or already exists.');

        // Tạo bảng "asset_reports" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS asset_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            asset_id INT,
            report_date DATE,
            report_description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (asset_id) REFERENCES assets(id)
        )
         `);

        console.log('Table "asset_reports" created or already exists.');

        // Tạo bảng "asset_event_history" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS asset_event_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                asset_id INT,
                event_type VARCHAR(255),
                event_date TIMESTAMP,
                description TEXT,
                quantity INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (asset_id) REFERENCES assets(id)
            )
            `);

        console.log('Table "asset_event_history" created or already exists.');

        // Tạo bảng "maintenance_plans" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS maintenance_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            asset_id INT,
            plan_description TEXT,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (asset_id) REFERENCES assets(id)
        )
         `);

        console.log('Table "maintenance_plans" created or already exists.');

        // Tạo bảng "vendors " nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS vendors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(255),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

      `);

        console.log('Table "vendors " created or already exists.');

        // Tạo bảng "personal_info " nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS personal_info (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            full_name VARCHAR(255),
            address TEXT,
            phone_number VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "personal_info" created or already exists.');

        // Tạo bảng "family_info" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS family_info (
            id INT AUTO_INCREMENT PRIMARY KEY,
            personal_info_id INT,
            spouse_name VARCHAR(255),
            child_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (personal_info_id) REFERENCES personal_info(id)
        )
      `);

        console.log('Table "family_info" created or already exists.');

        // Tạo bảng "complaints" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS complaints (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            subject VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(255) DEFAULT 'Đang chờ xử lý',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

        console.log('Table "complaints" created or already exists.');

        // Tạo bảng "notifications" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
       `);

        console.log('Table "notifications" created or already exists.');

        // Tạo bảng "visitors" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS visitors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(255),
                entryDate DATETIME,
                reasonToVisit TEXT,
                address VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
       `);

        console.log('Table "visitors" created or already exists.');

        // Tạo bảng "residence_rules" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS residence_rules (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);

        console.log('Table "residence_rules" created or already exists.');

        // Tạo bảng "meetings" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS meetings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            date DATETIME,
            description TEXT,
            location VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        `);

        console.log('Table "meetings" created or already exists.');

        // Tạo bảng "events" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_name VARCHAR(255) NOT NULL,
            event_date DATE NOT NULL,
            description TEXT,
            meeting_id INT,
            FOREIGN KEY (meeting_id) REFERENCES meetings(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        `);

        console.log('Table "events" created or already exists.');

        // Tạo bảng "meeting_participants" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS meeting_participants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            meeting_id INT,
            user_id INT,
            FOREIGN KEY (meeting_id) REFERENCES meetings(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
         `);

        console.log('Table "meeting_participants" created or already exists.');

        // Tạo bảng "maintenance_history" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS maintenance_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                asset_id INT,
                description TEXT,
                date DATE,
                cost DECIMAL(10, 2), -- Thay đổi kiểu dữ liệu tùy theo cần
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (asset_id) REFERENCES assets(id)
            )
            `);

        console.log('Table "maintenance_history" created or already exists.');

        // Tạo bảng "contracts" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS contracts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_id INT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            start_date DATE,
            end_date DATE,
            value DECIMAL(10, 2),
            status VARCHAR(255) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (vendor_id) REFERENCES vendors(id)
        )
        `);

        console.log('Table "contracts" created or already exists.');

        // Tạo bảng "entry_records" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS entry_records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            entry_time DATETIME,
            exit_time DATETIME,
            building VARCHAR(255),
            authorized BOOLEAN,
            stranger_name VARCHAR(255),  -- Thêm trường cho tên của khách lạ
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "entry_records" created or already exists.');

        // Tạo bảng "emergency_maintenance" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS emergency_maintenance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            asset_id INT,
            description TEXT,
            reported_by INT,
            reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(255) DEFAULT 'Đang chờ xử lý',
            resolved_at TIMESTAMP,
            resolved_description TEXT,
            resolved_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (asset_id) REFERENCES assets(id),
            FOREIGN KEY (reported_by) REFERENCES users(id),
            FOREIGN KEY (resolved_by) REFERENCES users(id)
        )
        `);

        console.log('Table "emergency_maintenance" created or already exists.');

        // Tạo bảng "customers" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20),
                address TEXT,
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "customers" created or already exists.');

        // Tạo bảng "receptions" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS receptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            resident_id INT,
            guest_name VARCHAR(255) NOT NULL,
            entry_date DATETIME NOT NULL,
            purpose TEXT,
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (resident_id) REFERENCES users(id)
        )
        `);

        console.log('Table "receptions" created or already exists.');


        // Tạo bảng "access_cards" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS access_cards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            resident_id INT NOT NULL,
            card_number VARCHAR(255) NOT NULL,
            issue_date DATE NOT NULL,
            expiration_date DATE NOT NULL,
            FOREIGN KEY (resident_id) REFERENCES users(id)
        )
         `);

        console.log('Table "access_cards" created or already exists.');

        // Tạo bảng "maintenance_funds " nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS maintenance_funds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            allocation_date DATE NOT NULL,
            utilization_date DATE,
            status VARCHAR(50) DEFAULT 'Đang chờ xử lý'
        )
        `);

        console.log('Table "maintenance_funds " created or already exists.');


        // await db.execute(`
        //     ALTER TABLE assets
        //     ADD quantity INT;
        //     `);

        // await db.execute(`
        //  ALTER TABLE maintenance_history
        //  ADD plan_id INT,
        //  ADD FOREIGN KEY (plan_id) REFERENCES maintenance_plans(id);
        //     `);

        // Thêm trường "role" vào bảng "notifications"
        // await db.execute(`
        //     ALTER TABLE notifications
        //     ADD role VARCHAR(255) AFTER content;
        //     `);

        //  await db.execute(`
        //  ALTER TABLE complaints
        //  ADD status VARCHAR(255) DEFAULT 'Đang chờ xử lý',
        //  ADD progress INT DEFAULT 0,
        //  ADD assigned_to INT,
        //  ADD FOREIGN KEY (assigned_to) REFERENCES users(id)
        //    `);

        //   await db.execute(`
        //   ALTER TABLE complaints
        //   ADD created_by INT,
        //   ADD FOREIGN KEY (created_by) REFERENCES users(id);
        //    `);





        //     await db.execute(`
        //     ALTER TABLE assets
        //     ADD COLUMN image VARCHAR(255) AFTER quantity
        // `);

        // Sử dụng ALTER TABLE để thêm trường "file_url"
        // await db.execute(`
        // ALTER TABLE asset_reports
        // ADD COLUMN file_url VARCHAR(255);
        // `);

        // Bổ sung trường mới "file_url" vào bảng "events" nếu chưa tồn tại
        // await db.execute(`
        // ALTER TABLE events
        // ADD COLUMN file_url VARCHAR(255);
        // `);

        // console.log('Column "file_url" added to the table "events".');

        // Alter contracts table to add file_url column
        // await db.execute(`
        // ALTER TABLE contracts
        // ADD COLUMN file_url VARCHAR(255) AFTER value
        // `);
        // console.log('Column "file_url" added to the "contracts" table.');

    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
    }
};

createTables();
