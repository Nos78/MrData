/*
  see if the score table exist.
*/
SELECT EXISTS (
  SELECT table_name FROM information_schema.tables
  WHERE table_name = 'scores'
);
