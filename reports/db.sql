-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Developer', 'Entrepreneur') DEFAULT 'Developer',
    isAdmin BOOLEAN DEFAULT FALSE
);

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner INT NOT NULL,
    FOREIGN KEY (owner) REFERENCES users(id)
);

-- Project-User relationship (many-to-many)
CREATE TABLE project_users (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Developers table (extends users)
CREATE TABLE developers (
    id INT PRIMARY KEY,
    years_of_experience INT DEFAULT 0,
    technologies TEXT,
    FOREIGN KEY (id) REFERENCES users(id)
);

-- Entrepreneurs table (extends users)
CREATE TABLE entrepreneurs (
    id INT PRIMARY KEY,
    industry VARCHAR(255),
    companies TEXT,
    FOREIGN KEY (id) REFERENCES users(id)
);

-- Tags table (for both posts and projects)
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL
);

-- Post-Tag relationship (many-to-many)
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Projects-Tags relationship (many-to-many)
CREATE TABLE project_tags (
    project_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE,
    description TEXT,
    project_id INT NOT NULL,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Messages table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_user INT NOT NULL,
    project VARCHAR(255),
    files TEXT,
    description TEXT,
    date DATE,
    project_id INT NOT NULL,
    FOREIGN KEY (from_user) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Posts table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner INT NOT NULL,
    connect_project_id INT,
    FOREIGN KEY (owner) REFERENCES users(id),
    FOREIGN KEY (connect_project_id) REFERENCES projects(id)
);

-- Comments table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    from_user INT NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (from_user) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);


-- Function to get user by key
SELECT * FROM users WHERE username = :query OR email = :query;

-- Function to create user
INSERT INTO users (username, email, password, role, isAdmin) VALUES (:username, :email, :password, :role, :isAdmin);

-- Function to create developer (related to user)
INSERT INTO developers (id, years_of_experience, technologies) VALUES (:user_id, 0, '[]');

-- Function to create entrepreneur (related to user)
INSERT INTO entrepreneurs (id, industry, companies) VALUES (:user_id, '', '[]');

-- Function to update user data (not implementing full update, just an example)
UPDATE users SET username = :username, email = :email, password = :password WHERE id = :user_id;

-- Function to delete user
DELETE FROM users WHERE id = :user_id;

-- Function to delete developer or entrepreneur data when user is deleted
DELETE FROM developers WHERE id = :user_id;
DELETE FROM entrepreneurs WHERE id = :user_id;

-- Function to toggle ban status
INSERT INTO blacklist (user_id) VALUES (:user_id) ON DUPLICATE KEY UPDATE user_id = :user_id;

-- Function to get role-specific data
SELECT * FROM developers WHERE id = :user_id;
SELECT * FROM entrepreneurs WHERE id = :user_id;

-- Search for user by matching fields
SELECT * FROM users WHERE username LIKE :query OR email LIKE :query;

-- Create Tag
INSERT INTO tags (name, id)
VALUES (?, ?);

-- Create Project
INSERT INTO projects (name, owner, description, id)
VALUES (?, ?, ?, ?);

-- Update Project
UPDATE projects
SET name = ?, owner = ?, description = ?
WHERE id = ?;

-- Find Project
SELECT * FROM projects
WHERE name LIKE ?
AND id NOT IN (SELECT userId FROM project_users WHERE projectId = ?);

-- Join Project
INSERT INTO project_users (projectId, userId)
VALUES (?, ?);

-- Get Projects from User
SELECT * FROM projects
WHERE id IN (SELECT projectId FROM project_users WHERE userId = ?);

-- Get Projects from Owner
SELECT * FROM projects
WHERE owner = ?;

-- Create Task
INSERT INTO tasks (name, description, projectId, date, id)
VALUES (?, ?, ?, ?, ?);

-- Get Tasks from Project
SELECT * FROM tasks
WHERE projectId = ?
AND id > ?;

-- Update Task
UPDATE tasks
SET status = ?, completedAt = ?
WHERE id = ?;

-- Create Message
INSERT INTO messages (projectId, senderId, content, files, date, id)
VALUES (?, ?, ?, ?, ?, ?);

-- Get Messages from Project
SELECT * FROM messages
WHERE projectId = ?
AND id > ?;

-- Get Tags for Project
SELECT * FROM tags
WHERE projectId = ?;

-- Create Post
INSERT INTO posts (title, content, authorId, date, id)
VALUES (?, ?, ?, ?, ?);

-- Create Comment
INSERT INTO comments (postId, content, authorId, date, id)
VALUES (?, ?, ?, ?, ?);

-- Get Comments for Post
SELECT * FROM comments
WHERE postId = ?
AND id > ?;

-- Get Tags for Post
SELECT * FROM tags
WHERE postId = ?;

-- Get All Posts
SELECT * FROM posts
WHERE id > ?
