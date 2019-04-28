/*
    Quickly deletes all records from table Guilds
    and all dependent records from table Scores.
    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/
TRUNCATE TABLE ${schema~}.guilds CASCADE
