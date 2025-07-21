// Core setup
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();

const http = require('http').createServer(app);
const { Server } = require('socket.io');//////
const io = new Server(http);
const session = require('express-session');
const PORT = 3000;





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.locals.io = io;

app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: true
}));


io.on('connection', (socket) => {
});

http.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});


// Database connections with WAL mode + 60s timeout
const alumniDB = new sqlite3.Database('./alumni.db');
alumniDB.exec('PRAGMA journal_mode = WAL;');
alumniDB.exec('PRAGMA busy_timeout = 60000;');

const jobsDB = new sqlite3.Database('./jobs-response.db');
jobsDB.exec('PRAGMA journal_mode = WAL;');
jobsDB.exec('PRAGMA busy_timeout = 60000;');

const registrationDB = new sqlite3.Database('./data-registration.db');
registrationDB.exec('PRAGMA journal_mode = WAL;');
registrationDB.exec('PRAGMA busy_timeout = 60000;');

const fullInfoDB = new sqlite3.Database('./fullinformationRegistered.db');
fullInfoDB.exec('PRAGMA journal_mode = WAL;');
fullInfoDB.exec('PRAGMA busy_timeout = 60000;');

const eventDB = new sqlite3.Database('./event.db');
eventDB.exec('PRAGMA journal_mode = WAL;');
eventDB.exec('PRAGMA busy_timeout = 60000;');

const careerDB = new sqlite3.Database('./career.db');
careerDB.exec('PRAGMA journal_mode = WAL;');
careerDB.exec('PRAGMA busy_timeout = 60000;');

const homeregDB = new sqlite3.Database('./homereg.db');
homeregDB.exec('PRAGMA journal_mode = WAL;');
homeregDB.exec('PRAGMA busy_timeout = 60000;');

const sportDB = new sqlite3.Database('./sportfest.db');
sportDB.exec('PRAGMA journal_mode = WAL;');
sportDB.exec('PRAGMA busy_timeout = 60000;');

const allSportDB = new sqlite3.Database('./allSport.db');
allSportDB.exec('PRAGMA journal_mode = WAL;');
allSportDB.exec('PRAGMA busy_timeout = 60000;');

const galleryDB = new sqlite3.Database('./gallery.db');
galleryDB.exec('PRAGMA journal_mode = WAL;');
galleryDB.exec('PRAGMA busy_timeout = 60000;');

const requestDB = new sqlite3.Database('./idrequest.db');
requestDB.exec('PRAGMA journal_mode = WAL;');
requestDB.exec('PRAGMA busy_timeout = 60000;');

const employerDB = new sqlite3.Database('./employer.db');
employerDB.exec('PRAGMA journal_mode = WAL;');
employerDB.exec('PRAGMA busy_timeout = 60000;')

const idpostDB = new sqlite3.Database('./idpost.db');
idpostDB.exec('PRAGMA journal_mode = WAL;');
idpostDB.exec('PRAGMA busy_timeout = 60000;')

const notifDB = new sqlite3.Database('./notifications.db');
notifDB.exec('PRAGMA journal_mode = WAL;');
notifDB.exec('PRAGMA busy_timeout = 60000;')

// 🎓 Alumni table
alumniDB.run(`CREATE TABLE IF NOT EXISTS alumni (
  id INTEGER PRIMARY KEY,
  firstName TEXT, lastName TEXT, initial TEXT, suffix TEXT,
  civilStatus TEXT, dateBirth TEXT, gender TEXT,
  phoneNo TEXT, major TEXT, yearStarted TEXT,
  graduated TEXT, studentNo TEXT
)`);

// 💼 Jobs responses table
jobsDB.run(`CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY,
  firstName TEXT, lastName TEXT,
  interested TEXT, employmentStatus TEXT,
  dateSubmitted TEXT
)`);

registrationDB.run(`CREATE TABLE IF NOT EXISTS registration (
  id INTEGER PRIMARY KEY,
  firstName TEXT, lastName TEXT, personalEmail TEXT, gender TEXT, userName TEXT UNIQUE, passWord TEXT
)`);

fullInfoDB.run(`CREATE TABLE IF NOT EXISTS fullInformation (
  id INTEGER PRIMARY KEY,
  firstName TEXT, lastName TEXT, initial TEXT, suffix TEXT,
  gender TEXT, civilStatus TEXT, dateBirth TEXT, maiden TEXT,
  phoneNo TEXT, major TEXT, yearStarted TEXT,
  graduated TEXT, studentNo TEXT
)`);

eventDB.run(`
  CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image BLOB,
  title TEXT,
  description TEXT,
  location TEXT,
  datePosted DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
careerDB.run(`
  CREATE TABLE IF NOT EXISTS careers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image BLOB,
  title TEXT,
  description TEXT,
  link TEXT,
  datePosted DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
homeregDB.run(`
  CREATE TABLE IF NOT EXISTS homeregs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    middleInitial TEXT,
    lastName TEXT,
    sex TEXT,
    program TEXT,
    yearGraduated TEXT,
    addon TEXT,
    image BLOB,
    status TEXT DEFAULT 'PENDING',
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
sportDB.run(`
  CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teamName TEXT NOT NULL,
  ageRange TEXT NOT NULL,
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'PENDING'
  )
`);
sportDB.run(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teamId INTEGER NOT NULL,
    firstName TEXT NOT NULL,
    middleInitial TEXT,
    lastName TEXT NOT NULL,
    FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
  )
`);
allSportDB.run(`
  CREATE TABLE IF NOT EXISTS athletes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    middleName TEXT,
    lastName TEXT NOT NULL,
    gender TEXT NOT NULL,
    extension TEXT,
    yearGraduated TEXT,
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'PENDING',
    sportType TEXT NOT NULL
  )
`);

