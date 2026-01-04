// scaffold.js
const fs = require('fs');
const path = require('path');

const structure = {
  backend: {
    routes: ['auth.js', 'chat.js', 'doc.js', 'ocr.js'],
    models: ['User.js', 'Chat.js', 'Doc.js'],
    middleware: ['auth.js'],
    services: ['embeddings.js', 'qa.js'],
    config: ['db.js'],
    files: ['server.js']
  },
  frontend: {
    src: {
      pages: ['Login.jsx', 'Signup.jsx', 'Chat.jsx'],
      components: ['util.css'],
      files: ['App.jsx', 'api.js', 'store.js', 'index.css']
    },
    public: ['favicon.ico']
  },
  root: ['.env', 'package.json', 'README.md']
};

function create(base, obj) {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(f => {
        const filePath = path.join(base, key, f);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, '');
      });
    } else if (typeof obj[key] === 'object') {
      const dirPath = path.join(base, key);
      fs.mkdirSync(dirPath, { recursive: true });
      create(dirPath, obj[key]);
    }
  }
}

fs.mkdirSync('student-chatbot', { recursive: true });
create('student-chatbot', structure);
console.log('✅ Folder structure created!');
