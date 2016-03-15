CREATE DATABASE  IF NOT EXISTS `serviceexchange` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `serviceexchange`;
-- MySQL dump 10.13  Distrib 5.5.41, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: serviceexchange
-- ------------------------------------------------------
-- Server version	5.5.44-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Specialisations`
--

DROP TABLE IF EXISTS `Specialisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Specialisations` (
  `SpecialisationID` varchar(16) NOT NULL,
  `Specialisation` varchar(28) NOT NULL,
  `ParentID` varchar(8) NOT NULL,
  PRIMARY KEY (`SpecialisationID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Specialisations`
--

LOCK TABLES `Specialisations` WRITE;
/*!40000 ALTER TABLE `Specialisations` DISABLE KEYS */;
INSERT INTO `Specialisations` VALUES ('P0001S0001','Advanced practice nursing','P0001'),('P0001S0002','Burn nursing','P0001'),('P0001S0003','Camp nursing','P0001'),('P0001S0004','Cardiac nursing','P0001'),('P0001S0005','Cardiac Intervention nursing','P0001'),('P0001S0006','Dental nursing','P0001'),('P0001S0007','Medical case management','P0001'),('P0001S0008','Community health nursing','P0001'),('P0002S0009','Chemical Engineering','P0002'),('P0002S0010','Civil engineering','P0002'),('P0002S0011','Electrical engineering','P0002'),('P0002S0012','Mechanical engineering','P0002'),('P0002S0013','Systems engineering','P0002'),('P0002S0014','Military engineering','P0002'),('P0002S0015','Nano engineering','P0002'),('P0002S0016','Nuclear engineering','P0002'),('P0002S0017','Petroleum engineering','P0002'),('P0003S0018','Application analyst','P0003'),('P0003S0019','Computer operator','P0003'),('P0003S0020','Computer repair technician','P0003'),('P0003S0021','Computer scientist','P0003'),('P0003S0022','Computer analyst','P0003'),('P0003S0023','Data entry clerk','P0003'),('P0003S0024','Database administrator','P0003'),('P0003S0025','Data analyst','P0003'),('P0003S0026','Data scientist','P0003'),('P0003S0027','Network analyst','P0003'),('P0003S0028','Network administrator','P0003'),('P0003S0029','Programmer','P0003'),('P0003S0030','HTML','P0003'),('P0003S0031','JavaScript','P0003'),('P0003S0032','CSS','P0003'),('P0003S0033','Perl','P0003'),('P0003S0034','Python','P0003'),('P0003S0035','Ruby','P0003'),('P0003S0036','PHP','P0003'),('P0003S0037','Java','P0003'),('P0003S0038','ASP','P0003'),('P0003S0039','NET','P0003'),('P0003S0040','Security engineer','P0003'),('P0003S0041','Software design','P0003'),('P0003S0042','Software analyst','P0003'),('P0003S0043','Software quality analyst','P0003'),('P0003S0044','System Administrator','P0003'),('P0003S0045','Web developer','P0003'),('P0004S0046','Common Law And Civil Law','P0004'),('P0004S0047','Divorce Law','P0004'),('P0004S0048','Immigration Law','P0004'),('P0004S0049','Corporate Law','P0004'),('P0004S0050','Taxation','P0004'),('P0004S0051','Criminal Law','P0004'),('P0004S0052','Administrative Law','P0004'),('P0004S0053','International Law','P0004'),('SpecialisationID','Specialisation','ParentID');
/*!40000 ALTER TABLE `Specialisations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-02 17:55:33