galleryDB.run(`
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image BLOB NOT NULL,
    datePosted DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

requestDB.run(`CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  degree TEXT NOT NULL,
  yearGraduated TEXT NOT NULL,
  studentNo TEXT NOT NULL,
  phoneNo TEXT NOT NULL,
  email TEXT NOT NULL,
  idImage BLOB NOT NULL,
  status TEXT DEFAULT 'PENDING',
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
employerDB.run(`CREATE TABLE IF NOT EXISTS employers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employerName TEXT NOT NULL,
  businessName TEXT NOT NULL,
  businessAddress TEXT NOT NULL,
  landlineNo TEXT NOT NULL,
  mobileNo TEXT NOT NULL,
  companyEmail TEXT NOT NULL,
  companyWebsite TEXT NOT NULL,
  preferredUserId TEXT NOT NULL UNIQUE,
  preferredPassword TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

idpostDB.run(`
  CREATE TABLE IF NOT EXISTS idposts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    datePosted TEXT NOT NULL
  )
`);

notifDB.run(`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  link TEXT,
  message TEXT,
  createdAt TEXT
)`);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ➕ API: Add alumni
app.post('/api/alumni', (req, res) => {
  const b = req.body;
  const values = [
    b.firstName, b.lastName, b.initial, b.suffix,
    b.civilStatus, b.dateBirth, b.gender,
    b.phoneNo, b.major, b.yearStarted,
    b.graduated, b.studentNo
  ];
  alumniDB.run(`
    INSERT INTO alumni (
      firstName, lastName, initial, suffix,
      civilStatus, dateBirth, gender,
      phoneNo, major, yearStarted,
      graduated, studentNo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// 📥 Excel Upload for alumni (if needed)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/alumni/upload-excel', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const wb = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { raw: true });

  const stmt = alumniDB.prepare(`
    INSERT INTO alumni (
      firstName, lastName, initial, suffix,
      civilStatus, dateBirth, gender,
      phoneNo, major, yearStarted, graduated, studentNo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  rows.forEach(row => {
    stmt.run([
      row['First Name'] || '',
      row['Last Name'] || '',
      row['Initial'] || '',
      row['Suffix'] || '',
      row['Civil Status'] || '',
      row['Date of Birth'] instanceof Date
        ? row['Date of Birth'].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : (row['Date of Birth'] || ''),
      row['Gender'] || '',
      row['Phone No.'] || row['Phone No'] || '',
      row['Major'] || '',
      row['Year Started'] != null ? String(row['Year Started']) : '',
      row['Graduated'] != null ? String(row['Graduated']) : '',
      row['Student No.'] || row['Student No'] || ''
    ]);
  });

  stmt.finalize();
  res.json({ inserted: rows.length });
});

// GET paginated & searchable alumni
app.get('/api/alumni', (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  alumniDB.get(
    "SELECT COUNT(*) AS total FROM alumni WHERE firstName LIKE ? OR lastName LIKE ? OR major LIKE ?",
    [search, search, search],
    (e, result) => {
      if (e) return res.status(500).json({ error: e.message });
      const total = result.total;
      alumniDB.all(
        "SELECT * FROM alumni WHERE firstName LIKE ? OR lastName LIKE ? OR major LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
        [search, search, search, limit, offset],
        (e2, rows) => {
          if (e2) return res.status(500).json({ error: e2.message });
          res.json({
            rows,
            total,
            totalPages: Math.ceil(total / limit)
          });
        }
      );
    }
  );
});

// 🧾 Submit career form (from user-homepage)
 // ✅ Import your broadcast function

app.post('/api/responses/add', (req, res) => {
  const { firstName, lastName, interested, employmentStatus } = req.body;
  const dateSubmitted = new Date().toLocaleString();

  jobsDB.run(`
    INSERT INTO responses (firstName, lastName, interested, employmentStatus, dateSubmitted)
    VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, interested, employmentStatus, dateSubmitted],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // ✅ Save the notification in your notification table (example)
      notifDB.run(`
        INSERT INTO notifications (name, message, link, createdAt)
        VALUES (?, ?, ?, ?)`,
        ['Jobs Responses', `${firstName} ${lastName} submitted a job response.`, 'jobs-response.html', dateSubmitted]);

      // ✅ Emit to connected clients
      io.emit('newNotification', {
        name: 'Jobs Responses',
        message: `${firstName} ${lastName} submitted a job response.`,
        link: 'jobs-response.html',
        createdAt: dateSubmitted
      });

      res.json({ success: true });
    }
  );
});


