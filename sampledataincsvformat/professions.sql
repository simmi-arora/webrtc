DROP TABLE professions;
CREATE TABLE professions(
   ProfessionID VARCHAR(15) NOT NULL PRIMARY KEY
  ,Professions VARCHAR(15) NOT NULL
);
INSERT INTO professions(ProfessionID,Professions) VALUES ('ProfessionID','Professions');
INSERT INTO professions(ProfessionID,Professions) VALUES ('P0001','Nursing');
INSERT INTO professions(ProfessionID,Professions) VALUES ('P0002','Engineering');
INSERT INTO professions(ProfessionID,Professions) VALUES ('P0003','Computers');
INSERT INTO professions(ProfessionID,Professions) VALUES ('P0004','Legal');
INSERT INTO professions(ProfessionID,Professions) VALUES ('P0005','Plumbing');