-- =================================== DATABASE ===================================
CREATE DATABASE AppDB;


CREATE TABLE Client (
    C_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    C_Username    VARCHAR(50)     UNIQUE,
    C_Password    VARCHAR(100)    NOT NULL,
    C_Email       VARCHAR(255)    UNIQUE,
    C_FirstName   VARCHAR(50)     NOT NULL,
    C_LastName    VARCHAR(50)     NOT NULL,
    C_MiddleName  VARCHAR(50),
);

CREATE TABLE Education (
    ED_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    C_ID          INT             NOT NULL,
    ED_School     VARCHAR(50)     NOT NULL,
    ED_Degree     VARCHAR(50)     NOT NULL,
    ED_Field      VARCHAR(50)     NOT NULL,
    ED_StartDate  DATE            NOT NULL,
    ED_EndDate    DATE,
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE SocialLinks (
    SL_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    C_ID          INT             NOT NULL,
    SL_Link       VARCHAR(255)    NOT NULL,
    SL_Type       ENUM("Facebook", "Twitter", "Instagram", "LinkedIn", "Github", "Other"),
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE Entrepreneur (
    E_ID          INT             PRIMARY KEY,
    FOREIGN KEY   (E_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE EntrepreneurCompany (
    EC_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    E_ID          INT             NOT NULL,
    EC_Name       VARCHAR(50)     NOT NULL,
    FOREIGN KEY   (E_ID)          REFERENCES Entrepreneur(E_ID) ON DELETE CASCADE

);

CREATE TABLE Developer (
    D_ID          INT             PRIMARY KEY,
    FOREIGN KEY   (D_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE DeveloperTechnology (
    DT_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    D_ID          INT             NOT NULL,
    DT_Name       VARCHAR(50)     NOT NULL,
    FOREIGN KEY   (D_ID)          REFERENCES Developer(D_ID) ON DELETE CASCADE
);

CREATE TABLE Admin (
    A_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    A_Username    VARCHAR(50)     UNIQUE,
    A_Password    VARCHAR(100)    NOT NULL,
    A_Email       VARCHAR(255)    UNIQUE,
    A_FirstName   VARCHAR(50)     NOT NULL,
    A_LastName    VARCHAR(50)     NOT NULL,
    A_MiddleName  VARCHAR(50),
);

CREATE TABLE Message (
    M_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    M_Description TEXT,
    M_File        BLOB
);

CREATE TABLE Project (
    PR_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    PR_Name       VARCHAR(50)     NOT NULL,
    PR_Role       VARCHAR(50)
);

CREATE TABLE Task (
    T_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    T_Name        VARCHAR(50)     NOT NULL,
    T_Description TEXT,
    T_Deadline    DATE,
    T_Status      ENUM("Pending", "In Progress", "Completed"),
    PR_ID         INT             NOT NULL,
    FOREIGN KEY   (PR_ID)         REFERENCES Project(PR_ID) ON DELETE CASCADE
);

CREATE TABLE Tag (
    TA_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    TA_Name       VARCHAR(50)     NOT NULL
    PR_ID         INT             NOT NULL,
    FOREIGN KEY   (PR_ID)         REFERENCES Project(PR_ID) ON DELETE CASCADE
);

CREATE TABLE TagDetails (
    TD_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    TA_ID         INT             NOT NULL,
    TD_Type       ENUM("Technology", "Status", "Other"),
    FOREIGN KEY   (TA_ID)         REFERENCES Tag(TA_ID) ON DELETE CASCADE
);

CREATE TABLE Post (
    P_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    P_Title       VARCHAR(50)     NOT NULL,
    P_Description TEXT,
    P_Date        DATE,
    P_File        BLOB,
    C_ID          INT             NOT NULL,
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE Comment (
    CO_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    CO_Description TEXT,
    CO_Date       DATE,
    CO_SuperID    INT,
    P_ID          INT             NOT NULL,
    C_ID          INT,
    FOREIGN KEY   (CO_SuperID)    REFERENCES Comment(CO_ID) ON DELETE CASCADE,
    FOREIGN KEY   (P_ID)          REFERENCES Post(P_ID) ON DELETE CASCADE,
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

-- =================================== RELATIONSHIPS ===================================
CREATE TABLE ReportTo (
    RT_ID         INT            PRIMARY KEY AUTO_INCREMENT,
    C_ID          INT            NOT NULL,
    A_ID          INT            NOT NULL,
    M_ID          INT            NOT NULL,
    FOREIGN KEY   (M_ID)         REFERENCES Message(M_ID) ON DELETE CASCADE,
    FOREIGN KEY   (C_ID)         REFERENCES Client(C_ID) ON DELETE CASCADE,
    FOREIGN KEY   (A_ID)         REFERENCES Admin(A_ID) ON DELETE CASCADE
);

CREATE TABLE Manages (
    MG_ID         INT             PRIMARY KEY AUTO_INCREMENT,
    C_ID          INT             NOT NULL,
    A_ID          INT             NOT NULL,
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE,
    FOREIGN KEY   (A_ID)          REFERENCES Admin(A_ID) ON DELETE CASCADE
);

CREATE TABLE Send_Recieve (
    S_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    M_ID          INT             NOT NULL,
    C_From_ID     INT             NOT NULL,
    C_To_ID       INT,
    PR_ID         INT,
    FOREIGN KEY   (M_ID)          REFERENCES Message(M_ID) ON DELETE CASCADE,
    FOREIGN KEY   (C_From_ID)     REFERENCES Client(C_ID) ON DELETE CASCADE,
    FOREIGN KEY   (C_To_ID)       REFERENCES Client(C_ID) ON DELETE CASCADE,
    FOREIGN KEY   (PR_ID)         REFERENCES Project(PR_ID) ON DELETE CASCADE
);

CREATE TABLE Notify (
    N_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    TA_ID         INT             NOT NULL,
    C_ID          INT             NOT NULL,
    FOREIGN KEY   (TA_ID)         REFERENCES Tag(TA_ID) ON DELETE CASCADE,
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE JoinCreate (
    JC_ID         INT            PRIMARY KEY AUTO_INCREMENT,
    PR_ID         INT            NOT NULL,
    C_ID          INT            NOT NULL,
    FOREIGN KEY   (C_ID)         REFERENCES Client(C_ID) ON DELETE CASCADE,
    FOREIGN KEY   (PR_ID)        REFERENCES Project(PR_ID) ON DELETE CASCADE
);

CREATE TABLE LinkUp (
    LU_ID         INT            PRIMARY KEY AUTO_INCREMENT,
    P_ID          INT            NOT NULL,
    PR_ID         INT            NOT NULL,
    FOREIGN KEY   (P_ID)         REFERENCES Post(P_ID) ON DELETE CASCADE,
    FOREIGN KEY   (PR_ID)        REFERENCES Project(PR_ID) ON DELETE CASCADE
);

CREATE TABLE ProjectTag (
    PT_ID         INT            PRIMARY KEY AUTO_INCREMENT,
    PR_ID         INT            NOT NULL,
    TA_ID         INT            NOT NULL,
    FOREIGN KEY   (PR_ID)        REFERENCES Project(PR_ID) ON DELETE CASCADE,
    FOREIGN KEY   (TA_ID)        REFERENCES Tag(TA_ID) ON DELETE CASCADE
);

CREATE TABLE PostTag (
    PTAG_ID       INT            PRIMARY KEY AUTO_INCREMENT,
    P_ID          INT            NOT NULL,
    TA_ID         INT            NOT NULL,
    FOREIGN KEY   (P_ID)         REFERENCES Post(P_ID) ON DELETE CASCADE,
    FOREIGN KEY   (TA_ID)        REFERENCES Tag(TA_ID) ON DELETE CASCADE
);

-- =================================== Functions ===================================

-- Update Client information
UPDATE Client
SET C_Username = <Username>,
    C_Password = <Password>,
    C_Email = <Email>,
    C_FirstName = <FirstName>,
    C_LastName = <LastName>,
    C_MiddleName = <MiddleName>,
    C_Education = <Education>
WHERE C_ID = <ID>;

-- Update Education information
UPDATE Education
SET ED_School = <School>,
    ED_Degree = <Degree>,
    ED_Field = <Field>,
    ED_StartDate = <StartDate>,
    ED_EndDate = <EndDate>
WHERE ED_ID = <ID>;


-- Update SocialLinks information
UPDATE SocialLinks
SET SL_Link = <Link>,
    SL_Type = <Type>,
WHERE SL_ID = <ID>;

--  Get every single project based on the Client
SELECT * 
FROM Project
WHERE PR_ID IN (
    SELECT PR_ID 
    FROM JoinCreate 
    WHERE C_ID = <ID>
);

-- Get every single client based on the project
SELECT *
FROM Client
WHERE C_ID IN (
    SELECT C_ID 
    FROM JoinCreate
    WHERE PR_ID = <ID>
);

-- Get the project based on the Post
SELECT *
FROM Project
WHERE PR_ID IN (
    SELECT PR_ID
    FROM LinkUp
    WHERE P_ID = <ID>
);

-- Get the post based on the Project
SELECT *
FROM Post
WHERE P_ID IN (
    SELECT P_ID
    FROM LinkUp
    WHERE PR_ID = <ID>
);

-- Get Comments based on the PostTag
SELECT *
FROM Comment
WHERE P_ID IN (
    SELECT P_ID
    FROM PostTag
    WHERE TA_ID = <ID>
);

-- Get comments based on comments
SELECT *
FROM Comment
WHERE CO_SuperID = <ID>;

-- Get tag based on Post 
SELECT *
FROM Tag
WHERE TA_ID IN (
    SELECT TA_ID
    FROM PostTag
    WHERE P_ID = <ID>
);

-- Get tag based on ProjectTag
SELECT *
FROM Tag
WHERE TA_ID IN (
    SELECT TA_ID
    FROM ProjectTag
    WHERE PR_ID = <ID>
);

-- Get tag based on tag details type 
SELECT *
FROM Tag
WHERE TA_ID IN (
    SELECT TA_ID
    FROM TagDetails
    WHERE TD_Type = <TYPE>
);

-- Get tag details based on TagDetails
SELECT *
FROM TagDetails
WHERE TA_ID = <ID>;

-- Get task based on Project
SELECT *
FROM Task
WHERE PR_ID = <ID>;

-- Get tasks based on client from notify
SELECT *
FROM Task
WHERE TA_ID IN (
    SELECT TA_ID
    FROM Notify
    WHERE C_ID = <ID>
);

-- Get tasks based on status 
SELECT *
FROM Task
WHERE T_Status = <Status>;

-- Get messages based on client 
SELECT *
FROM Message
WHERE M_ID IN (
    SELECT M_ID
    FROM Send
    WHERE C_ID = <ID>
);

-- Get all of the E-Company Names
SELECT EC_Name 
FROM EntrepreneurCompany;

-- Get all of the Developer Technologies
SELECT DT_Name
FROM DeveloperTechnology;

-- Get all of the Admins based on username
SELECT *
FROM Admins
WHERE A_Username LIKE <Username>;

-- Get all of the Clients based on username 
SELECT *
FROM Client
WHERE C_Username LIKE <Username>;

-- Get all of the clients based on education 
SELECT *
FROM Client
WHERE C_ID IN (
    SELECT C_ID
    FROM Education
    WHERE ED_School LIKE <School>
);

-- Get all of the Entrepreneurs based on company Names
SELECT *
FROM Entrepreneur
WHERE E_ID IN (
    SELECT E_ID
    FROM EntrepreneurCompany
    WHERE EC_Name LIKE <Name>
);



-- Update Client information
UPDATE Client
SET C_Username = <Username>,
    C_Password = <Password>,
    C_Email = <Email>,
    C_FirstName = <FirstName>,
    C_LastName = <LastName>,
    C_MiddleName = <MiddleName>,
    C_Education = <Education>
WHERE C_ID = <ID>;

-- Update Education information
UPDATE Education
SET ED_School = <School>,
    ED_Degree = <Degree>,
    ED_Field = <Field>,
    ED_StartDate = <StartDate>,
    ED_EndDate = <EndDate>
WHERE ED_ID = <ID>;


-- Update SocialLinks information
UPDATE SocialLinks
SET SL_Link = <Link>,
    SL_Type = <Type>,
WHERE SL_ID = <ID>;

-- Update Task information
UPDATE Task
SET 
    T_Description = <Description>,
    T_StartDate = <StartDate>,
    T_EndDate = <EndDate>,
    T_Status = <Status>
WHERE 
    T_ID = <ID>;

-- Update Message details
UPDATE Message
SET 
    M_Content = <Content>,
    M_DateSent = <DateSent>
WHERE 
    M_ID = <ID>;

-- Update Post information
UPDATE Post
SET 
    P_Title = <Title>,
    P_Content = <Content>,
    P_DatePosted = <DatePosted>
WHERE 
    P_ID = <ID>;


--  Get every single project based on the Client
SELECT * 
FROM Project
WHERE PR_ID IN (
    SELECT PR_ID 
    FROM JoinCreate 
    WHERE C_ID = <ID>
);

-- Get every single client based on the project
SELECT *
FROM Client
WHERE C_ID IN (
    SELECT C_ID 
    FROM JoinCreate
    WHERE PR_ID = <ID>
);

-- Get the project based on the Post
SELECT *
FROM Project
WHERE PR_ID IN (
    SELECT PR_ID
    FROM LinkUp
    WHERE P_ID = <ID>
);

-- Get the post based on the Project
SELECT *
FROM Post
WHERE P_ID IN (
    SELECT P_ID
    FROM LinkUp
    WHERE PR_ID = <ID>
);

-- Get Comments based on the PostTag
SELECT *
FROM Comment
WHERE P_ID IN (
    SELECT P_ID
    FROM PostTag
    WHERE TA_ID = <ID>
);

-- Get comments based on comments
SELECT *
FROM Comment
WHERE CO_SuperID = <ID>;

-- Get tag based on Post 
SELECT *
FROM Tag
WHERE TA_ID IN (
    SELECT TA_ID
    FROM PostTag
    WHERE P_ID = <ID>
);

-- Get tag based on ProjectTag
SELECT *
FROM Tag
WHERE TA_ID IN (
    SELECT TA_ID
    FROM ProjectTag
    WHERE PR_ID = <ID>
);

-- Get tag based on tag details type 
SELECT *
FROM Tag
WHERE TA_ID IN (
    SELECT TA_ID
    FROM TagDetails
    WHERE TD_Type = <TYPE>
);

-- Get tag details based on TagDetails
SELECT *
FROM TagDetails
WHERE TA_ID = <ID>;

-- Get task based on Project
SELECT *
FROM Task
WHERE PR_ID = <ID>;

-- Get tasks based on client from notify
SELECT *
FROM Task
WHERE TA_ID IN (
    SELECT TA_ID
    FROM Notify
    WHERE C_ID = <ID>
);

-- Get tasks based on status 
SELECT *
FROM Task
WHERE T_Status = <Status>;

-- Get messages based on client 
SELECT *
FROM Message
WHERE M_ID IN (
    SELECT M_ID
    FROM Send
    WHERE C_ID = <ID>
);

-- Get all of the E-Company Names
SELECT EC_Name 
FROM EntrepreneurCompany;

-- Get all of the Developer Technologies
SELECT DT_Name
FROM DeveloperTechnology;

-- Get all of the Admins based on username
SELECT *
FROM Admins
WHERE A_Username LIKE <Username>;

-- Get all of the Clients based on username 
SELECT *
FROM Client
WHERE C_Username LIKE <Username>;

-- Get all of the clients based on education 
SELECT *
FROM Client
WHERE C_ID IN (
    SELECT C_ID
    FROM Education
    WHERE ED_School LIKE <School>
);

-- Get all of the Entrepreneurs based on company Names
SELECT *
FROM Entrepreneur
WHERE E_ID IN (
    SELECT E_ID
    FROM EntrepreneurCompany
    WHERE EC_Name LIKE <Name>
);

-- Insert a new Client
INSERT INTO Client (C_Name, C_Email, C_PhoneNumber, C_Address)
VALUES (<Name>, <Email>, <PhoneNumber>, <Address>);

-- Insert a new Admin
INSERT INTO Admin (A_Name, A_Email, A_PhoneNumber)
VALUES (<Name>, <Email>, <PhoneNumber>);

-- Insert a new Project
INSERT INTO Project (PR_Name, PR_Description, PR_StartDate, PR_EndDate)
VALUES (<ProjectName>, <ProjectDescription>, <StartDate>, <EndDate>);

-- Insert a new Task
INSERT INTO Task (T_Description, T_StartDate, T_EndDate, T_Status, D_ID)
VALUES (<Description>, <StartDate>, <EndDate>, <Status>, <DeveloperID>);

-- Insert a new Developer
INSERT INTO Developer (D_Name, D_Email, D_SkillSet)
VALUES (<Name>, <Email>, <SkillSet>);

-- Insert a new Entrepreneur
INSERT INTO Entrepreneur (E_Name, E_Email, E_Company)
VALUES (<Name>, <Email>, <Company>);

-- Insert a new Tag
INSERT INTO Tag (TA_Name)
VALUES (<TagName>);

-- Insert a new Message
INSERT INTO Message (M_Content, M_DateSent, M_SenderID, M_ReceiverID)
VALUES (<Content>, <DateSent>, <SenderID>, <ReceiverID>);

-- Insert a new Post
INSERT INTO Post (P_Title, P_Content, P_DatePosted, C_ID)
VALUES (<Title>, <Content>, <DatePosted>, <ClientID>);

-- Insert a new Comment
INSERT INTO Comment (CO_Content, CO_DatePosted, P_ID, C_ID)
VALUES (<Content>, <DatePosted>, <PostID>, <ClientID>);

-- Insert a new Project-Client association
INSERT INTO JoinCreate (PR_ID, C_ID)
VALUES (<ProjectID>, <ClientID>);

-- Insert a new Project-Admin association
INSERT INTO ProjectAdmin (PR_ID, A_ID)
VALUES (<ProjectID>, <AdminID>);

-- Insert a new Post-Tag association
INSERT INTO PostTag (P_ID, TA_ID)
VALUES (<PostID>, <TagID>);

-- Insert a new Post-Client association
INSERT INTO PostClient (P_ID, C_ID)
VALUES (<PostID>, <ClientID>);

-- Insert a new Developer-Client association
INSERT INTO DeveloperClient (D_ID, C_ID)
VALUES (<DeveloperID>, <ClientID>);

-- Insert a new Entrepreneur-Developer association
INSERT INTO EntrepreneurDeveloper (E_ID, D_ID)
VALUES (<EntrepreneurID>, <DeveloperID>);

-- Insert a new Task-Client association
INSERT INTO TaskClient (T_ID, C_ID)
VALUES (<TaskID>, <ClientID>);

-- Insert a new Send association for messages
INSERT INTO Send (M_ID, C_ID)
VALUES (<MessageID>, <ClientID>);

-- Insert a new Notification
INSERT INTO Notify (C_ID, A_ID, N_Message, N_Date)
VALUES (<ClientID>, <AdminID>, <Message>, <Date>);

-- Insert a new Task-Tag association
INSERT INTO TaskTag (T_ID, TA_ID)
VALUES (<TaskID>, <TagID>);

-- Delete a Client
DELETE FROM Client
WHERE C_ID = <ID>;

-- Delete an Admin
DELETE FROM Admin
WHERE A_ID = <ID>;

-- Delete a Project
DELETE FROM Project
WHERE PR_ID = <ID>;

-- Delete a Task
DELETE FROM Task
WHERE T_ID = <ID>;

-- Delete a Developer
DELETE FROM Developer
WHERE D_ID = <ID>;

-- Delete an Entrepreneur
DELETE FROM Entrepreneur
WHERE E_ID = <ID>;

-- Delete a Tag
DELETE FROM Tag
WHERE TA_ID = <ID>;

-- Delete a Message
DELETE FROM Message
WHERE M_ID = <ID>;

-- Delete a Post
DELETE FROM Post
WHERE P_ID = <ID>;

-- Delete a Comment
DELETE FROM Comment
WHERE CO_ID = <ID>;

-- Delete a Project-Client association
DELETE FROM JoinCreate
WHERE PR_ID = <ProjectID> AND C_ID = <ClientID>;

-- Delete a Project-Admin association
DELETE FROM ProjectAdmin
WHERE PR_ID = <ProjectID> AND A_ID = <AdminID>;

-- Delete a Post-Tag association
DELETE FROM PostTag
WHERE P_ID = <PostID> AND TA_ID = <TagID>;

-- Delete a Post-Client association
DELETE FROM PostClient
WHERE P_ID = <PostID> AND C_ID = <ClientID>;

-- Delete a Developer-Client association
DELETE FROM DeveloperClient
WHERE D_ID = <DeveloperID> AND C_ID = <ClientID>;

-- Delete an Entrepreneur-Developer association
DELETE FROM EntrepreneurDeveloper
WHERE E_ID = <EntrepreneurID> AND D_ID = <DeveloperID>;

-- Delete a Task-Client association
DELETE FROM TaskClient
WHERE T_ID = <TaskID> AND C_ID = <ClientID>;

-- Delete a Send association for a message
DELETE FROM Send
WHERE M_ID = <MessageID> AND C_ID = <ClientID>;

-- Delete a Notification
DELETE FROM Notify
WHERE N_ID = <NotificationID>;

-- Delete a Task-Tag association
DELETE FROM TaskTag
WHERE T_ID = <TaskID> AND TA_ID = <TagID>;

-- Delete a client and all related associations (such as tasks, posts, etc.)
DELETE FROM Client
WHERE C_ID = <ID>;

-- Delete a project and all related associations (such as project-client, project-admin, etc.)
DELETE FROM Project
WHERE PR_ID = <ID>;

-- Delete a developer and all related associations (such as task-client, developer-client, etc.)
DELETE FROM Developer
WHERE D_ID = <ID>;

-- Delete a tag and all related associations (such as post-tag, task-tag)
DELETE FROM Tag
WHERE TA_ID = <ID>;

-- Delete a message and all related associations (such as send messages)
DELETE FROM Message
WHERE M_ID = <ID>;
