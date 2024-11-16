-- =================================== DATABASE ===================================
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
    A_Auth_Level  INT             NOT NULL
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
    TD_Name       VARCHAR(50)     NOT NULL,
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
    P_ID          INT,
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

CREATE TABLE Send (
    S_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    M_ID          INT             NOT NULL,
    C_ID          INT             NOT NULL,
    FOREIGN KEY   (M_ID)          REFERENCES Message(M_ID) ON DELETE CASCADE
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE Notify (
    N_ID          INT             PRIMARY KEY AUTO_INCREMENT,
    TA_ID         INT             NOT NULL,
    C_ID          INT             NOT NULL,
    FOREIGN KEY   (TA_ID)         REFERENCES Tag(TA_ID) ON DELETE CASCADE
    FOREIGN KEY   (C_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
);

CREATE TABLE JoinCreate (
    JC_ID         INT            PRIMARY KEY AUTO_INCREMENT,
    PR_ID         INT            NOT NULL,
    C_ID          INT            NOT NULL,
    FOREIGN KEY   (C_ID)         REFERENCES Client(C_ID) ON DELETE CASCADE
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
    SL_Type = <Type>
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
