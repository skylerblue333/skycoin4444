CREATE TABLE `course_progress` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `course_id` varchar(120) NOT NULL,
  `lesson_id` varchar(120) NOT NULL,
  `completed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `course_progress_id` PRIMARY KEY (`id`),
  CONSTRAINT `course_progress_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `course_progress_user_course_lesson_unique` UNIQUE (`user_id`, `course_id`, `lesson_id`)
);
