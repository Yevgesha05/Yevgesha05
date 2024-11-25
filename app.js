const express = require('express');
const fs = require('fs'); // Для роботи з файлом
const app = express();
const PORT = process.env.PORT || 3001; // Використовуйте порт 3001

// Шлях до файлу для збереження постів
const FILE_PATH = './data/posts.json';

// Ініціалізація масиву для збереження постів
let posts = [];

// Завантаження постів з файлу, якщо він існує
if (fs.existsSync(FILE_PATH)) {
    try {
        posts = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    } catch (err) {
        console.error("Error parsing posts.json:", err);
        posts = [];
    }
} else {
    posts = [];
}

// Функція для збереження постів у файл
function savePosts() {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(posts, null, 2));
    } catch (err) {
        console.error("Error writing to posts.json:", err);
    }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Для стилів

// Налаштування шаблонізатора EJS
app.set('view engine', 'ejs');

// Головна сторінка
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Додавання нового поста
app.post('/add-post', (req, res) => {
    const { title, author, description } = req.body;

    if (!title || !author || !description) {
        return res.status(400).send('All fields are required');
    }

    // Додати пост до масиву
    posts.push({ title, author, description });
    savePosts(); // Зберігаємо в JSON-файл
    res.redirect('/');
});

// Відображення форми редагування
app.get('/edit-post/:id', (req, res) => {
    const post = posts[req.params.id];
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('edit', { post, id: req.params.id });
});

// Оновлення поста
app.post('/edit-post/:id', (req, res) => {
    const { title, author, description } = req.body;
    const id = req.params.id;

    if (!title || !author || !description) {
        return res.status(400).send('All fields are required');
    }

    if (!posts[id]) {
        return res.status(404).send('Post not found');
    }

    // Оновлюємо пост у масиві
    posts[id] = { title, author, description };
    savePosts(); // Зберігаємо зміни
    res.redirect('/');
});

// Видалення поста
app.post('/delete-post/:id', (req, res) => {
    const id = req.params.id;

    if (!posts[id]) {
        return res.status(404).send('Post not found');
    }

    posts.splice(id, 1); // Видаляємо пост за індексом
    savePosts(); // Зберігаємо зміни
    res.redirect('/');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

  














