-- MySQL dump 10.13  Distrib 5.6.50, for Linux (x86_64)
--
-- Host: localhost    Database: testkmbkk
-- ------------------------------------------------------
-- Server version	5.6.50-log

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
-- Table structure for table `audio_files`
--

DROP TABLE IF EXISTS `audio_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audio_files` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(50) DEFAULT NULL,
  `file_path` varchar(100) NOT NULL,
  `play_time` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_played` bit(1) NOT NULL DEFAULT b'0',
  `is_deleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`file_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audio_files`
--

LOCK TABLES `audio_files` WRITE;
/*!40000 ALTER TABLE `audio_files` DISABLE KEYS */;
INSERT INTO `audio_files` VALUES (1,'[ LIVE ] ซาน คอนเสรต คนกลางคนไมทงกน The Play RCA [','upload_6e895e464c705b9f3779854548338cb1','2021-11-17 15:11:53',3,'\0',''),(2,'[ LIVE ] ซาน คอนเสรต คนกลางคนไมทงกน The Play RCA [','upload_6e895e464c705b9f3779854548338cb1','2021-11-17 15:13:20',3,'\0',''),(3,'FM93.5','https://coolism-web3rd.cdn.byteark.com/stream/','2021-11-17 15:20:36',3,'\0',''),(4,'bell-end.mp3','upload_b930bce6a66c5a6fc498b2a0a7bc30f8','2021-11-17 17:36:57',3,'\0',''),(5,'bell-start.mp3','upload_4953fdc01a5ec9f6fb0af123dec56662','2021-11-17 17:38:20',3,'\0',''),(6,'bell-end.mp3','upload_b930bce6a66c5a6fc498b2a0a7bc30f8','2021-11-17 17:39:50',3,'\0',''),(7,'bell-end.mp3','upload_b930bce6a66c5a6fc498b2a0a7bc30f8','2021-11-17 18:51:42',3,'\0',''),(8,'五星红旗印风飘扬.mp3','upload_c5d4a5038966dd34513f717edfe3ff4a','2021-11-17 20:27:20',3,'\0',''),(9,'Chill music ','upload_20f2669f5f9c803459f6b5a9f5675ef6','2021-11-17 20:32:48',3,'\0',''),(10,'Chill music ','upload_20f2669f5f9c803459f6b5a9f5675ef6','2021-11-17 20:35:38',3,'\0',''),(11,'FM93.5','https://coolism-web3rd.cdn.byteark.com/stream/','2021-11-17 20:36:51',3,'\0',''),(12,'[ LIVE ] ซาน คอนเสรต คนกลางคนไมทงกน The Play RCA [','upload_6e895e464c705b9f3779854548338cb1','2021-11-17 21:10:33',3,'\0',''),(13,'Chill music ','upload_20f2669f5f9c803459f6b5a9f5675ef6','2021-11-17 21:11:46',3,'\0',''),(14,'Chill music ','upload_20f2669f5f9c803459f6b5a9f5675ef6','2021-11-17 21:16:16',3,'\0',''),(15,'11111','https://coolism-web3rd.cdn.byteark.com/stream/','2021-11-28 21:14:36',3,'\0','\0');
/*!40000 ALTER TABLE `audio_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channels`
--

DROP TABLE IF EXISTS `channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL,
  `chName` varchar(50) NOT NULL,
  `chLink` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channels`
--

LOCK TABLES `channels` WRITE;
/*!40000 ALTER TABLE `channels` DISABLE KEYS */;
INSERT INTO `channels` VALUES (4,73,'Test Channel','http://66.249.106.118/0.m3u8'),(6,73,'Test Channel','http://66.249.106.118/0.m3u8'),(7,79,'Test Channel','http://66.249.106.118/0.m3u8'),(8,73,'Live','http://66.249.106.118/0.m3u8');
/*!40000 ALTER TABLE `channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fav_users`
--

DROP TABLE IF EXISTS `fav_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fav_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `fav_userid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fav_users`
--

LOCK TABLES `fav_users` WRITE;
/*!40000 ALTER TABLE `fav_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `fav_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_files`
--

DROP TABLE IF EXISTS `media_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_files` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(50) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `play_time` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_played` bit(1) NOT NULL DEFAULT b'0',
  `is_deleted` bit(1) NOT NULL DEFAULT b'0',
  `remarks` text,
  PRIMARY KEY (`file_id`)
) ENGINE=MyISAM AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_files`
--

LOCK TABLES `media_files` WRITE;
/*!40000 ALTER TABLE `media_files` DISABLE KEYS */;
INSERT INTO `media_files` VALUES (1,'[ LIVE ] ซาน คอนเสรต คนกลางคนไมทงกน The Play RCA [','upload_6e895e464c705b9f3779854548338cb1','',3,'\0','',NULL),(2,'[ LIVE ] ซานิ คอนเสิร์ต คนกลางคืนไม่ทิ้งกัน @The P','upload_640743b1463d7934937b34ec804f5304','',3,'\0','',NULL),(3,'Chill music ','upload_20f2669f5f9c803459f6b5a9f5675ef6','',3,'\0','',NULL),(4,'FM93.5','https://coolism-web3rd.cdn.byteark.com/stream/','',3,'\0','',NULL),(5,'อยากเกบเธอไวทงสองคน ทาทา ยง I by เอมม prAy Chill m','upload_d1e45f8836e2e564ad09e54a72491360','',3,'\0','',NULL),(6,'รกเธอไมมวนหยด - ออน เกวลน I Cover by เอมม [ prAy ]','upload_203fb205198331327267f20628e5005f','',3,'\0','',NULL),(7,'คนอยางฉนถกโยนทงขวาง กลบมเธอรบเอามาใสใจดแล.mp3','upload_2ef279cb29062f51bdccc46c28c70f1c','',3,'\0','',NULL),(8,'bell-end.mp3','upload_b930bce6a66c5a6fc498b2a0a7bc30f8','',3,'\0','',NULL),(9,'bell-start.mp3','upload_4953fdc01a5ec9f6fb0af123dec56662','',3,'\0','',NULL),(10,'报警声.mp3','upload_5de604355f844379212d685b32df9429','',3,'\0','',NULL),(11,'ambulance.mp3','upload_f42a266de4ebf8328de65f63ffd304a9','',3,'\0','',NULL),(12,'五星红旗印风飘扬.mp3','upload_c5d4a5038966dd34513f717edfe3ff4a','',3,'\0','',NULL),(13,'coolism','https://coolism-web3rd.cdn.byteark.com/stream/','',3,'\0','',NULL),(14,'01. Innovation - AShamaluev Music.mp3','upload_da32961892b76cb4763ca7c26047c1d0','',3,'\0','',NULL),(15,'01. Motivational - AShamaluevMusic.mp3','upload_8c5cbf4d14e014b72181593e29c34d46','',3,'\0','',NULL),(16,'Free as the wind.mp3','upload_373c99ac31d4a757f5ba60c446dd5768','',3,'\0','',NULL),(17,'bell-start.mp3','upload_ced74707847609da6ca9ef2ca49ae8ec','',3,'\0','',NULL),(18,'11111','https://coolism-web3rd.cdn.byteark.com/stream/','',3,'\0','',NULL),(19,'bell-end.mp3','upload_1dcea74b63c481e037d2da288cf58055','',3,'\0','',NULL),(20,'约定-音效.mp3','upload_54462107bba2a9b362014269c41b90b1','',3,'\0','',NULL),(21,'祝你一路顺风.mp3','upload_ed900f668d24a46e8cf1f4c7731bd0bb','',3,'\0','',NULL),(22,'约定-音效.mp3','upload_29b32a6740f828f8f5690b19791ba46b','',3,'\0','',NULL),(23,'cool2','http://coolism-web3rd.cdn.byteark.com/stream/','',3,'\0','',NULL),(24,'祝你一路顺风.mp3','upload_da00eafe1946bd2f1251956034f59a9b','',3,'\0','',NULL),(25,'约定-音效.mp3','upload_3c7d35a729d4a2782c1ac3cfb5eb298d','',3,'\0','',NULL),(26,'10 一生何求.wav','upload_971f3cbf177d11ffcdd401d5d303ce04','',3,'\0','',NULL),(27,'10 一生何求.wav','upload_76c1c1fe2eab29b3db44d4bd4a1193d9','',3,'\0','',NULL),(28,'最好听版翻唱你的样子配上阿郎的故事经典至极感人肺腑.mp3','upload_292fff4993ea65cf0b055a456ed7c013','',3,'\0','',NULL),(29,'潘美辰 经典回顾我想有个家.mp3','upload_4508cad267bf34fb4c2163fc78517641','',3,'\0','',NULL),(30,'อยากเกบเธอไวทงสองคน ทาทา ยง I by เอมม prAy Chill m','upload_dcce951f9c4886e5f9ddc1d4c72e6c57','',3,'\0','',NULL),(31,'รกเธอไมมวนหยด - ออน เกวลน I Cover by เอมม [ prAy ]','upload_772adf3d330f67f48a4f0e00d4796a7c','',3,'\0','',NULL),(32,'คนอยางฉนถกโยนทงขวาง กลบมเธอรบเอามาใสใจดแล.mp3','upload_4dc02d83a58d3fe774789201ffdeb443','',3,'\0','',NULL),(33,'เลอกไดไหม - พนช วรกาญจน [Live] รานเรา ศรนครรนทร [2','upload_f7f363ac1889f3f685246a2c74d2cb3f','',3,'\0','',NULL),(34,'Twins下一站天后[Official MV].mp3','upload_4f5cd016755f585c9f7b54f9f9191fd4','',3,'\0','',NULL),(35,'alan 阿蘭 - 瀟灑走一回 Run Without Care [LIVE] (201207榮耀時','upload_6f74d3a948d214b609dd2f666b4a2349','',3,'\0','',NULL),(36,'[ LIVE ] ซานิ คอนเสิร์ต คนกลางคืนไม่ทิ้งกัน @The P','upload_9f87d878bff457ddb03767e7cf085241','',3,'\0','',NULL),(37,'[[ ใหม!! ]] กวาง จรพรรณ - บนรถแหยองเบามหาสารคาม EP','upload_3e46bd369dbbeeb17633f8048d73d08b','',3,'\0','',NULL),(38,'COOL','https://coolism-web3rd.cdn.byteark.com/stream/','',3,'\0','',NULL),(39,'[ LIVE ] ซาน คอนเสรต คนกลางคนไมทงกน The Play RCA [','upload_9cc807eafcb24d8ba1fdaf9b3604bb13','',3,'\0','',NULL),(40,'[ LIVE ] ซานิ คอนเสิร์ต คนกลางคืนไม่ทิ้งกัน @The P','upload_83d46f2e636977f3da32795ff844ffbe','',3,'\0','',NULL),(41,'[[ ใหม!! ]] กวาง จรพรรณ - บนรถแหยองเบามหาสารคาม EP','upload_8c700f5b073dce4bb32d25ef413aea0f','',3,'\0','',NULL),(42,'alan 阿蘭 - 瀟灑走一回 Run Without Care [LIVE] (201207榮耀時','upload_5f9201b7b603ad7adbf7b5dfd895e50e','',3,'\0','',NULL),(43,'Chill music ','upload_96463431e586f7838e781444383fe0ee','',3,'\0','',NULL),(44,'Twins下一站天后[Official MV].mp3','upload_cf937bb72d7ca9e91268b5e34173416e','',3,'\0','',NULL),(45,'เลอกไดไหม - พนช วรกาญจน [Live] รานเรา ศรนครรนทร [2','upload_f9268971cde5c6238082872d0ddba4ed','',3,'\0','',NULL),(46,'คนอยางฉนถกโยนทงขวาง กลบมเธอรบเอามาใสใจดแล.mp3','upload_0ae236fc378e9bf36e31ae5974150485','',3,'\0','',NULL),(47,'รกเธอไมมวนหยด - ออน เกวลน I Cover by เอมม [ prAy ]','upload_62201572e05accd3ccd022456b6144d2','',3,'\0','',NULL),(48,'อยากเกบเธอไวทงสองคน ทาทา ยง I by เอมม prAy Chill m','upload_70eb97ac77d78784dd43ef4929ab612d','',3,'\0','',NULL),(49,'潘美辰 经典回顾我想有个家.mp3','upload_048f709d2a323d02799868b26769d18c','',3,'\0','',NULL),(50,'祝你一路顺风.mp3','upload_7c40a5340a43f3f7e022cc37c98b7e85','',3,'\0','',NULL),(51,'约定-音效.mp3','upload_f964333c6b70e024cb016b821dff8bf1','',3,'\0','',NULL),(52,'五星红旗印风飘扬.mp3','upload_615883ca23169e6d8d07b01f6e185c4b','',3,'\0','',NULL),(53,'01 Fashion by AShamaluevMusic.mp3','upload_63e2dfd16f051574b1bf169ccdadf8ee','',3,'\0','',NULL),(54,'01. Cheerful Whistle - AShamaluev.mp3','upload_42ae079a27efafbe6e14810cc2d68161','',3,'\0','',NULL),(55,'01. Corporate - AShamaluev Music.mp3','upload_a9c088ee28e219a1d170ac15693a951d','',3,'\0','',NULL),(56,'01. Corporate Presentation.mp3','upload_a9181f89edfffb09b8562b3f582eac78','',3,'\0','',NULL),(57,'01. Corporate Upbeat - AShamaluev.mp3','upload_3c7d236b909d5837b96d7af94ddf5cc1','',3,'\0','',NULL),(58,'01. Documentary - AShamaluevMusic (1).mp3','upload_bc9a40575bd2413e1de5d943e9258318','',3,'\0','',NULL),(59,'01. Documentary - AShamaluevMusic.mp3','upload_58c7abe15068ad7ec63fb61e07539d71','',3,'\0','',NULL),(60,'01. Energetic Rock - AShamaluev.mp3','upload_13105b23c968d4f97442f101b727be6a','',3,'\0','',NULL),(61,'01. Happy Day.mp3','upload_6ffc0d219d05075429252318523aac8b','',3,'\0','',NULL),(62,'01. Happy Ukulele - AShamaluev Music.mp3','upload_48d49dff79a0853da7cc876a3142c3f6','',3,'\0','',NULL),(63,'让我们当期霜降.mp3','upload_48fcfa36ed0aecc9766695d810e36c74','',3,'\0','',NULL),(64,'09.张三的歌.wav','upload_7b94482de0f5d68ee43a7117fae06f30','',3,'\0','',NULL),(65,'小虎队 - 叫你一声MY LOVE【Q群：214696318】.wav','upload_77c68511f903a76656413046bd98b0c8','',3,'\0','',NULL),(66,'Beyond - 光辉岁月.wav','upload_e8f7c83bd7d786d7ea1fcdd006ffcf94','',3,'\0','',NULL),(67,'02.明天你是否依然爱我.wav','upload_51aae3293d2cfdc1d5d0a0714880586f','',3,'\0','',NULL),(68,'那英 - 好大一棵树【Q群：214696318】.wav','upload_fd35bbda285088c2eb3966b03c2ed4dc','',3,'\0','',NULL),(69,'李翊君 - 风中的承诺【Q群：214696318】.wav','upload_f951bc0ead9bd164435c3f5ef53190d5','',3,'\0','',NULL),(70,'Twins下一站天后[Official MV].mp3','upload_eccd9dda863dc6b7a62b475505c83ecc','',3,'\0','',NULL),(71,'alan 阿蘭 - 瀟灑走一回 Run Without Care [LIVE] (201207榮耀時','upload_770b7cd109de9602f34dab7f4ebf3543','',3,'\0','',NULL),(72,'Romantic_Guitar.mp3','upload_69724d0ab6edd76a894813a38ab8a860','',3,'\0','',NULL),(73,'asdfasdf','https://portal.kylinaudio.com/admin/panel.html?user=9996','',3,'\0','',NULL),(74,'孟庭苇冬季到台北来看雨.flv.mp3','upload_8fec9ee312529b36a509c6aafb5d066c','',3,'\0','',NULL),(75,'最好听版翻唱你的样子配上阿郎的故事经典至极感人肺腑.mp3','upload_c73f4f3979d5155148c7631630c2dfa2','',3,'\0','',NULL),(76,'เลอกไดไหม - พนช วรกาญจน [Live] รานเรา ศรนครรนทร [2','upload_2b439d69026a895c0f98186140932b04','',3,'\0','',NULL),(77,'[[ ใหม!! ]] กวาง จรพรรณ - บนรถแหยองเบามหาสารคาม EP','upload_8382d9b26eccdef8e81308efadb9a2fa','',3,'\0','',NULL),(78,'[[ ใหม!! ]] กวาง จรพรรณ - บนรถแหยองเบามหาสารคาม EP','upload_5a13f38dd1197e959b404c9b2f25436d','',3,'\0','',NULL),(79,'方季惟 - 愛情的故事.mp3','upload_80daa639be2ed902e25eeb4708925af0','',3,'\0','',NULL),(80,'孟庭苇冬季到台北来看雨.flv.mp3','upload_5e86d78a7132decdc6b3878c94e44a85','',3,'\0','',NULL),(81,'bensound-anewbeginning.mp3','upload_57804f32910279109220eea9a4a43599','',3,'\0','',NULL),(82,'约定-音效.mp3','upload_c69f48348f04e4daa29254b96c980fcc','',3,'\0','',NULL),(83,'bensound-smallguitar.mp3','upload_65105afab6f2f986719025963bb271ab','',3,'\0','',NULL),(84,'bensound-sweet.mp3','upload_f8e19695119b33f10dce48f3f86bdc82','',3,'\0','',NULL),(85,'Movavi Effects Store Fantasy Intro Pack.mp3','upload_edeaddcecf42ddec06b4419f157655c0','',3,'\0','',NULL),(86,'bensound-ukulele.mp3','upload_14576832bafd287f58ea5b40578e0163','',3,'\0','',NULL),(87,'bensound-tenderness.mp3','upload_4918be7516e24e31c38a142eeb9ab293','',3,'\0','',NULL),(88,'bensound-smile.mp3','upload_d87a3de01d5075a21c2ffc49a1f41eab','',3,'\0','',NULL),(89,'Movavi Effects Store Lifestyle Bloggers.mp3','upload_f232e024bcadca900fbc8161e4f049df','',3,'\0','',NULL),(90,'bensound-sunny.mp3','upload_0b30813869e04d0390693fb39617db8b','',3,'\0','',NULL),(91,'bensound-punky.mp3','upload_99dc8c94d2033786b79f2c78d58dcaa3','',3,'\0','',NULL),(92,'อยากเกบเธอไวทงสองคน ทาทา ยง I by เอมม prAy Chill m','upload_844ea5ad09c7e3fd4a8e77eadaf43d68','',3,'\0','',NULL),(93,'刘畅 - 同一首歌【Q群：214696318】.wav','upload_142f56fef23f141c65c996a1a98a518a','',3,'\0','',NULL),(94,'tongyishouge.wav','upload_5a5ab979d8b5e944be8c363793d7e50b','',3,'\0','',NULL),(95,'01 容易受伤的女人.wav','upload_5a47fdcec13df0e8e10209e25c0eb77b','',3,'\0','',NULL),(96,'潘美辰 经典回顾我想有个家.mp3','upload_2f2ebab1045bdff52bc8ae665c8e2755','',3,'\0','',NULL),(97,'最好听版翻唱你的样子配上阿郎的故事经典至极感人肺腑.mp3','upload_0d6ab156d9db6621985c01b6a976e7bc','',3,'\0','',NULL),(98,'bensound-buddy.mp3','upload_737e37c732cce35ab6b6c378c98ace6e','',3,'\0','\0',NULL),(99,'bensound-acousticbreeze.mp3','upload_ed8c85b677639e5dbbdaf73bd5c99d9d','',3,'\0','\0',NULL),(100,'bensound-anewbeginning.mp3','upload_a396534cc1569671fa54de8c19c65721','',3,'\0','\0',NULL),(101,'bensound-creativeminds.mp3','upload_08dda6b725f27960bf281b0e4c80d728','',3,'\0','\0',NULL),(102,'bensound-cute.mp3','upload_fe7b3b6b212e410d2004be1115254aea','',3,'\0','\0',NULL),(103,'bensound-punky.mp3','upload_42c3fb00c0d8433b4536539520c7be48','',3,'\0','\0',NULL),(104,'bensound-happiness.mp3','upload_e71ff52acf63fb4e041d70311156a79d','',3,'\0','\0',NULL),(105,'bensound-smallguitar.mp3','upload_a2a0c67069323111c1beac09a5f72604','',3,'\0','\0',NULL),(106,'bensound-smile.mp3','upload_c332a8cdec111ba7d2953f0284aeeb20','',3,'\0','\0',NULL),(107,'bensound-ukulele.mp3','upload_7b5089349e33f2efb722f097550675e4','',3,'\0','\0',NULL),(108,'Movavi Effects Store Fantasy Intro Pack.mp3','upload_baed0412321c3164188154c041f68907','',3,'\0','\0',NULL),(109,'Movavi Effects Store Lifestyle Bloggers.mp3','upload_70d1743675426c56559dfbd7ffbfd2cd','',3,'\0','\0',NULL),(110,'bensound-tenderness.mp3','upload_ad23a209c0fbf5e1499b303349a7ea1a','',3,'\0','\0',NULL),(111,'Movavi Effects Store Travel Set.mp3','upload_6aaedc3fa29c8c09da02b593f1e96d4d','',3,'\0','\0',NULL),(112,'Twins下一站天后[Official MV].mp3','upload_431e4acde16b42128985c6cf217ba027','',3,'\0','',NULL);
/*!40000 ALTER TABLE `media_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(4) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(20) NOT NULL,
  `disturb` tinyint(1) NOT NULL DEFAULT '0',
  `incall` tinyint(1) NOT NULL DEFAULT '0',
  `autoanswer` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `cid` int(11) DEFAULT '73',
  `ip` varchar(20) DEFAULT '66.249.106.117',
  `sort_id` int(11) NOT NULL DEFAULT '0',
  `favourite` tinyint(1) NOT NULL DEFAULT '0',
  `user_volume` int(11) NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,9999,'aidan','8690',0,0,0,1,3,0,'66.249.106.117',0,0,5),(2,9998,'PUBLICGROUP','8690',0,0,0,0,2,0,'',0,0,5),(3,9997,'TEST','',0,0,0,0,2,0,'66.249.106.117',0,0,10),(4,9996,'tc','695',0,0,0,1,1,3,'',0,0,3),(5,9995,'00:00:FF:FF:00:00','449589344',0,0,0,1,0,3,'undefined',0,0,1),(6,9994,'48:FC:B6:5F:B3:01','449589344',0,0,0,1,0,3,'undefined',0,0,0),(10,9990,'test123','1422501792',0,0,0,1,0,3,'',0,0,0),(7,9993,'st','681',0,0,0,0,0,3,'',0,0,4),(8,9992,'CC:4B:73:67:0B:CC','449589344',0,0,0,1,0,3,'undefined',0,0,0),(9,9991,'F0:79:E8:F1:8F:DB','449589344',0,0,0,1,0,3,'undefined',0,0,0),(11,9989,'00:E0:4C:E4:4D:62','449589344',0,0,0,1,0,3,'undefined',0,0,0),(12,9988,'00:E0:4C:27:49:BD','449589344',0,0,0,1,0,3,'undefined',0,0,0),(24,9981,'F0:D2:68:65:AE:62','449589344',0,0,0,0,0,3,'undefined',0,0,6),(17,9986,'c63865a3-8e03-41ab-93a6-23c04dd7a1fe','449589344',0,0,0,1,0,3,'undefined',0,0,9),(18,9985,'5E:03:FA:85:C8:1B','449589344',0,0,0,1,0,3,'undefined',0,0,10),(25,9980,'F0:0D:14:83:42:09\r\n','449589344',0,0,0,1,0,3,'undefined',0,0,9),(16,9987,'90:DE:80:15:03:26','449589344',0,0,0,1,0,3,'undefined',0,0,10),(19,9984,'FC:A5:D0:C5:DE:FD','449589344',0,0,0,1,0,2,'undefined',0,0,10),(20,9983,'16:1C:BC:E4:BE:2B','449589344',0,0,0,1,0,2,'undefined',0,0,10),(21,9982,'9E:35:63:4E:01:11','449589344',0,0,0,1,0,2,'undefined',0,0,10),(26,9979,'47a98d86-1972-4204-bf9f-f953f755e876','449589344',0,0,0,1,0,3,'undefined',0,0,3),(27,9978,'36:C9:E3:F1:B8:05','449589344',0,0,0,1,0,3,'undefined',0,0,10),(28,9977,'sss1','540094',0,0,0,0,0,3,'',0,0,10);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'testkmbkk'
--

--
-- Dumping routines for database 'testkmbkk'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-11  6:42:40
