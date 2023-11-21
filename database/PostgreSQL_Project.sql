-- PostgreSQL Table for UserAccount
CREATE TABLE UserAccount (
    Email VARCHAR(255) PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Password TEXT NOT NULL,
    AccountType VARCHAR(50) CHECK (AccountType IN ('standard', 'admin')),
    CreationDate TIMESTAMP NOT NULL,
    AccountStatus VARCHAR(50) CHECK (AccountStatus IN ('active', 'restricted', 'banned')),
    ProfilePic VARCHAR(255);
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
    PRIMARY KEY (UserEmail, ContentID)
);
CREATE VIEW averageRating AS	
	SELECT contentid, avg(CAST(ratingtype AS INT))
	FROM rating
	GROUP BY contentid

ALTER TABLE UserAccount
ADD CONSTRAINT username_no_space_check 
CHECK (Username NOT LIKE '% %');

ALTER TABLE UserAccount
ADD CONSTRAINT email_no_space_check 
CHECK (Email NOT LIKE '% %');

-- Indexes for the Comment Table
CREATE INDEX idx_comment_useremail ON Comment(UserEmail);
CREATE INDEX idx_comment_contentid ON Comment(ContentID);

-- Indexes for the Report Table
CREATE INDEX idx_report_itemid ON Report(ItemID);
CREATE INDEX idx_report_reporterid ON Report(ReporterID);
CREATE INDEX idx_report_reportstatus ON Report(ReportStatus);
/*
-- in order
INSERT INTO UserAccount (Email, Username, Password, AccountType, CreationDate, AccountStatus, Bio) VALUES
('john.doe@example.com', 'JohnDoe', 'hashed_password1', 'standard', '2023-04-01 10:00:00', 'active', 'Just a regular John Doe.'),
('jane.smith@example.com', 'JaneSmith', 'hashed_password2', 'admin', '2023-04-02 11:00:00', 'restricted', 'Jane Smith here, love photography and tech.');

INSERT INTO FeaturedContent (ContentID, FeaturedDate) VALUES
(1, '2023-04-03 09:00:00'),
(2, '2023-04-04 09:30:00');

INSERT INTO Comment (UserEmail, ContentID, CommentText, CreationDate) VALUES
('john.doe@example.com', 1, 'This is an interesting piece of content!', '2023-04-03 10:00:00'),
('jane.smith@example.com', 1, 'Really enjoyed this, thanks for sharing!', '2023-04-03 10:15:00');

INSERT INTO Report (ItemID, ReporterID, ItemType, ReportText, CreationDate, ReportType, ReportStatus) VALUES
(1, 'john.doe@example.com', 'comment', 'This comment is inappropriate.', '2023-04-04 10:00:00', 'Abuse', 'Open'),
(2, 'jane.smith@example.com', 'content', 'This content is stolen from another creator.', '2023-04-04 10:30:00', 'Copyright', 'Reviewed');

INSERT INTO Rating (UserEmail, ContentID, RatingType) VALUES
('john.doe@example.com', 1, 'positive'),
('jane.smith@example.com', 1, 'negative');
*/
