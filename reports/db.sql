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
    E_CompanyName VARCHAR(50),
    FOREIGN KEY   (E_ID)          REFERENCES Client(C_ID) ON DELETE CASCADE
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
SET C_Username = C_Username,
    C_Password = C_Password,
    C_Email = C_Email,
    C_FirstName = C_FirstName,
    C_LastName = C_LastName,
    C_MiddleName = C_MiddleName,
    C_Education = C_Education
WHERE C_ID = ID;