// GET paginated & searchable job responses
app.get('/api/responses', (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  jobsDB.get(
    "SELECT COUNT(*) AS total FROM responses WHERE firstName LIKE ? OR lastName LIKE ?",
    [search, search],
    (e, result) => {
      if (e) return res.status(500).json({ error: e.message });
      const total = result.total;
      jobsDB.all(
        "SELECT * FROM responses WHERE firstName LIKE ? OR lastName LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
        [search, search, limit, offset],
        (e2, rows) => {
          if (e2) return res.status(500).json({ error: e2.message });
          res.json({
            rows,
            total,
            totalPages: Math.ceil(total / limit)
          });
        }
      );
    }
  );
});




// ✅ Place this together with your other API routes
app.post('/api/registration/add', (req, res) => {
  const { firstName, lastName, personalEmail, gender, userName, passWord, major, graduated } = req.body;

  if (!firstName || !lastName || !personalEmail || !gender || !userName || !passWord || !major || !graduated) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1️⃣ Check if username is taken
  registrationDB.get(`SELECT * FROM registration WHERE LOWER(userName) = LOWER(?)`, [userName], (err, existingUser) => {
    if (err) {
      console.error('❌ Username Check Error:', err);
      return res.status(500).json({ error: 'Database error during username check' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken. Please choose another.' });
    }

    // 2️⃣ Check if alumni info already exists
    registrationDB.get(
      `SELECT * FROM registration WHERE LOWER(firstName) = LOWER(?) AND LOWER(lastName) = LOWER(?) AND LOWER(gender) = LOWER(?) AND LOWER(personalEmail) = LOWER(?)`,
      [firstName, lastName, gender, personalEmail],
      (err2, existing) => {
        if (err2) {
          console.error('❌ Registration Check Error:', err2);
          return res.status(500).json({ error: 'Database error' });
        }

        if (existing) {
          return res.status(409).json({ error: 'This information has already created an account.' });
        }

        // 3️⃣ Verify in alumni records
        alumniDB.get(
          `SELECT * FROM alumni WHERE LOWER(firstName) = LOWER(?) AND LOWER(lastName) = LOWER(?) AND LOWER(gender) = LOWER(?) AND LOWER(major) = LOWER(?) AND CAST(graduated AS TEXT) = ?`,
          [firstName, lastName, gender, major, graduated],
          (err3, alumniRow) => {
            if (err3) {
              console.error('❌ Alumni DB Check Error:', err3);
              return res.status(500).json({ error: 'Database error' });
            }

            if (!alumniRow) {
              return res.status(403).json({ error: 'Alumni record does not match our records.' });
            }

            // 4️⃣ Insert Registration
            registrationDB.run(
              `INSERT INTO registration (firstName, lastName, personalEmail, gender, userName, passWord) VALUES (?, ?, ?, ?, ?, ?)`,
              [firstName, lastName, personalEmail, gender, userName, passWord],
              function (err4) {
                if (err4) {
                  console.error('❌ Registration Insert Error:', err4);
                  return res.status(500).json({ error: err4.message });
                }

                // ✅ Save Notification in DB
                const notif = {
                  name: 'Alumni Registration',
                  message: `New alumni registration from ${firstName} ${lastName}`,
                  link: 'data-registration.html',
                  createdAt: new Date().toISOString()
                };

                notifDB.run(`INSERT INTO notifications (name, link, message, createdAt) VALUES (?, ?, ?, ?)`,
                  [notif.name, notif.link, notif.message, notif.createdAt]
                );

                // ✅ Emit to Admin Inbox
                io.emit('newNotification', notif);

                res.json({ success: true, id: this.lastID, message: 'Registration saved successfully.' });
              }
            );
          }
        );
      }
    );
  });
});






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ✅ LOGIN API — Check username & password
app.post('/api/registration/login', (req, res) => {
  const { userName, passWord } = req.body;

  if (!userName || !passWord) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  registrationDB.get(`
    SELECT * FROM registration 
    WHERE userName = ? AND passWord = ?
  `, [userName, passWord], (err, row) => {
    if (err) {
      console.error('❌ Login DB Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isAdmin = (userName.toLowerCase() === 'admin');

    // ✅ Save session for this admin
    req.session.user = {
      id: row.id,
      userName: row.userName,
      isAdmin
    };

    console.log('✅ Login successful for:', userName);
    res.json({ success: true, message: 'Login successful', isAdmin });
  });
});


app.post('/api/employer/login', (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'Missing User ID or Password' });
  }

  employerDB.get(`
    SELECT * FROM employers 
    WHERE preferredUserId = ? AND preferredPassword = ?`,
    [userId, password],
    (err, row) => {
      if (err) {
        console.error('❌ Employer Login DB Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        console.log('❌ Invalid credentials for employer:', userId);
        return res.status(401).json({ error: 'Invalid User ID or Password' });
      }

      if (row.status !== 'ACCEPTED') {
        console.log(`❌ Employer status not accepted (${row.status}) for:`, userId);
        return res.status(403).json({ error: `Your account is ${row.status}. Access denied.` });
      }

      // ✅ Store employer info in session with isEmployer flag
      req.session.user = {
        id: row.id,
        preferredUserId: row.preferredUserId,
        isEmployer: true   // ✅ Needed for authorization middleware
      };

      console.log('✅ Employer Login successful for:', userId);
      res.json({ success: true, message: 'Login successful. Welcome Employer!' });
    }
  );
});






app.get('/api/registration', (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  registrationDB.get(
    "SELECT COUNT(*) AS total FROM registration WHERE firstName LIKE ? OR lastName LIKE ?",
    [search, search],
    (e, result) => {
      if (e) return res.status(500).json({ error: e.message });
      const total = result.total;
      registrationDB.all(
        "SELECT * FROM registration WHERE firstName LIKE ? OR lastName LIKE ? LIMIT ? OFFSET ?",
        [search, search, limit, offset],
        (e2, rows) => {
          if (e2) return res.status(500).json({ error: e2.message });
          res.json({
            rows,
            total,
            totalPages: Math.ceil(total / limit)
          });
        }
      );
    }
  );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/api/fullInformation/add', (req, res) => {
  const {
    firstName, lastName, initial, suffix, gender,
    civilStatus, dateBirth, maiden, phoneNo,
    major, yearStarted, graduated, studentNo
  } = req.body;

  if (!firstName || !lastName || !initial || !suffix || !gender ||
      !civilStatus || !dateBirth || !maiden || !phoneNo ||
      !major || !yearStarted || !graduated || !studentNo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  fullInfoDB.run(`
    INSERT INTO fullInformation (
      firstName, lastName, initial, suffix, gender,
      civilStatus, dateBirth, maiden, phoneNo,
      major, yearStarted, graduated, studentNo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    firstName, lastName, initial, suffix, gender,
    civilStatus, dateBirth, maiden, phoneNo,
    major, yearStarted, graduated, studentNo
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

app.get('/api/fullInformation', (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 100;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  fullInfoDB.get(
    "SELECT COUNT(*) AS total FROM fullInformation WHERE firstName LIKE ? OR lastName LIKE ?",
    [search, search],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const total = result.total;
      fullInfoDB.all(
        "SELECT * FROM fullInformation WHERE firstName LIKE ? OR lastName LIKE ? LIMIT ? OFFSET ?",
        [search, search, limit, offset],
        (err2, rows) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({
            rows,
            total,
            totalPages: Math.ceil(total / limit)
          });
        }
      );
    }
  );
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////



// Image uploader (memory)
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ➕ POST: Add new event
app.post('/api/events/add', uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image' });
  const { title, description, location } = req.body;

  eventDB.run(`
    INSERT INTO events (image, title, description, location)
    VALUES (?, ?, ?, ?)
  `, [req.file.buffer, title, description, location], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// 📥 GET: All events
app.get('/api/events', (req, res) => {
  eventDB.all(`
    SELECT id, title, description, location, datePosted, image 
    FROM events ORDER BY datePosted DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const events = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      location: row.location,
      datePosted: row.datePosted,
      image: `data:image/jpeg;base64,${row.image.toString('base64')}`
    }));
    res.json({ events });
  });
});

