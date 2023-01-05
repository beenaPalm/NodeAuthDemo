------------------------------------------------------------------------------------------------

CREATE TABLE `users` (
  `id_users` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role` enum('APP_USER','ADMIN') DEFAULT 'APP_USER',
  `login_type` varchar(45) NOT NULL DEFAULT 'App',
  `user_status` tinyint DEFAULT '1',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_users`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

------------------------------------------------------------------------------------------------

CREATE TABLE `SessionUser`.`otp_verification` (
  `email` VARCHAR(255) NOT NULL,
  `verification_code` VARCHAR(6) NOT NULL,
  `expired_time` DATETIME NULL DEFAULT NULL,
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_verification` VARCHAR(45) NULL DEFAULT 0,
  PRIMARY KEY (`email`));

------------------------------------------------------------------------------------------------

CREATE TABLE `passport` (
  `user_id` bigint NOT NULL,
  `login_type` varchar(45) DEFAULT 'App',
  `password` varchar(255) NOT NULL DEFAULT '',
  `is_active` varchar(45) DEFAULT '0',
  `access_token` varchar(100) DEFAULT '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


------------------------------------------------------------------------------------------------

CREATE TABLE `devices_info` (
  `device_uniqueid` varchar(255) NOT NULL,
  `device_type` varchar(45) NOT NULL,
  `device_os_version` varchar(45) NOT NULL,
  `device_company` varchar(45) NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

------------------------------------------------------------------------------------------------

CREATE TABLE `otp_verification` (
  `email` varchar(255) NOT NULL,
  `verification_code` varchar(6) NOT NULL,
  `expired_time` datetime DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_verification` varchar(45) DEFAULT '0',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

------------------------------------------------------------------------------------------------

CREATE TABLE `user_activities_log` (
  `action_id` bigint NOT NULL,
  `action_type` enum('INSERT’,’UPDATE’,’DELETE') DEFAULT NULL,
  `action_url` varchar(100) NOT NULL DEFAULT '',
  `action_query` text,
  `action_status` tinyint NOT NULL DEFAULT '0' COMMENT '// Failed = 0\n// Sucess = 1\n// Error_execution = 127',
  `action_response_code` varchar(3) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

------------------------------------------------------------------------------------------------


CREATE TABLE `user_session` (
  `user_id` bigint NOT NULL,
  `device_id` varchar(500) NOT NULL,
  `serial_no` varchar(100) DEFAULT '',
  `refresh_token` varchar(100) DEFAULT '',
  `fcm_token` varchar(100) DEFAULT '',
  `is_expired` tinyint(1) DEFAULT '0',
  `created_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `modified_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`device_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

------------------------------------------------------------------------------------------------