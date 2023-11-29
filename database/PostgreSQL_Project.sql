-- PostgreSQL Table for UserAccount
CREATE TABLE UserAccount (
    Email VARCHAR(255) PRIMARY KEY CHECK (Email NOT LIKE '% %'),
    Username VARCHAR(255) UNIQUE NOT NULL CHECK (Username NOT LIKE '% %'),
    Password TEXT NOT NULL,
    AccountType VARCHAR(50) CHECK (AccountType IN ('standard', 'admin')),
    CreationDate TIMESTAMP NOT NULL,
    AccountStatus VARCHAR(50) CHECK (AccountStatus IN ('active', 'restricted', 'banned')),
    Bio TEXT
);
-- PostgreSQL Table for FeaturedContent
CREATE TABLE FeaturedContent (
    ContentID INT PRIMARY KEY,
    FeaturedDate TIMESTAMP NOT NULL
);
-- PostgreSQL Table for Comment
CREATE TABLE Comment (
    CommentID SERIAL PRIMARY KEY,
    UserEmail VARCHAR(255) REFERENCES UserAccount(Email),
    ContentID VARCHAR(25) NOT NULL,
    CommentText TEXT NOT NULL,
    CreationDate TIMESTAMP NOT NULL
);
-- PostgreSQL Table for Report
CREATE TABLE Report (
    ReportID SERIAL PRIMARY KEY,
    ItemID INT,
    ReporterID VARCHAR (255) REFERENCES UserAccount(Email),
    ItemType VARCHAR(50),
    ReportText TEXT NOT NULL,
    CreationDate TIMESTAMP NOT NULL,
    ReportType VARCHAR(50),
    ReportStatus VARCHAR(50) CHECK (ReportStatus IN ('Open', 'No Action', 'User Banned', 'User Restricted'))
);
-- PostgreSQL Table for Rating
CREATE TABLE Rating (
    UserEmail VARCHAR(255) REFERENCES UserAccount(Email),
    ContentID VARCHAR(25) NOT NULL,
    RatingType BOOLEAN,
    PRIMARY KEY (UserEmail, ContentID),
    CONSTRAINT unique_rating_entry UNIQUE (UserEmail, ContentID)
);
CREATE VIEW averageRating AS	
    SELECT contentid, avg(CAST(ratingtype AS INT))
    FROM rating
    GROUP BY contentid;

-- Indexes for the Comment Table
CREATE INDEX idx_comment_useremail ON Comment(UserEmail);
CREATE INDEX idx_comment_contentid ON Comment(ContentID);

-- Indexes for the Report Table
CREATE INDEX idx_report_itemid ON Report(ItemID);
CREATE INDEX idx_report_reporterid ON Report(ReporterID);
CREATE INDEX idx_report_reportstatus ON Report(ReportStatus);