// ✏️ PUT: Update event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, location } = req.body;

  eventDB.run(`
    UPDATE events
    SET title = ?, description = ?, location = ?
    WHERE id = ?
  `, [title, description, location, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  });
});

// ❌ DELETE: Remove event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;

  eventDB.run(`DELETE FROM events WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  });
});




// ➕ POST: Add new career
// Middleware to check if logged in as Employer or Admin
function authorizeAdminOrEmployer(req, res, next) {
  const user = req.session?.user;
  if (!user) return res.status(403).json({ error: 'Unauthorized access' });

  if (user.isAdmin || user.isEmployer) {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized access' });
}

// Career Post Route with Authorization & Notifications
app.post('/api/careers/add', authorizeAdminOrEmployer, uploadImage.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const { title, description, link } = req.body;
  const user = req.session.user;

  // ✅ Choose correct display name
  const postedBy = user.isAdmin ? user.userName : user.preferredUserId;

  careerDB.run(`
    INSERT INTO careers (image, title, description, link)
    VALUES (?, ?, ?, ?)`,
    [req.file.buffer, title, description, link],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const createdAt = new Date().toISOString();
      const message = `${title} posted by ${postedBy}`;

      notifDB.run(`
        INSERT INTO notifications (name, link, message, createdAt)
        VALUES (?, ?, ?, ?)`,
        [`Career Post by ${postedBy}`, 'career-posting.html', message, createdAt],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });

          io.emit('newNotification', {
            id: this.lastID,
            name: `Career Post by ${postedBy}`,
            message,
            link: 'career-posting.html',
            createdAt
          });

          res.json({ success: true, id: this.lastID });
        }
      );
    }
  );
});






// 📥 GET: All careers
app.get('/api/careers', (req, res) => {
  careerDB.all(`
    SELECT id, title, description, link, datePosted, image 
    FROM careers ORDER BY datePosted DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const careers = rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      link: row.link,
      datePosted: row.datePosted,
      image: `data:image/jpeg;base64,${row.image.toString('base64')}`
    }));
    res.json({ careers });
  });
});

// ✏️ PUT: Update event
app.put('/api/careers/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, link } = req.body;

  careerDB.run(`
    UPDATE careers
    SET title = ?, description = ?, link = ?
    WHERE id = ?
  `, [title, description, link, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Career not found' });
    res.json({ success: true });
  });
});

