-- Social consistency hardening for the engineering beta.
-- Remove duplicate non-null edges before adding database uniqueness.

DELETE l1
FROM likes AS l1
INNER JOIN likes AS l2
  ON l1.post_id = l2.post_id
 AND l1.user_id = l2.user_id
 AND l1.id > l2.id
WHERE l1.post_id IS NOT NULL
  AND l1.user_id IS NOT NULL;

ALTER TABLE likes
  ADD UNIQUE KEY likes_post_user_unique (post_id, user_id);

-- Reconcile denormalized counters after duplicate removal.
UPDATE posts AS p
SET p.likes = (
  SELECT COUNT(*)
  FROM likes AS l
  WHERE l.post_id = p.id
);

DELETE f1
FROM follows AS f1
INNER JOIN follows AS f2
  ON f1.follower_id = f2.follower_id
 AND f1.following_id = f2.following_id
 AND f1.id > f2.id
WHERE f1.follower_id IS NOT NULL
  AND f1.following_id IS NOT NULL;

ALTER TABLE follows
  ADD UNIQUE KEY follows_follower_following_unique (follower_id, following_id);
