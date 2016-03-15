DROP TABLE LevelOfEducation;
CREATE TABLE LevelOfEducation(
   LevelofEducationID VARCHAR(19) NOT NULL PRIMARY KEY
  ,LevelofEducation VARCHAR(17) NOT NULL
);

INSERT INTO LevelOfEducation(LevelofEducationID,LevelofEducation) VALUES ('DL0001','Associate Degrees');
INSERT INTO LevelOfEducation(LevelofEducationID,LevelofEducation) VALUES ('DL0002','Bachelor Degrees');
INSERT INTO LevelOfEducation(LevelofEducationID,LevelofEducation) VALUES ('DL0003','Master Degrees');
INSERT INTO LevelOfEducation(LevelofEducationID,LevelofEducation) VALUES ('DL0004','Doctoral Degrees');