// ❌ DELETE: Remove event
app.delete('/api/careers/:id', (req, res) => {
  const { id } = req.params;

  careerDB.run(`DELETE FROM careers WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Career not found' });
    res.json({ success: true });
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const uploadReceipt = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // optional limit: 5MB
});


app.post('/api/homeregs', uploadReceipt.single('receipt'), (req, res) => {
  const { firstName, middleInitial, lastName, sex, program, yearGraduated, addon } = req.body;

  let imageBuffer = null;
  if (addon !== 'no addon') {
    if (!req.file) {
      return res.status(400).json({ error: 'Receipt is required for selected add-on' });
    }
    imageBuffer = req.file.buffer;
  }

  homeregDB.run(`
    INSERT INTO homeregs (
      firstName, middleInitial, lastName, sex, program,
      yearGraduated, addon, image, status, submittedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'))
  `, [firstName, middleInitial, lastName, sex, program, yearGraduated, addon, imageBuffer], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // ✅ 1️⃣ Save notification into the inbox DB
    const notifMessage = `${firstName} ${lastName} submitted a HomeComing Registration Form.`;
    const createdAt = new Date().toISOString();

    notifDB.run(`
      INSERT INTO notifications (name, message, link, createdAt)
      VALUES (?, ?, ?, ?)
    `, ['HomeComing event', notifMessage, 'event-registration.html', createdAt], function (err2) {
      if (!err2) {
        // ✅ 2️⃣ Emit after successful DB insert
        io.emit('newNotification', {
          id: this.lastID,
          name: 'HomeComing Event Registration',
          message: notifMessage,
          link: 'event-registration.html',
          createdAt
        });
      }
    });

    res.json({ success: true, id: this.lastID });
  });
});



// 📄 GET: All homecoming registrations
app.get('/api/homeregs', (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  homeregDB.get(`SELECT COUNT(*) AS cnt FROM homeregs
    WHERE firstName LIKE ? OR lastName LIKE ?`, 
    [search, search], (err, { cnt }) => {
      if (err) return res.status(500).json({ error: err.message });
      const totalPages = Math.ceil(cnt / limit);

      homeregDB.all(`
        SELECT id, firstName, middleInitial, lastName, sex, program,
              yearGraduated, addon, image, status, submittedAt
        FROM homeregs
        WHERE firstName LIKE ? OR lastName LIKE ?
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `, [search, search, limit, offset], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const registrations = rows.map(row => ({
          id: row.id,
          firstName: row.firstName,
          middleInitial: row.middleInitial,
          lastName: row.lastName,
          sex: row.sex,
          program: row.program,
          yearGraduated: row.yearGraduated,
          addon: row.addon,
          status: row.status,
          submittedAt: row.submittedAt,
          image: row.image
            ? `data:image/png;base64,${row.image.toString('base64')}`
            : null
        }));

        res.json({ registrations, totalPages });
      });
    });
});


// ✅ Fix: PATCH endpoint to update status
app.patch('/api/homeregs/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  homeregDB.run(
    'UPDATE homeregs SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    }
  );
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////

// ✅ POST new team with players (Default status = 'PENDING')
app.post('/api/sportfest/mensBasketball', express.json(), (req, res) => {
  const { teamName, ageRange, players } = req.body;

  if (!teamName || !ageRange || !Array.isArray(players)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const now = new Date().toISOString();

  sportDB.run(
    'INSERT INTO teams (teamName, ageRange, submittedAt, status) VALUES (?, ?, ?, ?)',
    [teamName, ageRange, now, 'PENDING'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const teamId = this.lastID;
      const stmt = sportDB.prepare(`
        INSERT INTO members (teamId, firstName, middleInitial, lastName)
        VALUES (?, ?, ?, ?)
      `);

      players.forEach(player => {
        stmt.run(teamId, player.firstName || '', player.middleInitial || '', player.lastName || '');
      });

      stmt.finalize(err2 => {
        if (err2) return res.status(500).json({ error: err2.message });

        // ✅ 1️⃣ Save notification to DB
        const message = `Team "${teamName}" registered for Men's Basketball.`;
        notifDB.run(
          `INSERT INTO notifications (name, message, link, createdAt)
           VALUES (?, ?, ?, ?)`,
          ['Sports Registration', message, 'mensBasketball.html', now],
          function (notifErr) {
            if (!notifErr) {
              // ✅ 2️⃣ Emit real-time notification
              io.emit('newNotification', {
                id: this.lastID,
                name: 'Sports Registration',
                message,
                link: 'mensBasketball.html',
                createdAt: now
              });
            }
          }
        );

        res.json({
          success: true,
          teamId,
          playerCount: players.length,
          submittedAt: now
        });
      });
    }
  );
});


// ✅ GET all teams
app.get('/api/sportfest/teams', (req, res) => {
  sportDB.all(
    'SELECT id, teamName, ageRange, submittedAt, status FROM teams',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ teams: rows });
    }
  );
});

// ✅ GET team members
app.get('/api/sportfest/teams/:id/members', (req, res) => {
  const teamId = req.params.id;
  sportDB.all(
    'SELECT firstName, middleInitial, lastName FROM members WHERE teamId = ?',
    [teamId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ members: rows });
    }
  );
});

