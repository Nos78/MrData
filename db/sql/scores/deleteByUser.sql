DELETE FROM scores
USING users
WHERE scores.user_id = users.id
AND users.user_id = ${userId};