// ✅ PATCH update team status
app.patch('/api/sportfest/teams/:id/status', express.json(), (req, res) => {
  const { status } = req.body;
  const id = +req.params.id;
  if (!['ACCEPTED', 'DECLINED', 'PENDING'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  sportDB.run(
    'UPDATE teams SET status = ? WHERE id = ?',
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, status });
    }
  );
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////


app.post('/api/allsport/add', (req, res) => {
  const {
    firstName, middleName, lastName, gender,
    extension, yearGraduated, sportType
  } = req.body;

  if (!firstName || !lastName || !gender) {
    return res.status(400).json({ error: 'First name, last name, and gender are required' });
  }

  const submittedAt = new Date().toISOString();
  const status = 'PENDING';

  allSportDB.run(`
    INSERT INTO athletes (
      firstName, middleName, lastName, gender,
      extension, yearGraduated, submittedAt, status, sportType
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      firstName, middleName, lastName, gender,
      extension, yearGraduated, submittedAt, status, sportType
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // ✅ 1️⃣ Save notification to DB
      const message = `Athlete "${firstName} ${lastName}" registered for ${sportType || 'Unknown Sport'}.`;
      notifDB.run(
        `INSERT INTO notifications (name, message, link, createdAt)
         VALUES (?, ?, ?, ?)`,
        ['Athlete Registration', message, 'allsport.html', submittedAt],
        function (notifErr) {
          if (!notifErr) {
            // ✅ 2️⃣ Emit real-time notification
            io.emit('newNotification', {
              id: this.lastID,
              name: 'Athlete Registration',
              message,
              link: 'allsport.html',
              createdAt: submittedAt
            });
          }
        }
      );

      res.json({ success: true, id: this.lastID });
    }
  );
});


app.patch('/api/allsport/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['PENDING', 'ACCEPTED', 'DECLINED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  allSportDB.run(`UPDATE athletes SET status = ? WHERE id = ?`, [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Entry not found' });
    res.json({ success: true });
  });
});

app.get('/api/allsport', (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  allSportDB.get(`
    SELECT COUNT(*) AS total FROM athletes
    WHERE firstName LIKE ? OR lastName LIKE ? OR middleName LIKE ?
  `, [search, search, search], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = result.total;
    const totalPages = Math.ceil(total / limit);

    allSportDB.all(`
      SELECT * FROM athletes
      WHERE firstName LIKE ? OR lastName LIKE ? OR middleName LIKE ?
      ORDER BY submittedAt DESC
      LIMIT ? OFFSET ?
    `, [search, search, search, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ rows, totalPages });
    });
  });
});

app.get('/api/allsport/distinct-sports', (req, res) => {
  allSportDB.all(`SELECT DISTINCT sportType FROM athletes`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ sports: rows.map(r => r.sportType).filter(s => s) });
  });
});

/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////

const uploadPhoto = multer();

// GET all gallery items
app.get('/api/gallery', (req, res) => {
  galleryDB.all('SELECT id, image, datePosted FROM gallery ORDER BY datePosted DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const items = rows.map(r => ({
      id: r.id,
      datePosted: r.datePosted,
      image: `data:image/jpeg;base64,${r.image.toString('base64')}`
    }));
    res.json({ items });
  });
});

// POST multiple gallery items
app.post('/api/gallery/add-multiple', uploadPhoto.array('images', 25), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one image required' });
  }

  const now = new Date().toISOString();
  const stmt = galleryDB.prepare('INSERT INTO gallery (image, datePosted) VALUES (?, ?)');

  req.files.forEach(file => {
    stmt.run(file.buffer, now);
  });

  stmt.finalize(err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE gallery item
app.delete('/api/gallery/:id', (req, res) => {
  galleryDB.run('DELETE FROM gallery WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  });
});

/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////

// ✅ Add New ID Request
const storage = multer.memoryStorage();

// ✅ Then create the upload instance
const idUpload = multer({ storage });

// ✅ Example route
app.post('/api/requests/add', idUpload.single('idImage'), (req, res) => {
  const { fullName, degree, yearGraduated, studentNo, phoneNo, email } = req.body;
  const idImage = req.file;

  if (!fullName || !degree || !yearGraduated || !studentNo || !phoneNo || !email || !idImage) {
    return res.status(400).json({ error: 'Missing required fields or ID Image' });
  }

  const submittedAt = new Date().toISOString();

  requestDB.run(`
    INSERT INTO requests (fullName, degree, yearGraduated, studentNo, phoneNo, email, idImage, submittedAt, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [fullName, degree, yearGraduated, studentNo, phoneNo, email, idImage.buffer, submittedAt, 'PENDING'], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const message = `${fullName} submitted an ID request.`;

    // 1️⃣ Save into notifications table
    notifDB.run(`
      INSERT INTO notifications (name, message, link, createdAt)
      VALUES (?, ?, ?, ?)
    `, ['ID Request Submitted', message, 'admin-id.html', submittedAt], function (notifErr) {
      if (!notifErr) {
        // 2️⃣ Emit notification real-time
        io.emit('newNotification', {
          id: this.lastID,
          name: 'ID Request Submitted',
          message,
          link: 'admin-id.html',
          createdAt: submittedAt
        });
      }
    });

    res.json({ success: true, id: this.lastID, message: 'Request with ID Image saved successfully' });
  });
});


// ✅ Get ID Request List with Pagination & Search
app.get('/api/requests/list', (req, res) => {
  const { page = 1, limit = 100, search = '' } = req.query;
  const offset = (page - 1) * limit;
  const query = `%${search}%`;

  requestDB.get(`SELECT COUNT(*) AS total FROM requests WHERE fullName LIKE ?`, [query], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const total = result.total;
    requestDB.all(`
      SELECT * FROM requests WHERE fullName LIKE ? ORDER BY submittedAt DESC LIMIT ? OFFSET ?
    `, [query, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.json({ requests: rows, totalPages: Math.ceil(total / limit) });
    });
  });
});

// ✅ Update Request Status (Accept/Decline)
app.patch('/api/requests/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!['PENDING', 'ACCEPTED', 'DECLINED'].includes(status?.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  requestDB.run(`UPDATE requests SET status = ? WHERE id = ?`, [status.toUpperCase(), id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to update status' });
    res.json({ success: true });
  });
});

app.get('/api/requests/:id/image', (req, res) => {
  const { id } = req.params;

  requestDB.get(`SELECT idImage FROM requests WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('❌ DB Error retrieving image:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row || !row.idImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', 'image/jpeg'); // or adjust to 'image/png' if applicable
    res.send(row.idImage);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const { sendOtpEmail } = require('./GmailMailer');
const otpStore = {};  // In-memory OTP store
const employerOtpRateLimit = {};


const otpRateLimit = {};
const MAX_OTP_REQUESTS = 5;
const TIME_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function otpLimiter(req, res, next) {
  const userName = req.body.userName || req.body.userId;
  if (!userName) return res.status(400).json({ error: 'Username is required' });

  const now = Date.now();

  if (!otpRateLimit[userName]) {
    otpRateLimit[userName] = [];
  }

  otpRateLimit[userName] = otpRateLimit[userName].filter(ts => now - ts < TIME_WINDOW_MS);

  if (otpRateLimit[userName].length >= MAX_OTP_REQUESTS) {
    return res.status(429).json({ error: '❌ Too many OTP requests. Please try again later.' });
  }

  otpRateLimit[userName].push(now);

  next();
}

// ✅ Find User Email
app.post('/api/forgot/find-user', (req, res) => {
  const { userName } = req.body;
  if (!userName) return res.status(400).json({ error: 'Username required' });

  registrationDB.get(`SELECT personalEmail FROM registration WHERE userName = ?`, [userName], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'User not found' });

    res.json({ email: row.personalEmail });
  });
});

// ✅ Send OTP to User's Email
app.post('/api/forgot/send-otp', otpLimiter, (req, res) => {
  const userKey = req.body.userName || req.body.userId;
  if (!userKey) return res.status(400).json({ error: 'Username or User ID is required' });

  // Check Alumni First
  registrationDB.get(`SELECT personalEmail FROM registration WHERE userName = ?`, [userKey], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (row) {
      // ✅ Found Alumni
      sendOtpToUser(userKey, row.personalEmail, res);
    } else {
      // ✅ If not found in Alumni, check Employer
      employerDB.get(`SELECT companyEmail FROM employers WHERE preferredUserId = ?`, [userKey], (err2, row2) => {
        if (err2) return res.status(500).json({ error: 'Database error' });
        if (!row2) return res.status(404).json({ error: 'User not found' });

        // ✅ Found Employer
        sendOtpToUser(userKey, row2.companyEmail, res);
      });
    }
  });
});

function sendOtpToUser(userKey, email, res) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[userKey] = {
    code: otp,
    expires: Date.now() + (parseInt(process.env.OTP_EXPIRE_MINUTES || 10) * 60000)
  };

  sendOtpEmail(email, otp)
    .then(() => res.json({ success: true, message: '✅ OTP sent to email' }))
    .catch(error => res.status(500).json({ error: 'Failed to send email', details: error.message }));
}

// ✅ Verify OTP
app.post('/api/forgot/verify-otp', (req, res) => {
  const userKey = req.body.userName || req.body.userId;
  const { otp } = req.body;
  if (!userKey || !otp) return res.status(400).json({ error: 'Missing data' });

  const record = otpStore[userKey];
  if (!record || Date.now() > record.expires) {
    return res.status(400).json({ error: 'OTP expired or invalid' });
  }

  if (otp !== record.code) {
    return res.status(400).json({ error: 'Incorrect OTP' });
  }

  res.json({ success: true, message: 'OTP verified' });
});

// ✅ Reset Password
app.post('/api/forgot/reset-password', (req, res) => {
  const userKey = req.body.userName || req.body.userId;
  const { newPassword } = req.body;
  if (!userKey || !newPassword) return res.status(400).json({ error: 'Missing data' });

  // First check Alumni
  registrationDB.run(
    `UPDATE registration SET passWord = ? WHERE userName = ?`,
    [newPassword, userKey],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });

      if (this.changes > 0) {
        delete otpStore[userKey];
        return res.json({ success: true, message: 'Password reset successfully (Alumni)' });
      }

      // If not Alumni, check Employer
      employerDB.run(
        `UPDATE employers SET preferredPassword = ? WHERE preferredUserId = ?`,
        [newPassword, userKey],
        function (err2) {
          if (err2) return res.status(500).json({ error: 'Database error', details: err2.message });

          if (this.changes > 0) {
            delete otpStore[userKey];
            return res.json({ success: true, message: 'Password reset successfully (Employer)' });
          }

          return res.status(404).json({ error: 'User not found' });
        }
      );
    }
  );
});

app.post('/api/employer/forgot/employer-user', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  employerDB.get(`SELECT companyEmail FROM employers WHERE preferredUserId = ?`, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Employer not found' });

    res.json({ email: row.companyEmail });
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// ✅ Add Employer Registration
app.post('/api/employer/employers', (req, res) => {
  const {
    employerName, businessName, businessAddress,
    landlineNo, mobileNo, companyEmail, companyWebsite,
    preferredUserId, preferredPassword
  } = req.body;

  // ✅ Validate Required Fields
  if (!employerName || !preferredUserId || !preferredPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ✅ Check if User ID Already Exists
  employerDB.get(`SELECT * FROM employers WHERE LOWER(preferredUserId) = LOWER(?)`, [preferredUserId], (err, existing) => {
    if (err) {
      console.error('❌ Employer Username Check Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existing) {
      console.log('❌ Employer username already taken');
      return res.status(409).json({ error: 'Preferred User ID is already taken. Please choose another.' });
    }

    // ✅ Insert Employer
    employerDB.run(`
      INSERT INTO employers (
        employerName, businessName, businessAddress,
        landlineNo, mobileNo, companyEmail, companyWebsite,
        preferredUserId, preferredPassword
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employerName, businessName, businessAddress,
        landlineNo, mobileNo, companyEmail, companyWebsite,
        preferredUserId, preferredPassword
      ],
      function (err2) {
        if (err2) {
          console.error('❌ Error inserting employer:', err2);
          return res.status(500).json({ error: 'Failed to save employer registration' });
        }

        console.log('✅ Employer registered successfully. Sending notification...');

        const notif = {
          name: 'Employer Registrations',
          message: `New employer registration received from ${employerName}`,
          link: 'admin-employer.html',
          createdAt: new Date().toISOString()
        };

        // ✅ Insert into Notifications DB
        notifDB.run(`
          INSERT INTO notifications (name, link, message, createdAt)
          VALUES (?, ?, ?, ?)`,
          [notif.name, notif.link, notif.message, notif.createdAt]
        );

        // ✅ Emit Real-time to Admins
        io.emit('newNotification', notif);

        res.json({ success: true, id: this.lastID, message: 'Employer registered successfully.' });
      }
    );
  });
});




// ✅ List Employers (Admin View)
app.get('/api/employer/list', (req, res) => {
  employerDB.all(`SELECT * FROM employers ORDER BY submittedAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ employers: rows });
  });
});

// ✅ Update Status
app.patch('/api/employer/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['PENDING', 'ACCEPTED', 'DECLINED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  employerDB.run(`UPDATE employers SET status = ? WHERE id = ?`, [status, id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update status' });
    res.json({ success: true });
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/api/admin/id-announcement', (req, res) => {
  const { title, description, submittedAt } = req.body;
  if (!title || !description || !submittedAt) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  idpostDB.run(
    `INSERT INTO idposts (title, description, datePosted) VALUES (?, ?, ?)`,
    [title, description, submittedAt],
    function (err) {
      if (err) {
        console.error('❌ Error inserting into DB:', err.message);
        return res.status(500).json({ error: 'Failed to post announcement' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get('/api/admin/id-announcements', (_, res) => {

  idpostDB.all(`SELECT * FROM idposts ORDER BY datePosted DESC`, [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching announcements:', err.message);
      return res.status(500).json({ error: 'Failed to fetch announcements' });
    }

    res.json({ announcements: rows });
  });
});

app.delete('/api/admin/id-announcement/:id', (req, res) => {
  const { id } = req.params;
  idpostDB.run(`DELETE FROM idposts WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('❌ Error deleting announcement:', err.message);
      return res.status(500).json({ error: 'Failed to delete announcement' });
    }
    res.json({ success: true, deleted: this.changes });
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




io.on('connection', (socket) => {
  notifDB.all(`SELECT * FROM notifications ORDER BY createdAt DESC`, [], (err, rows) => {
    if (!err) socket.emit('loadNotifications', rows);
  });
});

// Add new notification API (Simulated New Form)
app.post('/api/notifications/add', (req, res) => {
  const { name, link, message } = req.body;
  const createdAt = new Date().toISOString();

  notifDB.run(`INSERT INTO notifications (name, link, message, createdAt) VALUES (?, ?, ?, ?)`,
    [name, link, message, createdAt], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const newNotif = { id: this.lastID, name, link, message, createdAt };
      io.emit('newNotification', newNotif);  // Real-time push
      res.json({ success: true, notification: newNotif });
    });
});

app.get('/api/admin/inbox', (_, res) => {
  notifDB.all(`SELECT * FROM notifications ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Clear all notifications
app.delete('/api/notifications/clear', (req, res) => {
  notifDB.run(`DELETE FROM notifications`, [], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    console.log(`✅ All notifications cleared (${this.changes} deleted)`);
    res.json({ success: true });
  });
});

app.delete('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  notifDB.run(`DELETE FROM notifications WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

app.get('/api/admin/notifications/list', (_, res) => {
  employerDB.get(`SELECT COUNT(*) as count FROM employers WHERE status = 'PENDING'`, [], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({
      notifications: [
        { name: 'Employer Registrations', count: row.count || 0, link: 'admin-employer.html' }
      ]
    });
  });
});


app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));